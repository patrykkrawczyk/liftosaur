---
id: the531-home-gym
name: 5/3/1 Home Gym
author: Community adaptation of Jim Wendler's 5/3/1
url: "https://www.jimwendler.com/blogs/jimwendler-com/5-3-1-for-beginners"
shortDescription: Three-day 5/3/1 with FSL, 50-rep dumbbell and cable assistance, separate training maxes, and fixed assistance increments.
isMultiweek: true
tags: []
frequency: 3
age: "3_to_12_months"
duration: "90+"
goal: "strength"
---

A three-day home gym adaptation of 5/3/1 for Beginners. Each session pairs two main barbell lifts with 5×5 First Set Last (FSL) and three prescribed assistance exercises. It uses a rack, barbell, flat bench, dumbbells, and cable machine. No incline bench or calisthenics are required.

<!-- more -->

## Who It's For

Lifters who are comfortable with the four main barbell lifts and want to build strength and muscle on three training days, with prescribed targets and automatic progression. This is a personal adaptation of [Jim Wendler's 5/3/1 framework](https://www.jimwendler.com/blogs/jimwendler-com/5-3-1-for-beginners), not an unmodified official Wendler template. The assistance choices, cycle-success rules, and lighter week below belong to this adaptation.

## Schedule and Exercises

Follow Day 1 → Day 2 → Day 3, usually with a rest day between sessions. A missed calendar day postpones the next workout; do not skip program days or double up to catch up. Three completed workouts make one program week. No fourth lifting day is required; easy walking is an optional use of that time.

| Day | Main lifts, in order             | Assistance, in order                                          |
| --- | -------------------------------- | ------------------------------------------------------------- |
| 1   | [{Squat}], [{Bench Press}]       | [{Bench Press, Dumbbell}], [{Lat Pulldown}], [{Cable Crunch}] |
| 2   | [{Deadlift}], [{Overhead Press}] | [{Triceps Pushdown}], [{Seated Row}], [{Split Squat}]         |
| 3   | [{Bench Press}], [{Squat}]       | [{Bench Press, Dumbbell}], [{Lat Pulldown}], [{Cable Crunch}] |

Use a flat bench for dumbbell presses and the high pulley for pulldowns. Row from the flat bench or the floor as the cable setup permits. Split squats keep both feet on the floor and use dumbbells; targets apply to each leg. Dumbbell loads always refer to **one dumbbell**, not the combined pair.

## Main Work and First Set Last

Every percentage uses the exercise's separate **training max (TM)**. After the three ascending work sets, reduce the load to the first work-set weight and perform five sets of five: First Set Last.

| Program weeks    | Ascending work sets              | FSL work      |
| ---------------- | -------------------------------- | ------------- |
| 1 and 4          | 5 at 65%, 5 at 75%, 5+ at 85% TM | 5×5 at 65% TM |
| 2 and 5          | 3 at 70%, 3 at 80%, 3+ at 90% TM | 5×5 at 70% TM |
| 3 and 6          | 5 at 75%, 3 at 85%, 1+ at 95% TM | 5×5 at 75% TM |
| 7 — lighter week | 5 at 40%, 5 at 50%, 5 at 60% TM  | None          |

On **+ sets**, perform additional clean reps, stopping with roughly one or two good reps left. Do not grind through technique breakdown. After each main lift, answer `cleanReps` with **1** for clean reps or **0** for grinding or lost technique. The prompt resets to 1 for the next workout.

### Main-Lift Progression

At the end of each three-week cycle, a lift's TM increases only when all its prescribed work was completed at the prescribed loads or heavier, with clean reps, and its final cycle-ending 1+ set reached **at least five clean reps**. The displayed 1+ is the traditional minimum; five is this program's progression threshold. Squat and bench have six exposures per cycle; deadlift and overhead press have three.

- Successful cycle: add **2.5 kg** to bench/overhead press TM, or **5 kg** to squat/deadlift TM, once per lift.
- One unsuccessful cycle: hold that lift's TM.
- Two consecutive unsuccessful cycles: reduce that lift's TM by **10%**, then start counting again.
- Week 7: freeze progression; no + sets or FSL.

If a lift's final exposure is left entirely unlogged, its unfinished cycle counts as unsuccessful when that lift is next logged in a new regular cycle. Any resulting TM reduction already applies to that new cycle's working weights. The lighter week still freezes progression.

These rules change a separate TM. They do not overwrite the saved actual 1RM or add the full TM increment to every work set.

## Assistance Progression

Perform **5×10 — 50 reps per assistance exercise** in every regular workout. After completing all five sets of ten clean reps at the same load, add the fixed increment below for the next appearance. Reps stay at ten as the load increases. Leave about two good reps in reserve and log only clean reps. Split squats require all five sets on both legs: **50 reps per leg**.

| Exercise             | Fixed load increase after 5×10 |
| -------------------- | -----------------------------: |
| Dumbbell bench press |              1 kg per dumbbell |
| Dumbbell split squat |              1 kg per dumbbell |
| Lat pulldown         |                           2 kg |
| Seated cable row     |                           2 kg |
| Triceps pushdown     |                           1 kg |
| Cable crunch         |                           1 kg |

Incomplete reps or sets hold the load at the same 5×10 target. In Week 7, assistance becomes **2×10 at 80% of its normal load**, without advancing or reducing progression.

Configure the actual equipment loads in Liftosaur. The increment stays fixed as working weight grows; it does not scale as a percentage. If rounding prevents a heavier load after 5×10, the program holds the current weight and 5×10 target. Set that exercise's `step` to a constant the equipment can load. A small barbell plate does not automatically make a cable-stack increment available.

## Starting Loads and Equipment Setup

1. Set a TM for each main lift, generally about **85% of a realistic current 1RM** based on recent clean lower-rep performance. No all-out max test is required, and high-rep estimates should not be treated as precise maxes.
2. In the full-program text, replace `tm: 0kg` on the actual Squat, Bench Press, Deadlift and Overhead Press lines in Week 1. Leave the hidden `main` template's default alone.
3. Alternatively, leave those values at zero only after checking each lift's saved app 1RM. On first use, the program initializes its TM from **85% of that saved value** and stores it separately.
4. Configure barbell plates, dumbbell loads and cable increments. Enable separate left/right rep logging for Split Squat.
5. On first use of an assistance exercise, choose a load that allows all five sets of ten with about two good reps left. This may require less weight than for three sets. Enter it in the first-set weight prompt. The code copies it to all remaining sets and saves it after all five are completed at the same load, applying the fixed increase if every set meets the target. Initial zero/minimum-equipment loads are placeholders for this choice.

When importing from text, paste the entire Liftoscript block into a **new program's full-program text editor**. This is Liftoscript, not a JSON backup. After all 21 sessions, repeat the **same saved program** from Week 1 so updated TMs and assistance targets carry over. Re-importing the starter text resets that state.

## Warm-Ups, Rest and Session Length

Warm up separately before each main lift: empty bar for 5–10 reps, then, where heavier than the empty bar, approximately 70% of the first work-set weight for three reps and 90% for one to three reps. Skip redundant light steps and add gradual steps when needed. For deadlifts, use a light load that maintains the usual starting height. Automatic warm-up sets are disabled because this program sets working loads through a custom update script.

Rest reminders are **three minutes for ascending main sets**, **two minutes for FSL**, and **75 seconds for assistance**, except **90 seconds for split squats**. Take longer when needed for clean reps. Week 7 uses 90 seconds for main lifts and 60 seconds for assistance, with split squats retaining 90 seconds.

Regular sessions contain **31 working sets**: 16 main/FSL sets and 15 assistance sets. The app estimates roughly **94–95 minutes for the working sets alone**, excluding warm-ups and equipment changes. Time the first few complete sessions to establish a realistic duration. There is no enforced 90-minute cutoff. Alternating dumbbell presses and pulldowns may save time if the setup permits. If you need to stop early, leave unfinished assistance incomplete in the log so its progression holds. Do not rush main-lift sets to beat the clock.

<!-- faq -->

### Is this an official 5/3/1 template?

It is a home gym adaptation of 5/3/1 for Beginners. It keeps the main weekly wave and FSL, and adds prescribed cable/dumbbell assistance, fixed assistance increments, conservative cycle-success checks and a lighter seventh week.

### What if I miss a workout?

Do the next program day when available. Calendar days do not advance the program, and there is no need to double up or skip ahead.

### Why did my assistance weight stay the same after 5×10?

All five sets must meet the target at the same load, and split squats require both legs. If the proposed fixed increase rounds back to the current load, the program holds that weight. The target stays 5×10. Check the equipment settings and use a fixed `step` that can be loaded.

### Do I need to enter my real maximum to use the program?

No max test is required. Set a conservative TM using recent clean lower-rep performance, or verify the app's saved 1RM before allowing the 85% initialization. The zero defaults are not personalized starting weights.

```liftoscript
/// 5/3/1 + FSL - home gym adaptation, 3 days, 7 training weeks.
/// Paste this whole file into a NEW Liftosaur program's full-program text editor.
/// SETUP: Replace tm: 0kg on each of the FOUR barbell exercise lines below with
/// your chosen training max (TM), normally about 85% of a realistic current 1RM.
/// If left at 0kg, the first workout uses 85% of that exercise's SAVED app 1RM,
/// then saves that TM. Check those saved 1RMs before starting; do not trust
/// automatic estimates from 10-20-rep sets. Subsequent progression changes TM only.
/// Configure your actual plates, dumbbells and cable-stack increments in Liftosaur.
/// Warm up before each main lift: empty bar for 5-10 reps, then (when heavier
/// than the empty bar) about 70% of the first WORK SET for 3 reps and 90% for
/// 1-3 reps. Skip redundant light steps; add gradual steps if you need them.
/// Warm-ups are separate from the logged work sets; automatic warm-ups are off.
/// Assistance: choose a manageable first-set load the first time each appears.
/// That load is copied to the remaining sets and saved after a complete workout.
/// Dumbbell loads are PER dumbbell. Split-squat targets are PER leg.
/// Follow Day 1 -> Day 2 -> Day 3, with rest days between when practical.
/// A missed calendar day does not mean skipping a program day. No catch-up doubles.
/// Finish both 3-week cycles, then the lighter Week 7; repeat the same saved program.
/// Do not re-import the original file each block: that would reset progression.
/// Main lift cleanReps prompt: 1 = clean reps, 0 = grinding or technique breakdown.
/// On + sets, stop with about 1-2 good reps left. Week 3/6: aim for at least 5
/// clean top-set reps to qualify for a TM increase; the displayed minimum is 1.
/// One unsuccessful cycle holds TM; two consecutive unsuccessful cycles reduce
/// that lift's TM by 10%. A successful cycle adds 2.5kg upper / 5kg lower.
/// A completely unlogged final lift is counted as an unfinished cycle when the
/// next regular cycle is logged; any pending TM reduction applies to its weights.
/// Assistance: 5x10 (50 reps; per leg for split squats). Complete all five sets
/// at the same load to add the FIXED step next time; reps always stay at ten.
/// DB press/split squat: +1kg PER dumbbell. Pulldown/row: +2kg.
/// Pushdown/crunch: +1kg. These increments do not grow with the working weight.
/// Set each step to a loadable amount for that exercise's equipment. If rounding
/// prevents an increase, the program holds the load at 5x10; check the setup.
/// Leave about 2 reps in reserve; log only clean reps.
/// Week 7 freezes progression: main 3x5 at 40/50/60% TM; assistance 2x10 at 80%.
/// This is a personal adaptation, not an unmodified official Wendler template.

# Week 1
## Day 1

main / used: none / 1x5 0kg 180s, 1x5 0kg 180s, 1x5+ 0kg 180s, 5x5 0kg 120s / warmup: none / progress: custom(tm: 0kg, step: 5kg, lastDay: 3, expected: 6, cycle: 0, sessions: 0, cycleOk: 1, badCycles: 0, cleanReps+: 1) {~
  if (state.tm == 0kg) {
    state.tm = rm1 * 0.85
  }
  if (week < 7) {
    var.cycle = week <= 3 ? 1 : 2
    if (state.cycle != var.cycle) {
      // A completely unlogged final exposure never ran its finish script.
      if (state.sessions > 0) {
        state.badCycles += 1
        if (state.badCycles >= 2) {
          state.tm *= 0.9
          state.badCycles = 0
        }
      }
      state.cycle = var.cycle
      state.sessions = 0
      state.cycleOk = 1
    }
    state.sessions += 1
    if (!(numberOfSets == 8 && completedNumberOfSets == 8 && completedReps >= reps && completedWeights >= weights && state.cleanReps == 1)) {
      state.cycleOk = 0
    }
    if ((week == 3 || week == 6) && dayInWeek == state.lastDay) {
      if (state.cycleOk == 1 && state.sessions == state.expected && completedReps[3] >= 5) {
        state.tm += state.step
        state.badCycles = 0
      } else {
        state.badCycles += 1
        if (state.badCycles >= 2) {
          state.tm *= 0.9
          state.badCycles = 0
        }
      }
      state.sessions = 0
      state.cycleOk = 1
    }
  }
  state.cleanReps = 1
~} / update: custom() {~
  if (setIndex == 0) {
    var.tm = state.tm == 0kg ? rm1 * 0.85 : state.tm
    if (week == 7) {
      weights[1] = var.tm * 0.4
      weights[2] = var.tm * 0.5
      weights[3] = var.tm * 0.6
    } else {
      // Preview a pending reset before the new cycle's first logged workout.
      var.cycle = week <= 3 ? 1 : 2
      if (state.cycle != var.cycle && state.sessions > 0 && state.badCycles >= 1) {
        var.tm *= 0.9
      }
      var.first = 0.65 + ((week - 1) % 3) * 0.05
      weights = var.tm * var.first
      weights[2] = var.tm * (var.first + 0.1)
      weights[3] = var.tm * (var.first + 0.2)
    }
  }
~}

assist / used: none / 5x10 0kg 75s / warmup: none / progress: custom(load: 0kg, step: 1kg, bothSides: 0) {~
  if (week < 7 && numberOfSets == 5 && completedNumberOfSets == 5 && completedWeights[1] > 0kg && completedWeights == completedWeights[1]) {
    state.load = completedWeights[1]
    var.good = completedReps >= reps
    if (state.bothSides == 1 && !(completedRepsLeft >= reps)) {
      var.good = 0
    }
    if (var.good) {
      var.nextLoad = roundWeight(state.load + state.step)
      if (var.nextLoad > state.load) {
        state.load = var.nextLoad
      }
    }
  }
~} / update: custom() {~
  if (setIndex == 0) {
    weights = week == 7 ? state.load * 0.8 : state.load
    reps = 10
    minReps = reps
    askweights = 0
    if (state.load == 0kg) {
      askweights[1] = 1
    }
  }
  if (setIndex == 1) {
    weights = completedWeights[1]
  }
~}

// Main lift: 3 ascending work sets, then 5x5 First Set Last (FSL).
// The + set is a controlled rep record attempt; leave 1-2 clean reps in reserve.
// At the cleanReps prompt, enter 0 if you ground out reps or lost technique.
Squat[1-7] / ...main / progress: custom(tm: 0kg, step: 5kg, lastDay: 3, expected: 6) { ...main }
Bench Press[1-7] / ...main / progress: custom(tm: 0kg, step: 2.5kg, lastDay: 3, expected: 6) { ...main }
// Flat bench; enter the weight of ONE dumbbell. Leave about 2 reps in reserve.
Bench Press, Dumbbell[1-7] / ...assist
// Use your cable's high pulley. Record the stack/load setting consistently.
Lat Pulldown[1-7] / ...assist / progress: custom(step: 2kg) { ...assist }
// Kneeling cable crunch. Choose a load you can move without pulling with your arms.
Cable Crunch[1-7] / ...assist

## Day 2
Deadlift[1-7] / ...main / progress: custom(tm: 0kg, step: 5kg, lastDay: 2, expected: 3) { ...main }
Overhead Press[1-7] / ...main / progress: custom(tm: 0kg, step: 2.5kg, lastDay: 2, expected: 3) { ...main }
Triceps Pushdown[1-7] / ...assist
// Low cable row; sit on the flat bench or floor, depending on your pulley setup.
Seated Row[1-7] / ...assist / progress: custom(step: 2kg) { ...assist }
// Both feet stay on the floor. Do the target reps on EACH leg, holding dumbbells.
// Enable separate left/right rep logging and complete BOTH sides for progression.
Split Squat[1-7] / ...assist / 90s / progress: custom(bothSides: 1) { ...assist }

## Day 3
Bench Press[1-7] / ...main
Squat[1-7] / ...main
Bench Press, Dumbbell[1-7] / ...assist
Lat Pulldown[1-7] / ...assist
Cable Crunch[1-7] / ...assist

# Week 2
## Day 1
main / 1x3 0kg 180s, 1x3 0kg 180s, 1x3+ 0kg 180s, 5x5 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 3
## Day 1
// In Weeks 3 and 6, aim for at least 5 clean reps on the 1+ top set.
main / 1x5 0kg 180s, 1x3 0kg 180s, 1x1+ 0kg 180s, 5x5 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 4
## Day 1
main / 1x5 0kg 180s, 1x5 0kg 180s, 1x5+ 0kg 180s, 5x5 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 5
## Day 1
main / 1x3 0kg 180s, 1x3 0kg 180s, 1x3+ 0kg 180s, 5x5 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 6
## Day 1
// In Weeks 3 and 6, aim for at least 5 clean reps on the 1+ top set.
main / 1x5 0kg 180s, 1x3 0kg 180s, 1x1+ 0kg 180s, 5x5 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 7 - Lighter week
## Day 1
// Easy 3x5 only: no AMRAP or FSL. Progression stays unchanged this week.
main / 1x5 0kg 90s, 1x5 0kg 90s, 1x5 0kg 90s
assist / 2x10 0kg 60s
## Day 2
## Day 3
```
