import "mocha";
import { expect } from "chai";
import { readFileSync } from "fs";
import { join } from "path";
import { Equipment_getCurrentGym } from "../src/models/equipment";
import { Exercise_toKey } from "../src/models/exercise";
import {
  Program_evaluate,
  Program_getAllUsedProgramExercises,
  Program_getProgramDay,
  Program_getProgramExerciseForKeyAndDay,
  Program_nextHistoryRecord,
  Program_runAllFinishDayScripts,
} from "../src/models/program";
import { Progress_getDayData, Progress_runUpdateScriptForEntry } from "../src/models/progress";
import { Settings_build } from "../src/models/settings";
import { Stats_getEmpty } from "../src/models/stats";
import { Weight_build } from "../src/models/weight";
import { PlannerEvaluator_evaluateFull } from "../src/pages/planner/plannerEvaluator";
import { PlannerProgram_evaluate, PlannerProgram_evaluateText } from "../src/pages/planner/models/plannerProgram";
import { PlannerProgramExercise_getState } from "../src/pages/planner/models/plannerProgramExercise";
import { IPlannerProgramExercise } from "../src/pages/planner/models/types";
import { IHistoryEntry, IHistoryRecord, IProgram, IProgramState, ISettings, IWeight } from "../src/types";
import { PlannerTestUtils_get } from "./utils/plannerTestUtils";

const mainSteps: Record<string, number> = {
  squat_barbell: 5,
  benchPress_barbell: 2.5,
  deadlift_barbell: 5,
  overheadPress_barbell: 2.5,
};
const assistanceSteps: Record<string, number> = {
  benchPress_dumbbell: 1,
  latPulldown_cable: 2,
  cableCrunch_cable: 1,
  seatedRow_cable: 2,
  tricepsPushdown_cable: 1,
  splitSquat_dumbbell: 1,
};
const stats = Stats_getEmpty();

function programText(): string {
  const markdown = readFileSync(join(__dirname, "../programs/builtin/the531-home-gym.md"), "utf8");
  const script = markdown.match(/```liftoscript\s*\r?\n([\s\S]*?)```/);
  expect(script, "the built-in program must contain its importable Liftoscript").not.to.equal(null);
  return script![1];
}

function setup(options?: { fallbackTm?: boolean; assistanceLoad?: number; badCycles?: number }): {
  program: IProgram;
  settings: ISettings;
} {
  // The shipped file carries the author's TMs and assistance loads; tests use a round 100kg TM (or 0kg to
  // exercise the 1RM fallback) and one assistance load for every exercise (0kg exercises the first-use prompt).
  let text = programText()
    .replace(/tm: [0-9.]+kg/g, options?.fallbackTm ? "tm: 0kg" : "tm: 100kg")
    .replace(/load: [0-9.]+kg/g, `load: ${options?.assistanceLoad ?? 0}kg`);
  if (options?.badCycles != null) {
    text = text.replace("badCycles: 0", `badCycles: ${options.badCycles}`);
  }
  const { program } = PlannerTestUtils_get(text);
  const settings = { ...Settings_build(), units: "kg" as const };
  for (const key of [...Object.keys(mainSteps), ...Object.keys(assistanceSteps)]) {
    // Fine, explicitly configured load increments keep percentage checks independent of stock plates.
    settings.exerciseData[key] = { rm1: Weight_build(200, "kg"), rounding: 0.1 };
  }
  return { program, settings };
}

function state(program: IProgram, settings: ISettings, key: string): IProgramState {
  const exercise = Program_getAllUsedProgramExercises(Program_evaluate(program, settings)).find(
    (e) => Exercise_toKey(e.exerciseType) === key
  );
  expect(exercise, `missing exercise ${key}`).not.to.equal(undefined);
  return PlannerProgramExercise_getState(exercise!);
}

function entry(record: IHistoryRecord, key: string): IHistoryEntry {
  const result = record.entries.find((e) => Exercise_toKey(e.exercise) === key);
  expect(result, `missing workout entry ${key}`).not.to.equal(undefined);
  return result!;
}

function complete(record: IHistoryRecord): void {
  for (const e of record.entries) {
    const isMain = mainSteps[Exercise_toKey(e.exercise)] != null;
    for (const set of e.sets) {
      set.completedWeight = isMain || set.weight!.value > 0 ? set.weight : Weight_build(20, "kg");
      set.completedReps = set.isAmrap ? Math.max(5, set.reps!) : set.reps;
      if (set.isUnilateral) {
        set.completedRepsLeft = set.completedReps;
      }
      set.isCompleted = true;
    }
  }
}

function skip(e: IHistoryEntry): void {
  e.sets.forEach((set) => {
    set.isCompleted = false;
    set.completedReps = undefined;
    set.completedRepsLeft = undefined;
    set.completedWeight = undefined;
  });
}

function finish(program: IProgram, settings: ISettings, record: IHistoryRecord): IProgram {
  const errors: string[] = [];
  const result = Program_runAllFinishDayScripts(program, record, stats, settings, (error) => errors.push(error));
  expect(errors).to.eql([]);
  expect(result.exerciseData, "progression must not change saved 1RMs").to.eql({});
  return result.program;
}

function workout(
  program: IProgram,
  settings: ISettings,
  day?: number,
  change?: (record: IHistoryRecord) => void
): IProgram {
  const record = Program_nextHistoryRecord(program, settings, stats, day);
  complete(record);
  change?.(record);
  return finish(program, settings, record);
}

describe("5/3/1 Home Gym built-in program", () => {
  it("evaluates all 21 sessions with the intended main sets, percentages, FSL, and lighter week", () => {
    const { program, settings } = setup();
    const evaluated = PlannerProgram_evaluate(program.planner!, settings);
    expect(evaluated.evaluatedWeeks).to.have.length(7);
    expect(evaluated.evaluatedWeeks.flat().flatMap((d) => (d.success ? [] : [d.error.message]))).to.eql([]);

    for (let day = 1; day <= 21; day++) {
      const record = Program_nextHistoryRecord(program, settings, stats, day);
      const week = Math.ceil(day / 3);
      const dayInWeek = ((day - 1) % 3) + 1;
      const expectedExercises =
        dayInWeek === 2
          ? ["deadlift_barbell", "overheadPress_barbell", ...Object.keys(assistanceSteps).slice(3)]
          : [
              ...(dayInWeek === 1 ? ["squat_barbell", "benchPress_barbell"] : ["benchPress_barbell", "squat_barbell"]),
              ...Object.keys(assistanceSteps).slice(0, 3),
            ];
      expect(
        record.entries.map((e) => Exercise_toKey(e.exercise)),
        `day ${day}`
      ).to.eql(expectedExercises);
      expect(
        record.entries.reduce((sum, e) => sum + e.sets.length, 0),
        `work sets on day ${day}`
      ).to.equal(week === 7 ? 12 : 31);
      for (const e of record.entries) {
        expect(e.warmupSets).to.eql([]);
        if (mainSteps[Exercise_toKey(e.exercise)] != null) {
          const repWave = [
            [5, 5, 5],
            [3, 3, 3],
            [5, 3, 1],
          ][(week - 1) % 3];
          const first = [65, 70, 75][(week - 1) % 3];
          expect(e.sets.map((s) => s.reps)).to.eql(week === 7 ? [5, 5, 5] : [...repWave, 5, 5, 5, 5, 5]);
          expect(e.sets.map((s) => s.weight!.value)).to.eql(
            week === 7 ? [40, 50, 60] : [first, first + 10, first + 20, first, first, first, first, first]
          );
          expect(e.sets.map((s) => !!s.isAmrap)).to.eql(
            week === 7 ? [false, false, false] : [false, false, true, false, false, false, false, false]
          );
          expect(e.sets.map((s) => s.timer)).to.eql(
            week === 7 ? [90, 90, 90] : [180, 180, 180, 120, 120, 120, 120, 120]
          );
        } else {
          expect(e.sets.map((s) => s.reps)).to.eql(week === 7 ? [10, 10] : [10, 10, 10, 10, 10]);
        }
      }
    }
  });

  it("supersets dumbbell bench with pulldown and pushdown with split squat at 30s, the rest straight", () => {
    const { program, settings } = setup();
    const expected: Record<string, [string | undefined, number]> = {
      benchPress_dumbbell: ["A", 30],
      latPulldown_cable: ["A", 30],
      cableCrunch_cable: [undefined, 75],
      seatedRow_cable: [undefined, 75],
      tricepsPushdown_cable: ["B", 30],
      splitSquat_dumbbell: ["B", 30],
    };
    for (const day of [1, 2, 3, 20]) {
      const record = Program_nextHistoryRecord(program, settings, stats, day);
      for (const e of record.entries.slice(2)) {
        const [superset, timer] = expected[Exercise_toKey(e.exercise)];
        expect(e.superset, `${Exercise_toKey(e.exercise)} superset on day ${day}`).to.equal(superset);
        const expectedTimer = day === 20 && timer === 75 ? 60 : timer;
        expect(
          e.sets.map((s) => s.timer),
          `${Exercise_toKey(e.exercise)} timers on day ${day}`
        ).to.eql(Array(e.sets.length).fill(expectedTimer));
      }
    }
  });

  it("shows the lift notes on every day, and the cycle and lighter week notes on weeks 3, 6 and 7", () => {
    const settings = { ...Settings_build(), units: "kg" as const };
    const text = programText();
    const { evaluatedWeeks } = PlannerEvaluator_evaluateFull(text, settings);
    expect(evaluatedWeeks.success).to.equal(true);
    if (!evaluatedWeeks.success) {
      return;
    }
    for (const week of evaluatedWeeks.data) {
      for (const day of week.days) {
        for (const e of day.exercises.filter((x: IPlannerProgramExercise) => !x.notused)) {
          const descriptions = (e.descriptions?.values ?? []).map((d: { value: string }) => d.value);
          expect(descriptions.length, `${week.name} / ${day.name} / ${e.fullName} has a note`).to.be.greaterThan(0);
          if (mainSteps[Exercise_toKey(e.exerciseType!)] != null) {
            expect(descriptions[0]).to.contain("cleanReps");
          }
        }
      }
    }
    const weeks = PlannerProgram_evaluateText(text);
    const dayNotes = weeks.map((w) => w.days.map((d) => (d.description ? d.description.slice(0, 12) : d.description)));
    expect(dayNotes).to.eql([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      ["Cycle test w", "Cycle test w", "Cycle test w"],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      ["Cycle test w", "Cycle test w", "Cycle test w"],
      ["Lighter week", "Lighter week", "Lighter week"],
    ]);
    const { program, settings: evalSettings } = setup();
    const evaluatedProgram = Program_evaluate(program, evalSettings);
    const shown = [];
    for (let day = 1; day <= 21; day++) {
      shown.push(Program_getProgramDay(evaluatedProgram, day)?.description ?? undefined);
    }
    expect(shown.map((d) => (d ? d.slice(0, 12) : d))).to.eql([
      ...Array(6).fill(undefined),
      ...Array(3).fill("Cycle test w"),
      ...Array(6).fill(undefined),
      ...Array(3).fill("Cycle test w"),
      ...Array(3).fill("Lighter week"),
    ]);
  });

  it("increments each TM once per successful cycle and retains progression after saving and repeating the block", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    const expectedTms = Object.fromEntries(Object.keys(mainSteps).map((key) => [key, 100]));
    for (let block = 0; block < 2; block++) {
      for (let day = 1; day <= 21; day++) {
        expect(program.nextDay).to.equal(day);
        program = workout(program, settings);
        for (const [key, step] of Object.entries(mainSteps)) {
          const cycleEnd = key === "squat_barbell" || key === "benchPress_barbell" ? [9, 18] : [8, 17];
          if (cycleEnd.includes(day)) {
            expectedTms[key] += step;
          }
          expect(state(program, settings, key).tm, `${key}, block ${block + 1}, day ${day}`).to.eql(
            Weight_build(expectedTms[key], "kg")
          );
          expect(settings.exerciseData[key]!.rm1).to.eql(Weight_build(200, "kg"));
        }
        // Saved planner state and nextDay, rather than reimporting the source, power the next workout.
        program = JSON.parse(JSON.stringify(program));
      }
      expect(program.nextDay).to.equal(1);
    }
    expect(state(program, settings, "squat_barbell").tm).to.eql(Weight_build(120, "kg"));
    expect(state(program, settings, "benchPress_barbell").tm).to.eql(Weight_build(110, "kg"));
  });

  it("initializes an unset TM from 85% of saved 1RM once, then ignores subsequent 1RM changes", () => {
    const { program: initialProgram, settings } = setup({ fallbackTm: true });
    let program = initialProgram;
    const first = Program_nextHistoryRecord(program, settings, stats, 1);
    expect(entry(first, "squat_barbell").sets[0].weight!.value).to.equal(110.5);
    complete(first);
    program = finish(program, settings, first);
    expect(state(program, settings, "squat_barbell").tm).to.eql(Weight_build(170, "kg"));
    settings.exerciseData.squat_barbell!.rm1 = Weight_build(300, "kg");
    const next = Program_nextHistoryRecord(program, settings, stats, 3);
    expect(entry(next, "squat_barbell").sets[0].weight!.value).to.equal(110.5);
  });

  it("asks for the first assistance load, copies it to all five sets, and increases it after completion", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    const record = Program_nextHistoryRecord(program, settings, stats, 1);
    const index = record.entries.findIndex((e) => Exercise_toKey(e.exercise) === "benchPress_dumbbell");
    let assistance = record.entries[index];
    expect(assistance.sets.map((s) => !!s.askWeight)).to.eql([true, false, false, false, false]);
    assistance.sets[0].completedWeight = Weight_build(20, "kg");
    assistance.sets[0].completedReps = 10;
    assistance.sets[0].isCompleted = true;
    const evaluated = Program_evaluate(program, settings);
    const exercise = Program_getProgramExerciseForKeyAndDay(evaluated, 1, assistance.programExerciseId!)!;
    assistance = Progress_runUpdateScriptForEntry(
      assistance,
      Progress_getDayData(record),
      exercise,
      evaluated.states,
      0,
      settings,
      stats
    );
    expect(assistance.sets[0].completedWeight).to.eql(Weight_build(20, "kg"));
    expect(assistance.sets.slice(1).map((s) => s.weight!.value)).to.eql([20, 20, 20, 20]);
    record.entries[index] = assistance;
    complete(record);
    program = finish(program, settings, record);
    const next = entry(Program_nextHistoryRecord(program, settings, stats, 3), "benchPress_dumbbell");
    expect(next.sets.map((s) => s.weight!.value)).to.eql([21, 21, 21, 21, 21]);
    expect(next.sets.map((s) => s.reps)).to.eql([10, 10, 10, 10, 10]);
    expect(next.sets.some((s) => s.askWeight)).to.equal(false);
  });

  it("adds the fixed exercise-specific step after every successful 5x10 without increasing the step or rep target", () => {
    const { program: initialProgram, settings } = setup({ assistanceLoad: 20 });
    let program = initialProgram;
    for (let occurrence = 0; occurrence < 6; occurrence++) {
      for (const day of [1, 2]) {
        const record = Program_nextHistoryRecord(program, settings, stats, day);
        for (const e of record.entries.slice(2)) {
          const step = assistanceSteps[Exercise_toKey(e.exercise)];
          expect(e.sets.map((s) => s.reps)).to.eql(Array(5).fill(10));
          expect(e.sets.map((s) => s.weight!.value)).to.eql(Array(5).fill(20 + occurrence * step));
        }
        complete(record);
        program = finish(program, settings, record);
      }
    }
    for (const [key, step] of Object.entries(assistanceSteps)) {
      expect(state(program, settings, key).load).to.eql(Weight_build(20 + 6 * step, "kg"));
    }
  });

  it("jumps by the smallest loadable amount when the fixed step cannot be loaded", () => {
    const { program: initialProgram, settings } = setup({ assistanceLoad: 20 });
    let program = initialProgram;
    settings.exerciseData.benchPress_dumbbell!.rounding = 5;
    program = workout(program, settings, 1);
    expect(state(program, settings, "benchPress_dumbbell").load).to.eql(Weight_build(25, "kg"));
    const next = entry(Program_nextHistoryRecord(program, settings, stats, 3), "benchPress_dumbbell");
    expect(next.sets.map((s) => s.reps)).to.eql([10, 10, 10, 10, 10]);
    expect(next.sets.map((s) => s.weight!.value)).to.eql([25, 25, 25, 25, 25]);
    settings.exerciseData.benchPress_dumbbell!.rounding = 1;
    program = workout(program, settings, 3);
    expect(state(program, settings, "benchPress_dumbbell").load).to.eql(Weight_build(26, "kg"));
  });

  it("moves a cable load to the next 2.5 kg plate when the 2 kg step is not loadable on the stock stack", () => {
    const { program, settings } = setup({ assistanceLoad: 20 });
    delete settings.exerciseData.latPulldown_cable;
    const next = workout(program, settings, 1);
    expect(state(next, settings, "latPulldown_cable").load).to.eql(Weight_build(22.5, "kg"));
  });

  for (const failure of ["incomplete fifth set", "lighter fifth set", "short reps", "removed fifth set"] as const) {
    it(`holds assistance progression after ${failure}`, () => {
      const { program, settings } = setup({ assistanceLoad: 20 });
      const next = workout(program, settings, 1, (record) => {
        const e = entry(record, "benchPress_dumbbell");
        if (failure === "incomplete fifth set") {
          e.sets[4].isCompleted = false;
          e.sets[4].completedReps = undefined;
          e.sets[4].completedWeight = undefined;
        } else if (failure === "lighter fifth set") {
          e.sets[4].completedWeight = Weight_build(19, "kg");
        } else if (failure === "short reps") {
          e.sets[4].completedReps = 9;
        } else {
          e.sets.pop();
        }
      });
      expect(state(next, settings, "benchPress_dumbbell").load).to.eql(Weight_build(20, "kg"));
    });
  }

  for (const extra of ["an extra set", "a heavier fifth set"] as const) {
    it(`still progresses assistance with ${extra}`, () => {
      const { program, settings } = setup({ assistanceLoad: 20 });
      const next = workout(program, settings, 1, (record) => {
        const e = entry(record, "benchPress_dumbbell");
        if (extra === "an extra set") {
          e.sets.push({ ...e.sets[4], id: "extra", index: 5 });
        } else {
          e.sets[4].completedWeight = Weight_build(21, "kg");
        }
      });
      expect(state(next, settings, "benchPress_dumbbell").load).to.eql(Weight_build(21, "kg"));
    });
  }

  it("saves the typed first-use load as the rounded weight the dumbbells can make, then steps from there", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    delete settings.exerciseData.benchPress_dumbbell;
    const record = Program_nextHistoryRecord(program, settings, stats, 1);
    const index = record.entries.findIndex((e) => Exercise_toKey(e.exercise) === "benchPress_dumbbell");
    let assistance = record.entries[index];
    assistance.sets[0].completedWeight = Weight_build(18, "kg");
    assistance.sets[0].completedReps = 10;
    assistance.sets[0].isCompleted = true;
    const evaluated = Program_evaluate(program, settings);
    const exercise = Program_getProgramExerciseForKeyAndDay(evaluated, 1, assistance.programExerciseId!)!;
    assistance = Progress_runUpdateScriptForEntry(
      assistance,
      Progress_getDayData(record),
      exercise,
      evaluated.states,
      0,
      settings,
      stats
    );
    expect(assistance.sets.slice(1).map((s) => s.weight!.value)).to.eql([17.5, 17.5, 17.5, 17.5]);
    record.entries[index] = assistance;
    complete(record);
    // complete() logs each set at its displayed weight; set 1 was typed as 18 kg, which the dumbbells cannot make.
    record.entries[index].sets[0].completedWeight = Weight_build(18, "kg");
    program = finish(program, settings, record);
    expect(state(program, settings, "benchPress_dumbbell").load).to.eql(Weight_build(18.5, "kg"));
  });

  it("still increments a TM when an extra set is logged on a main lift", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    for (let day = 1; day <= 9; day++) {
      program = workout(program, settings, day, (record) => {
        if (day === 1) {
          const e = entry(record, "squat_barbell");
          e.sets.push({ ...e.sets[7], id: "extra", index: 8 });
        }
      });
    }
    expect(state(program, settings, "squat_barbell").tm).to.eql(Weight_build(105, "kg"));
  });

  for (const topSetReps of [2, 3]) {
    it(`${topSetReps === 3 ? "increments" : "holds"} the TM with ${topSetReps} reps on the cycle-ending 1+ set`, () => {
      const { program: initialProgram, settings } = setup();
      let program = initialProgram;
      for (let day = 1; day <= 9; day++) {
        program = workout(program, settings, day, (record) => {
          if (day === 9) {
            entry(record, "squat_barbell").sets[2].completedReps = topSetReps;
          }
        });
      }
      expect(state(program, settings, "squat_barbell").tm).to.eql(Weight_build(topSetReps === 3 ? 105 : 100, "kg"));
      expect(state(program, settings, "squat_barbell").badCycles).to.equal(topSetReps === 3 ? 0 : 1);
    });
  }

  it("progresses split squats normally when left/right logging is switched off", () => {
    const { program, settings } = setup({ assistanceLoad: 20 });
    settings.exerciseData.splitSquat_dumbbell!.isUnilateral = false;
    const next = workout(program, settings, 2, (record) => {
      expect(entry(record, "splitSquat_dumbbell").sets[0].isUnilateral).to.equal(false);
    });
    expect(state(next, settings, "splitSquat_dumbbell").load).to.eql(Weight_build(21, "kg"));
  });

  for (const side of ["missing left", "short left", "short right", "both complete"] as const) {
    it(`requires both split-squat sides without any unilateral setting: ${side}`, () => {
      const { program, settings } = setup({ assistanceLoad: 20 });
      const next = workout(program, settings, 2, (record) => {
        const set = entry(record, "splitSquat_dumbbell").sets[4];
        expect(set.isUnilateral).to.equal(true);
        if (side === "missing left") {
          set.completedRepsLeft = undefined;
        } else if (side === "short left") {
          set.completedRepsLeft = 9;
        } else if (side === "short right") {
          set.completedReps = 9;
        }
      });
      expect(state(next, settings, "splitSquat_dumbbell").load).to.eql(
        Weight_build(side === "both complete" ? 21 : 20, "kg")
      );
    });
  }

  it("holds after one unsuccessful cycle and resets each TM by 10% after two consecutive unsuccessful cycles", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    for (let day = 1; day <= 18; day++) {
      program = workout(program, settings, day, (record) => {
        if ([8, 9, 17, 18].includes(day)) {
          for (const e of record.entries.slice(0, 2)) {
            e.sets[2].completedReps = 1;
          }
        }
      });
      if (day === 9 || day === 18) {
        for (const key of Object.keys(mainSteps)) {
          expect(state(program, settings, key).tm).to.eql(Weight_build(day === 9 ? 100 : 90, "kg"));
          expect(state(program, settings, key).badCycles).to.equal(day === 9 ? 1 : 0);
        }
      }
    }
  });

  for (const [key, partner, failDay, endDay] of [
    ["squat_barbell", "benchPress_barbell", 1, 9],
    ["deadlift_barbell", "overheadPress_barbell", 2, 8],
  ] as const) {
    for (const failure of [
      "missed session",
      "incomplete set",
      "removed set",
      "short reps",
      "underweight",
      "unclean reps",
    ] as const) {
      it(`holds the ${key} TM when an earlier cycle session has ${failure}, then clears the strike on success`, () => {
        const { program: initialProgram, settings } = setup();
        let program = initialProgram;
        for (let day = 1; day <= 18; day++) {
          program = workout(program, settings, day, (record) => {
            if (day !== failDay) {
              return;
            }
            const e = entry(record, key);
            if (failure === "missed session") {
              skip(e);
            } else if (failure === "incomplete set") {
              e.sets[7].isCompleted = false;
            } else if (failure === "removed set") {
              e.sets.pop();
            } else if (failure === "short reps") {
              e.sets[7].completedReps = 4;
            } else if (failure === "underweight") {
              e.sets[7].completedWeight = Weight_build(e.sets[7].weight!.value - 1, "kg");
            } else {
              record.userPromptedStateVars = { [e.programExerciseId!]: { cleanReps: 0 } };
            }
          });
          if (day === endDay) {
            expect(state(program, settings, key).tm).to.eql(Weight_build(100, "kg"));
            expect(state(program, settings, key).badCycles).to.equal(1);
            expect(state(program, settings, key).cleanReps).to.equal(1);
            expect(state(program, settings, partner).tm).to.eql(Weight_build(102.5, "kg"));
          }
        }
        expect(state(program, settings, key).tm).to.eql(Weight_build(105, "kg"));
        expect(state(program, settings, key).badCycles).to.equal(0);
      });
    }
  }

  it("holds the TM when the cleanReps prompt is 0 on the cycle-ending session itself", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    for (let day = 1; day <= 9; day++) {
      program = workout(program, settings, day, (record) => {
        if (day === 8) {
          record.userPromptedStateVars = { [entry(record, "deadlift_barbell").programExerciseId!]: { cleanReps: 0 } };
        } else if (day === 9) {
          record.userPromptedStateVars = { [entry(record, "squat_barbell").programExerciseId!]: { cleanReps: 0 } };
        }
      });
    }
    for (const key of ["squat_barbell", "deadlift_barbell"]) {
      expect(state(program, settings, key).tm).to.eql(Weight_build(100, "kg"));
      expect(state(program, settings, key).badCycles).to.equal(1);
      expect(state(program, settings, key).cleanReps).to.equal(1);
    }
    expect(state(program, settings, "benchPress_barbell").tm).to.eql(Weight_build(102.5, "kg"));
    expect(state(program, settings, "overheadPress_barbell").tm).to.eql(Weight_build(102.5, "kg"));
  });

  for (const topSetReps of [2, 3]) {
    it(`${topSetReps === 3 ? "increments" : "holds"} the deadlift TM with ${topSetReps} reps on its cycle-ending 1+ set`, () => {
      const { program: initialProgram, settings } = setup();
      let program = initialProgram;
      for (let day = 1; day <= 8; day++) {
        program = workout(program, settings, day, (record) => {
          if (day === 8) {
            entry(record, "deadlift_barbell").sets[2].completedReps = topSetReps;
          }
        });
      }
      expect(state(program, settings, "deadlift_barbell").tm).to.eql(Weight_build(topSetReps === 3 ? 105 : 100, "kg"));
      expect(state(program, settings, "deadlift_barbell").badCycles).to.equal(topSetReps === 3 ? 0 : 1);
    });
  }

  it("starts a fresh cycle count when a lift sat unlogged through a whole cycle and the block repeats", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    for (let day = 1; day <= 21; day++) {
      program = workout(program, settings, day, (record) => {
        const squat = record.entries.find((e) => Exercise_toKey(e.exercise) === "squat_barbell");
        if (day >= 9 && squat) {
          skip(squat);
        }
      });
    }
    expect(state(program, settings, "squat_barbell").sessions).to.equal(5);
    for (let day = 1; day <= 9; day++) {
      program = workout(program, settings, day);
    }
    expect(state(program, settings, "squat_barbell").tm).to.eql(Weight_build(105, "kg"));
    expect(state(program, settings, "squat_barbell").badCycles).to.equal(0);
  });

  for (const key of ["squat_barbell", "deadlift_barbell"]) {
    it(`counts a wholly unlogged final ${key} exposure even if the next cycle's first exposure is also skipped`, () => {
      const { program: initialProgram, settings } = setup();
      let program = initialProgram;
      const skippedEnd = key === "squat_barbell" ? 9 : 8;
      const skippedStart = key === "squat_barbell" ? 10 : 11;
      const nextExposure = key === "squat_barbell" ? 12 : 14;
      for (let day = 1; day <= 18; day++) {
        program = workout(program, settings, day, (record) => {
          if (day === skippedEnd || day === skippedStart) {
            skip(entry(record, key));
          }
        });
        if (day === nextExposure) {
          expect(state(program, settings, key).tm).to.eql(Weight_build(100, "kg"));
          expect(state(program, settings, key).badCycles).to.equal(1);
          expect(state(program, settings, key).sessions).to.equal(1);
        }
      }
      expect(state(program, settings, key).tm).to.eql(Weight_build(90, "kg"));
      expect(state(program, settings, key).badCycles).to.equal(0);
    });
  }

  it("previews and saves a pending reset on block repeat after an unsuccessful cycle and an unlogged cycle endpoint", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    for (let day = 1; day <= 18; day++) {
      program = workout(program, settings, day, (record) => {
        if ([8, 9].includes(day)) {
          record.entries.slice(0, 2).forEach((e) => {
            e.sets[2].completedReps = 1;
          });
        } else if ([17, 18].includes(day)) {
          record.entries.slice(0, 2).forEach(skip);
        }
      });
    }
    const pending = Object.fromEntries(Object.keys(mainSteps).map((key) => [key, state(program, settings, key)]));
    for (const day of [19, 20, 21]) {
      program = workout(program, settings, day, (record) => {
        for (const e of record.entries.slice(0, 2)) {
          expect(
            e.sets.map((s) => s.weight!.value),
            "lighter week ignores the pending reset"
          ).to.eql([40, 50, 60]);
        }
      });
    }
    for (const key of Object.keys(mainSteps)) {
      expect(state(program, settings, key)).to.eql(pending[key]);
      expect(state(program, settings, key).tm).to.eql(Weight_build(100, "kg"));
      expect(state(program, settings, key).badCycles).to.equal(1);
    }
    program = JSON.parse(JSON.stringify(program));
    expect(program.nextDay).to.equal(1);
    for (const day of [1, 2]) {
      const record = Program_nextHistoryRecord(program, settings, stats);
      expect(record.day).to.equal(day);
      for (const e of record.entries.slice(0, 2)) {
        expect(e.sets.map((s) => s.weight!.value)).to.eql([58.5, 67.5, 76.5, 58.5, 58.5, 58.5, 58.5, 58.5]);
      }
      complete(record);
      program = finish(program, settings, record);
      for (const e of record.entries.slice(0, 2)) {
        const updated = state(program, settings, Exercise_toKey(e.exercise));
        expect(updated.tm).to.eql(Weight_build(90, "kg"));
        expect(updated.badCycles).to.equal(0);
        expect(updated.sessions).to.equal(1);
      }
    }
  });

  it("preserves main and assistance state through the lighter week", () => {
    const { program: initialProgram, settings } = setup({ assistanceLoad: 20 });
    let program = initialProgram;
    const keys = [...Object.keys(mainSteps), ...Object.keys(assistanceSteps)];
    const before = Object.fromEntries(keys.map((key) => [key, state(program, settings, key)]));
    for (const day of [19, 20, 21]) {
      const record = Program_nextHistoryRecord(program, settings, stats, day);
      for (const e of record.entries.slice(2)) {
        expect(e.sets.map((s) => s.weight!.value)).to.eql([16, 16]);
        expect(e.sets.map((s) => s.reps)).to.eql([10, 10]);
      }
      complete(record);
      program = finish(program, settings, record);
    }
    for (const key of keys) {
      expect(state(program, settings, key), key).to.eql(before[key]);
    }
  });

  it("previews a pending reset inside a block once a strike is on record and a cycle endpoint goes unlogged", () => {
    const { program: initialProgram, settings } = setup({ badCycles: 1 });
    let program = initialProgram;
    for (let day = 1; day <= 9; day++) {
      program = workout(program, settings, day, (record) => {
        if (day === 8 || day === 9) {
          record.entries.slice(0, 2).forEach(skip);
        }
      });
    }
    for (const [key, day] of [
      ["squat_barbell", 10],
      ["benchPress_barbell", 10],
      ["deadlift_barbell", 11],
      ["overheadPress_barbell", 11],
    ] as const) {
      const e = entry(Program_nextHistoryRecord(program, settings, stats, day), key);
      expect(
        e.sets.map((s) => s.weight!.value),
        key
      ).to.eql([58.5, 67.5, 76.5, 58.5, 58.5, 58.5, 58.5, 58.5]);
    }
    program = workout(program, settings, 10);
    expect(state(program, settings, "squat_barbell").tm).to.eql(Weight_build(90, "kg"));
    expect(state(program, settings, "squat_barbell").badCycles).to.equal(0);
    expect(state(program, settings, "squat_barbell").sessions).to.equal(1);
  });

  it("holds the assistance load and keeps prescribing it when only set 1 is logged lighter", () => {
    const { program, settings } = setup({ assistanceLoad: 20 });
    const next = workout(program, settings, 1, (record) => {
      entry(record, "benchPress_dumbbell").sets[0].completedWeight = Weight_build(18, "kg");
    });
    expect(state(next, settings, "benchPress_dumbbell").load).to.eql(Weight_build(20, "kg"));
    const shown = entry(Program_nextHistoryRecord(next, settings, stats, 3), "benchPress_dumbbell");
    expect(shown.sets.map((s) => s.weight!.value)).to.eql([20, 20, 20, 20, 20]);
  });

  for (const [scenario, weight, reps, expected] of [
    ["every set lighter with all reps", 18, 10, 19],
    ["every set lighter and short", 18, 9, 18],
    ["every set heavier with all reps", 22, 10, 23],
    ["every set heavier and short", 22, 9, 22],
  ] as const) {
    it(`re-bases the assistance load on purpose when ${scenario}`, () => {
      const { program, settings } = setup({ assistanceLoad: 20 });
      const next = workout(program, settings, 1, (record) => {
        for (const set of entry(record, "benchPress_dumbbell").sets) {
          set.completedWeight = Weight_build(weight, "kg");
          set.completedReps = reps;
        }
      });
      expect(state(next, settings, "benchPress_dumbbell").load).to.eql(Weight_build(expected, "kg"));
      const shown = entry(Program_nextHistoryRecord(next, settings, stats, 3), "benchPress_dumbbell");
      expect(shown.sets.map((s) => s.weight!.value)).to.eql(Array(5).fill(expected));
    });
  }

  it("ships a starting load for every assistance exercise", () => {
    const { program } = PlannerTestUtils_get(programText());
    const settings = { ...Settings_build(), units: "kg" as const };
    const loads = Object.fromEntries(
      Object.keys(assistanceSteps).map((key) => [key, (state(program, settings, key).load as IWeight).value])
    );
    expect(loads).to.eql({
      benchPress_dumbbell: 16,
      latPulldown_cable: 45,
      cableCrunch_cable: 25,
      seatedRow_cable: 45,
      tricepsPushdown_cable: 20,
      splitSquat_dumbbell: 10,
    });
    for (const day of [1, 2]) {
      const record = Program_nextHistoryRecord(program, settings, stats, day);
      for (const e of record.entries.slice(2)) {
        const key = Exercise_toKey(e.exercise);
        expect(
          e.sets.map((s) => s.weight!.value),
          key
        ).to.eql(Array(5).fill(loads[key]));
        expect(
          e.sets.some((s) => s.askWeight),
          key
        ).to.equal(false);
      }
    }
  });

  it("progresses by exactly one step when set 1 is logged heavier than prescribed", () => {
    const { program, settings } = setup({ assistanceLoad: 20 });
    const next = workout(program, settings, 1, (record) => {
      entry(record, "benchPress_dumbbell").sets[0].completedWeight = Weight_build(22, "kg");
    });
    expect(state(next, settings, "benchPress_dumbbell").load).to.eql(Weight_build(21, "kg"));
  });

  it("stops copying set 1's logged weight to the other sets once a load is saved", () => {
    const { program, settings } = setup({ assistanceLoad: 20 });
    const record = Program_nextHistoryRecord(program, settings, stats, 1);
    const index = record.entries.findIndex((e) => Exercise_toKey(e.exercise) === "benchPress_dumbbell");
    const assistance = record.entries[index];
    assistance.sets[0].completedWeight = Weight_build(18, "kg");
    assistance.sets[0].completedReps = 10;
    assistance.sets[0].isCompleted = true;
    const evaluated = Program_evaluate(program, settings);
    const exercise = Program_getProgramExerciseForKeyAndDay(evaluated, 1, assistance.programExerciseId!)!;
    const updated = Progress_runUpdateScriptForEntry(
      assistance,
      Progress_getDayData(record),
      exercise,
      evaluated.states,
      1,
      settings,
      stats
    );
    expect(updated.sets.slice(1).map((s) => s.weight!.value)).to.eql([20, 20, 20, 20]);
  });

  it("requires both split-squat sides even when set 1's left reps are logged as 0", () => {
    const { program, settings } = setup({ assistanceLoad: 20 });
    const next = workout(program, settings, 2, (record) => {
      entry(record, "splitSquat_dumbbell").sets[0].completedRepsLeft = 0;
    });
    expect(state(next, settings, "splitSquat_dumbbell").load).to.eql(Weight_build(20, "kg"));
  });

  it("takes 85% of the app's default starting weight when tm is 0kg and no 1RM is saved", () => {
    const { program: initialProgram, settings } = setup({ fallbackTm: true });
    let program = initialProgram;
    for (const key of Object.keys(mainSteps)) {
      settings.exerciseData[key] = { rounding: 0.1 };
    }
    const first = entry(Program_nextHistoryRecord(program, settings, stats, 1), "squat_barbell");
    expect(first.sets[0].weight!.value).to.be.closeTo(60 * 0.85 * 0.65, 0.1);
    program = workout(program, settings, 1);
    program = workout(program, settings, 2);
    const expected: Record<string, number> = {
      squat_barbell: 51,
      benchPress_barbell: 51,
      deadlift_barbell: 70.125,
      overheadPress_barbell: 27.625,
    };
    for (const [key, tm] of Object.entries(expected)) {
      const saved = state(program, settings, key).tm as IWeight;
      expect(saved.value, key).to.be.closeTo(tm, 0.01);
    }
    settings.exerciseData.squat_barbell = { rm1: Weight_build(200, "kg"), rounding: 0.1 };
    const later = entry(Program_nextHistoryRecord(program, settings, stats, 3), "squat_barbell");
    expect(later.sets[0].weight!.value).to.be.closeTo(51 * 0.65, 0.1);
  });

  it("ships the 80% training maxes and prescribes stock-plate weights from them", () => {
    const { program } = PlannerTestUtils_get(programText());
    const settings = { ...Settings_build(), units: "kg" as const };
    expect(
      Object.fromEntries(
        Object.keys(mainSteps).map((key) => [key, (state(program, settings, key).tm as IWeight).value])
      )
    ).to.eql({
      squat_barbell: 81.5,
      benchPress_barbell: 57,
      deadlift_barbell: 90.5,
      overheadPress_barbell: 41,
    });
    const expected: Record<number, Record<string, number[]>> = {
      1: { squat_barbell: [52.5, 61, 68.5], benchPress_barbell: [36, 42.5, 47.5] },
      2: { deadlift_barbell: [58.5, 67.5, 76], overheadPress_barbell: [26, 30, 33.5] },
      7: { squat_barbell: [61, 68.5, 76], benchPress_barbell: [42.5, 47.5, 53.5] },
      8: { deadlift_barbell: [67.5, 76, 85], overheadPress_barbell: [30, 33.5, 38.5] },
      19: { squat_barbell: [32.5, 40, 48.5], benchPress_barbell: [22.5, 28.5, 33.5] },
      20: { deadlift_barbell: [36, 45, 53.5], overheadPress_barbell: [20, 20, 23.5] },
    };
    for (const [day, lifts] of Object.entries(expected)) {
      const record = Program_nextHistoryRecord(program, settings, stats, Number(day));
      for (const [key, sets] of Object.entries(lifts)) {
        const weights = entry(record, key).sets.map((s) => s.weight!.value);
        const fsl = Number(day) < 19 ? Array(5).fill(sets[0]) : [];
        expect(weights, `${key} day ${day}`).to.eql([...sets, ...fsl]);
      }
    }
  });

  it("steps to the next fixed dumbbell when the dumbbells are a fixed set", () => {
    const { program: initialProgram, settings } = setup({ assistanceLoad: 20 });
    let program = initialProgram;
    delete settings.exerciseData.benchPress_dumbbell;
    const gym = Equipment_getCurrentGym(settings);
    gym.equipment.dumbbell = {
      ...gym.equipment.dumbbell!,
      isFixed: true,
      fixed: [10, 12.5, 15, 17.5, 20, 22.5, 25].map((value) => Weight_build(value, "kg")),
    };
    program = workout(program, settings, 1);
    expect(state(program, settings, "benchPress_dumbbell").load).to.eql(Weight_build(22.5, "kg"));
    const next = entry(Program_nextHistoryRecord(program, settings, stats, 3), "benchPress_dumbbell");
    expect(next.sets.map((s) => s.weight!.value)).to.eql([22.5, 22.5, 22.5, 22.5, 22.5]);
    program = workout(program, settings, 3);
    expect(state(program, settings, "benchPress_dumbbell").load).to.eql(Weight_build(25, "kg"));
  });

  it("saves a first-use load typed in the lighter week as the full load", () => {
    const { program: initialProgram, settings } = setup();
    let program = initialProgram;
    const record = Program_nextHistoryRecord(program, settings, stats, 19);
    const e = entry(record, "benchPress_dumbbell");
    expect(e.sets.map((s) => !!s.askWeight)).to.eql([true, false]);
    complete(record);
    for (const set of e.sets) {
      set.completedWeight = Weight_build(16, "kg");
    }
    program = finish(program, settings, record);
    expect(state(program, settings, "benchPress_dumbbell").load).to.eql(Weight_build(20, "kg"));
    const next = entry(Program_nextHistoryRecord(program, settings, stats, 21), "benchPress_dumbbell");
    expect(next.sets.map((s) => s.weight!.value)).to.eql([16, 16]);
    expect(next.sets.some((s) => s.askWeight)).to.equal(false);
  });

  it("works in lb once the documented replacements are applied", () => {
    const text = programText()
      .replace("tm: 81.5kg", "tm: 180lb")
      .replace("tm: 57kg", "tm: 125lb")
      .replace("tm: 90.5kg", "tm: 200lb")
      .replace("tm: 41kg", "tm: 90lb")
      .replace(/tm: 0kg/g, "tm: 0lb")
      .replace(/step: 5kg/g, "step: 10lb")
      .replace(/step: 2\.5kg/g, "step: 5lb")
      .replace(/step: 2kg/g, "step: 5lb")
      .replace(/step: 1kg/g, "step: 2.5lb")
      .replace(/load: [0-9.]+kg/g, "load: 0lb");
    const { program: initialProgram } = PlannerTestUtils_get(text);
    let program = initialProgram;
    const settings = { ...Settings_build(), units: "lb" as const };
    const first = Program_nextHistoryRecord(program, settings, stats, 1);
    for (const e of first.entries) {
      expect(
        e.sets.map((s) => s.weight!.unit),
        Exercise_toKey(e.exercise)
      ).to.eql(Array(e.sets.length).fill("lb"));
    }
    expect(entry(first, "squat_barbell").sets.map((s) => s.weight!.value)).to.eql([
      115, 135, 152.5, 115, 115, 115, 115, 115,
    ]);
    for (let day = 1; day <= 9; day++) {
      program = workout(program, settings, day);
    }
    expect(state(program, settings, "squat_barbell").tm).to.eql(Weight_build(190, "lb"));
    expect(state(program, settings, "benchPress_barbell").tm).to.eql(Weight_build(130, "lb"));
    expect(state(program, settings, "benchPress_dumbbell").load).to.eql(Weight_build(12.5 + 2.5 * 5, "lb"));
  });
});
