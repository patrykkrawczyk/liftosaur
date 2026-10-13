---
id: the531-home-gym
name: "5/3/1 Home Gym"
author: Jim Wendler (home gym adaptation)
url: "https://www.jimwendler.com/blogs/jimwendler-com/101065094-5-3-1-for-a-beginner"
shortDescription: 3-day 5/3/1 for Beginners with FSL, adapted to a rack, barbell, dumbbells and a cable station, with automatic training max and assistance progression.
isMultiweek: true
tags: []
frequency: 3
age: "3_to_12_months"
duration: "90+"
goal: "strength"
---

A 3-day full-body home gym version of Jim Wendler's 5/3/1 for Beginners. Each session trains two main barbell lifts through the 5/3/1 wave plus 5x5 First Set Last (FSL), then three assistance exercises (push, pull, single-leg or core) for 5x10 with dumbbells and a cable station. Training maxes, cycle-to-cycle increases and assistance loads are tracked by the program.

<!-- more -->

## Origin & Philosophy

[5/3/1 for Beginners](https://www.jimwendler.com/blogs/jimwendler-com/101065094-5-3-1-for-a-beginner) is Jim Wendler's 3-day version of 5/3/1: two main lifts per session, the 5/3/1 wave on each, 5x5 First Set Last as supplemental volume, and 50-100 reps of push, pull and single-leg/core assistance. The principle is the same as every 5/3/1 template: start light, use a Training Max (TM) below your real max, add a little weight every 3 weeks, and never grind reps.

This version keeps the main work exactly as Wendler wrote it and swaps the bodyweight assistance (chin ups, dips, push ups) for what a home gym with a rack, barbell, flat bench, dumbbells and a cable machine can do. It also adds two things the original leaves to the lifter: a rule for when a TM goes up or down, and a fixed-increment progression for assistance. It is a personal adaptation, not an official Wendler template.

## Who It's For

- **Experience level**: 3-12 months. You should be comfortable with [{Squat}], [{Bench Press}], [{Deadlift}] and [{Overhead Press}] form.
- **Primary goal**: Strength, with muscle gain from the FSL sets and the 150 assistance reps per session.
- **Best suited for**: Bulking or maintenance. On a cut, drop assistance to 3 sets per exercise (see Common Modifications for the one-line script change that keeps the loads progressing).
- **Equipment**: A home gym with no pull-up bar or dip station, but with a cable machine and dumbbells.

## Pros & Cons

**Pros**

- [{Squat}] and [{Bench Press}] are trained twice a week, which is where beginners gain technique fastest
- The TM sits at 80-85% of your 1RM, so every set has reps in reserve and the AMRAP sets stay clean
- Everything is automatic once you type your TMs (or set `tm: 0kg` to read 85% of your saved 1RM): increases happen at the end of each 3-week cycle, assistance loads start from the values in the file and then progress on their own
- Assistance increments are fixed and small (1 kg per dumbbell, 1-2 kg on the cable), which home equipment can actually load
- A TM only goes up after a complete, clean cycle, so a stale TM cannot run away from you

**Cons**

- 31 working sets per session: about 86 minutes of working sets with the built-in assistance supersets, plus about 10 minutes of warm-ups
- [{Deadlift}] and [{Overhead Press}] are trained once a week
- A TM increase requires every logged session of the cycle to be complete and clean, which is slower than stock 5/3/1 when you miss a session
- No automatic warm-up sets: you warm up the main lifts yourself (see Rest Times)
- Assistance increments need small plates: 0.5 kg plates for dumbbells and a cable stack that can move in 1-2 kg steps

## Program Structure

- **Split**: Full body
- **Periodization**: Weekly undulating 5/3/1 wave (5s week, 3s week, 5/3/1 week) in two 3-week cycles, then one lighter week
- **Schedule**: Fixed order Day 1, Day 2, Day 3, with a rest day between sessions when possible. A missed calendar day only postpones the next session; never skip a program day or double up.
- **Typical week**: Day 1 (Squat, Bench Press, assistance) / rest / Day 2 (Deadlift, Overhead Press, assistance) / rest / Day 3 (Bench Press, Squat, assistance) / rest / rest

## Exercise Selection & Rationale

**Main lifts** are Wendler's: [{Squat}] and [{Bench Press}] on Day 1 and Day 3 (reversed order, so each lift gets one fresh session), [{Deadlift}] and [{Overhead Press}] on Day 2.

**Assistance** follows Wendler's three categories, one exercise from each per day:

- **Push**: [{Bench Press, Dumbbell}] on Days 1 and 3, [{Triceps Pushdown}] on Day 2. The dumbbell press adds pressing volume with a longer range of motion than the barbell; the pushdown gives the triceps direct work after the press.
- **Pull**: [{Lat Pulldown}] on Days 1 and 3, [{Seated Row}] on Day 2. Vertical and horizontal pulling balance three pressing sessions a week.
- **Single leg / core**: [{Cable Crunch}] on Days 1 and 3, [{Split Squat}] with dumbbells on Day 2. The split squat goes on the deadlift day so the squat days keep their leg volume to the barbell.

Two assistance pairs are supersets to keep the session near 90 minutes, as Wendler suggests for assistance: [{Bench Press, Dumbbell}] alternates with [{Lat Pulldown}], and [{Triceps Pushdown}] alternates with [{Split Squat}]. Each pair uses two different stations, so no cable attachment changes between sets. [{Cable Crunch}] and [{Seated Row}] are done straight.

Any exercise in the same category can be swapped in. Keep the category, keep the 50 reps.

## Set & Rep Scheme

**Main lifts**: All percentages are of the lift's Training Max, not the 1RM.

| Week | Set 1 | Set 2 | Set 3 (AMRAP) | FSL |
| --- | --- | --- | --- | --- |
| 1 and 4 | 5 x 65% | 5 x 75% | 5+ x 85% | 5x5 x 65% |
| 2 and 5 | 3 x 70% | 3 x 80% | 3+ x 90% | 5x5 x 70% |
| 3 and 6 | 5 x 75% | 3 x 85% | 1+ x 95% | 5x5 x 75% |
| 7 (lighter) | 5 x 40% | 5 x 50% | 5 x 60% | none |

The third set is AMRAP: do as many clean reps as you can, and stop with 1-2 good reps left. Do not grind. After the last set the app asks for `cleanReps`: answer 1 if every rep was controlled, 0 if you ground reps out or technique broke down. A 0 blocks that cycle's TM increase.

**FSL (First Set Last)**: after the three working sets, drop back to the first set's weight and do 5 sets of 5. It is technique practice under a light load, not a max effort.

**Assistance**: 5x10 per exercise (50 reps, Wendler's minimum per category) at a load that leaves about 2 reps in reserve. Split squats are 10 reps per leg. Log only clean reps.

## Progressive Overload

**Main lifts** keep a separate Training Max per lift. At the end of week 3 and week 6 the program checks that lift's cycle:

- **Successful cycle**: every logged session was complete (all prescribed sets, prescribed reps, prescribed weight or heavier, `cleanReps` = 1; extra completed sets do no harm, an added set left unfinished counts as an incomplete session), every session of the cycle was logged (6 for Squat and Bench Press, 3 for Deadlift and Overhead Press), and the final 1+ set reached **at least 3 clean reps**. The TM goes up: **+2.5 kg** for Bench Press and Overhead Press, **+5 kg** for Squat and Deadlift.
- **Unsuccessful cycle**: the TM holds.
- **Two unsuccessful cycles in a row**: the TM drops by 10%, then the count restarts.

Stock 5/3/1 adds the increment regardless of AMRAP reps, and resets by 3 increments (about 7.5 kg upper / 15 kg lower) after a full cycle of misses. Wendler's own beginner article says not to increase the TM when reps fail the standards, which is what the `cleanReps` and complete-session checks enforce. The 3-rep check on the 1+ set is a TM test: 3 clean reps at 95% of the TM means the TM is at most about 96% of your current max (Epley), so there is room to add. If you only get 1-2 reps there, the TM has caught up with you and holding it is the right call. Five reps there would mean the TM is at most about 90% of your max, the classic 5/3/1 starting point and above the 80-85% this program starts from, so a 5-rep requirement would stop increases long before the TM is actually too heavy.

If you leave a lift completely unlogged on its final session of a cycle, the program treats that cycle as unfinished when the next cycle starts. The lighter week never changes a TM.

**Assistance**: after you complete all 5 sets of 10 at the prescribed load or heavier (both legs for split squats), the load goes up by a fixed step the next time the exercise appears:

| Exercise | Step after 5x10 |
| --- | ---: |
| Bench Press, Dumbbell | 1 kg per dumbbell |
| Split Squat | 1 kg per dumbbell |
| Lat Pulldown | 2 kg |
| Seated Row | 2 kg |
| Triceps Pushdown | 1 kg |
| Cable Crunch | 1 kg |

The file ships with the author's starting loads: dumbbell bench 16 kg per dumbbell, lat pulldown 45 kg, cable crunch 25 kg, seated row 45 kg, triceps pushdown 20 kg, split squat 10 kg per dumbbell. Edit the `load:` value on an exercise line to change one, or set it to `0kg` to be asked for the weight on set 1 of its first session. To move a load up or down during the program without editing text, log all five sets at the new weight: that weight becomes the base, and the step is added on top if you got all the reps. Incomplete sets or reps hold the load. The step is rounded to the equipment you configured in the app. If your plates cannot load the step (for example a cable stack that only moves in 5 kg), the program takes the smallest jump your equipment allows instead. To change a step, add or edit `step:` in that exercise's own `progress: custom(...) { ...assist }` override (Lat Pulldown, Seated Row and Split Squat already have one); the template's `step: 1kg` is the default for the rest.

**Week 7** is a lighter week: main lifts 3x5 at 40/50/60% TM, assistance 2x10 at 80% of its load, no AMRAP, no FSL, no progression changes. Then start again at Week 1 with the same saved program. The updated TMs and assistance loads carry over. Re-importing the program text would reset them.

## How Long to Run It / What Next

Run 7-week blocks for 6-12 months, as long as the TMs keep going up. Move on when a lift fails two cycles in a row twice, or when you want more volume per lift. [5/3/1 Boring But Big](/programs/the531bbb) is the natural next step on 4 days; [GZCLP](/programs/gzclp) is the alternative if you want faster progression on 3 days.

## Equipment Needed

- Rack, barbell and plates, including 1.25 kg and 0.5 kg (or 0.25 kg) plates so 2.5 kg TM steps and the deload-week weights are loadable
- Flat bench
- Adjustable or paired dumbbells that move in 1 kg steps, from about 8 kg up
- Cable station with a high pulley (pulldown, crunch, pushdown) and a low pulley or floor position (seated row)

**No cable machine?** [{Lat Pulldown}] → [{Bent Over Row, Dumbbell}] or [{Inverted Row}]; [{Seated Row}] → [{Bent Over Row}]; [{Triceps Pushdown}] → [{Skullcrusher}] or [{Bench Dip}]; [{Cable Crunch}] → [{Hanging Leg Raise}] or [{Ab Wheel}].

## Rest Times

- **Main working sets**: 3 minutes. Take up to 5 on the AMRAP set.
- **FSL 5x5**: 2 minutes.
- **Assistance supersets** (dumbbell bench with pulldown, pushdown with split squat): 30 seconds between the alternating sets, so each exercise still gets about 90 seconds between its own sets.
- **Cable crunch and seated row**: 75 seconds.
- **Week 7**: 90 seconds on the main lifts, 60 seconds on the straight assistance sets, 30 seconds inside the supersets.

Warm-ups are not generated by the app in this program because the working weights are computed by a script when the workout starts. Warm up each main lift yourself before the first working set: empty bar for 5-10 reps, then about 70% of your first working set for 3 reps and 90% for 1-3 reps. Skip steps that are lighter than the empty bar. Budget 10 minutes per session for this.

## How to Pick Starting Weights

1. To import by hand, paste only the code block at the end of this page (from the first `///` line to the last `## Day 3`) into a new program's full-program text editor; the text above it is documentation, not Liftoscript. The program text ships with the author's training maxes on the four exercise lines: `tm: 81.5kg` for [{Squat}], `tm: 57kg` for [{Bench Press}], `tm: 90.5kg` for [{Deadlift}] and `tm: 41kg` for [{Overhead Press}] (80% of app-estimated maxes of 102 / 71 / 113.2 / 51 kg). Replace them with your own before the first workout: edit the `tm:` value on each exercise line, not on the `main` template. Use 85% of a 1RM estimated from a recent clean set of 3-5 reps. If your 1RM is an app estimate from sets of 10 or more reps, use 80%, because those estimates run high.
2. Alternatively set `tm: 0kg`: on the first workout the program takes **85% of the "1 Rep Max" saved in that exercise's settings** (tap the exercise name on the workout screen) and stores it as the TM. The estimated 1RM shown on the graphs does not count. If no 1 Rep Max is saved, the app silently takes 85% of its default starting weight for that exercise (Squat 60 kg, Bench Press 60 kg, Deadlift 82.5 kg, Overhead Press 32.5 kg), giving TMs of 51 / 51 / 70 / 27.5 kg, and keeps them, so check the field before you start. Later 1RM edits do not change a TM that is already set.
3. Example: a 100 kg squat 1RM gives a TM of 85 kg. The raw targets for week 1 are 55.3 / 63.8 / 72.3 kg and the week 3 top set is 80.8 kg. With the app's default 1.25 and 0.5 kg plates that shows as 55 / 63.5 / 71 kg, then 5x5 at 55 kg, and 80 kg for the week 3 1+ set.
4. Configure your plates in the app, including the small ones (1.25, 0.5 and 0.25 kg). Every set is rounded down to what your plates can load, so with the default 1.25 and 0.5 kg plates a 64.9 kg set becomes 63.5 kg, and with nothing smaller than 2.5 kg it becomes 60 kg. With a light overhead press TM the first deload set can fall below the empty bar; the app then shows the bar weight.
5. Assistance starts from the `load:` values on the exercise lines (16 / 45 / 25 / 45 / 20 / 10 kg as shipped). Pick loads you can do for all 5 sets of 10 with about 2 reps left and edit the values before the first workout, or just log all five sets at your weight in the first session and it becomes the base. A load of `0kg` makes the app ask for set 1's weight instead, copy it to the other sets, and save it rounded to your configured dumbbells or stack.

**Common mistake**: using your real 1RM as the TM. Wendler's advice: if in doubt, go lighter.

## Common Modifications

- **No supersets**: remove `/ 30s / superset: A` and `/ 30s / superset: B` from the six paired assistance lines (two on each day) to do every assistance exercise straight with 75 seconds rest. That adds about 8 minutes per session.
- **Short on time or recovery**: drop assistance to 3x10 and leave the rest unchanged. The assistance load then stops auto-progressing unless you also change `numberOfSets >= 5` to `numberOfSets >= 3` in the `assist` progression. Wendler's floor is 50 reps per category, so treat this as temporary.
- **Shoulder health**: add [{Face Pull}] for 50 reps on Day 2.
- **TM test instead of a deload**: in Week 7, work up to 100% TM for 3-5 reps on each lift. 5 strong reps means the TM is right. If the reps slow down or you cannot get 5, lower the TM before the next block.
- **Conditioning**: easy walking, bike or hill sprints on 2-3 off days, as Wendler recommends.
- **Training in lb**: the TMs and steps are written in kg, and the main lifts show kg until you rewrite them. Change the four `tm:` values to lb, every `load:` value to lb (or `0lb` to be asked on the first set), and the steps (`5kg` → `10lb`, `2.5kg` → `5lb`, `2kg` → `5lb`, `1kg` → `2.5lb`) so the increments land on your plates.

<!-- faq -->

### Is 5/3/1 Home Gym an official Wendler template?

No. It is a home gym adaptation of 5/3/1 for Beginners. The main lifts, the 5/3/1 wave, FSL and the 50-rep assistance floor are Wendler's. The dumbbell and cable assistance choices, the cycle-success rule for TM increases and the fixed assistance increments were added for this version.

### What happens if I miss a workout on 5/3/1 Home Gym?

Do the next program day when you can. Calendar days do not advance the program and there is no need to double up. A lift that is never logged on the last session of a cycle counts as an unfinished cycle, so its TM holds (or drops 10% if the previous cycle also failed).

### Why did my training max not go up after week 3?

The TM only increases when every logged session of the cycle was complete and clean, the cleanReps prompt was 1 every time, every session was logged, and the final 1+ set reached at least 3 reps. Check the cycle's history for a short set, a lighter weight, a session you never logged, or a 0 on the prompt. One failed cycle holds the TM; two in a row drop it by 10%.

### Why did an assistance weight stay the same after 5x10?

All five sets must be completed at the prescribed load or heavier with every rep done, and split squats need both legs. Check the log for a short set or a set done at a lighter weight. If the step is smaller than your equipment can load, the program jumps by the smallest loadable amount instead, so check the plates and dumbbells configured in the app.

### Do I need to test my max before starting 5/3/1 Home Gym?

No. Estimate the 1RM from a recent clean set of 3-5 reps, take 85% of it and type that into the tm value on the exercise line. If you leave tm at 0kg instead, the program takes 85% of the 1 Rep Max saved in the exercise's settings, and falls back to 85% of the app's default starting weight when nothing is saved there, so check that field first.

### How long does a 5/3/1 Home Gym session take?

About 86 minutes for the 31 working sets at the programmed rest times, plus roughly 10 minutes of warm-ups. The two assistance supersets are what keep it there; done straight, the same sets take about 94 minutes.

### Why does an assistance exercise show 0 kg?

A load of 0kg means that exercise's load value is unset, so the app asks for the weight when you complete set 1 and copies it to the remaining sets. The shipped file has a load for all six assistance exercises; you only see 0 kg if you set one to 0kg or imported an older copy.

### Can I run 5/3/1 Home Gym with 5 days a week?

No. Keep three sessions with rest days between them. The twice-weekly squat and bench frequency already covers the main lifts; use the off days for conditioning.

```liftoscript
/// 5/3/1 for Beginners + FSL, adapted to a home gym. 3 days per week, 7 training weeks, kg units.
/// To import by hand, paste ONLY this code block (from this line to the last "## Day 3") into
/// a new program's full-program text editor. The markdown above it is not Liftoscript.
/// SETUP: put your own training max (TM, about 85% of a real 1RM) in tm: on the four
/// exercise lines below. With tm: 0kg the first workout takes 85% of the "1 Rep Max" saved
/// in that exercise's settings; if none is saved it takes 85% of the app's default starting weight.
/// Assistance starts from the load: values on the exercise lines (the author's starting loads).
/// Set a load to 0kg to be asked for the weight on set 1 instead. To change a load during the
/// program, log all five sets at the new weight: it becomes the base for the next session.
/// Dumbbell loads are PER dumbbell. Split squat reps are PER leg.
/// Warm up each main lift yourself (empty bar, then ~70% and ~90% of set 1).
/// Automatic warm-ups are off because the working weights are set by the update script.
/// After Week 7, continue with the same saved program. Re-importing this text resets progress.

# Week 1
## Day 1

main / used: none / 1x5 0kg 180s, 1x5 0kg 180s, 1x5+ (AMRAP) 0kg 180s, 5x5 (FSL) 0kg 120s / warmup: none / progress: custom(tm: 0kg, step: 5kg, lastDay: 3, expected: 6, cycle: 0, lastWeek: 0, sessions: 0, cycleOk: 1, badCycles: 0, cleanReps+: 1) {~
  if (state.tm == 0kg) {
    state.tm = rm1 * 0.85
  }
  if (week < 7) {
    var.cycle = week <= 3 ? 1 : 2
    // The week going backwards means a new block started while this lift sat unlogged for a whole cycle.
    if (state.cycle != var.cycle || week < state.lastWeek) {
      // A lift left completely unlogged on its final session never ran this script.
      if (state.sessions > 0 && state.cycle != var.cycle) {
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
    if (!(numberOfSets >= 8 && completedNumberOfSets == numberOfSets && completedReps >= reps && completedWeights >= weights && state.cleanReps == 1)) {
      state.cycleOk = 0
    }
    if ((week == 3 || week == 6) && dayInWeek == state.lastDay) {
      if (state.cycleOk == 1 && state.sessions == state.expected && completedReps[3] >= 3) {
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
    state.lastWeek = week
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
      // Show a pending reset before the new cycle's first logged workout.
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
  if (state.load == 0kg && completedWeights[1] > 0kg) {
    // First use: the typed set-1 weight becomes the load, saved as what the equipment can actually load.
    // In the lighter week the typed weight is the 80% load, so scale it back up.
    state.load = roundWeight(week == 7 ? completedWeights[1] / 0.8 : completedWeights[1])
  }
  if (week < 7 && numberOfSets >= 5 && completedNumberOfSets == numberOfSets && completedWeights[1] > 0kg) {
    var.base = state.load
    if (completedWeights == completedWeights[1]) {
      // Every set logged at one weight makes that weight the base, so a deliberate change up or down sticks.
      var.base = roundWeight(completedWeights[1])
    }
    if (completedWeights >= var.base) {
      state.load = var.base
      var.good = completedReps >= reps
      if (state.bothSides == 1 && sum(completedRepsLeft) > 0 && !(completedRepsLeft >= reps)) {
        var.good = 0
      }
      if (var.good) {
        var.nextLoad = roundWeight(var.base + state.step)
        if (var.nextLoad <= var.base) {
          // The step is smaller than the equipment can load, so take the smallest loadable jump instead.
          var.nextLoad = increment(var.base)
        }
        if (var.nextLoad > var.base) {
          state.load = var.nextLoad
        }
      }
    }
  }
~} / update: custom() {~
  if (setIndex == 0) {
    weights = week == 7 ? state.load * 0.8 : state.load
    askweights = 0
    if (state.load == 0kg) {
      askweights[1] = 1
    }
  }
  if (setIndex == 1 && state.load == 0kg) {
    weights = completedWeights[1]
  }
~}

// Weeks 1-6: 3 ascending work sets, then 5x5 First Set Last at the first set's weight.
// The + set is a clean rep record attempt: stop with 1-2 good reps left.
// At the cleanReps prompt, enter 0 if you ground out reps or lost technique.
Squat[1-7] / ...main / progress: custom(tm: 81.5kg, step: 5kg, lastDay: 3, expected: 6) { ...main }
// ...Squat
Bench Press[1-7] / ...main / progress: custom(tm: 57kg, step: 2.5kg, lastDay: 3, expected: 6) { ...main }
// Flat bench. The load is per dumbbell. Leave about 2 reps in reserve.
// Superset with the pulldown: alternate sets, 30s between them.
Bench Press, Dumbbell[1-7] / ...assist / 30s / superset: A / progress: custom(load: 16kg) { ...assist }
// High pulley. Record the stack setting consistently.
Lat Pulldown[1-7] / ...assist / 30s / superset: A / progress: custom(step: 2kg, load: 45kg) { ...assist }
// Kneeling cable crunch. Pick a load you can move without pulling with your arms.
Cable Crunch[1-7] / ...assist / progress: custom(load: 25kg) { ...assist }

## Day 2
// ...Squat
Deadlift[1-7] / ...main / progress: custom(tm: 90.5kg, step: 5kg, lastDay: 2, expected: 3) { ...main }
// ...Squat
Overhead Press[1-7] / ...main / progress: custom(tm: 41kg, step: 2.5kg, lastDay: 2, expected: 3) { ...main }
// Low pulley. Sit on the flat bench or the floor, whichever your setup allows.
Seated Row[1-7] / ...assist / progress: custom(step: 2kg, load: 45kg) { ...assist }
// High pulley, rope or bar. Superset with the split squat: alternate sets, 30s between them.
Triceps Pushdown[1-7] / ...assist / 30s / superset: B / progress: custom(load: 20kg) { ...assist }
// Both feet on the floor, a dumbbell in each hand (the load is per dumbbell). 10 reps on EACH leg; the app logs left and right separately.
Split Squat[1-7] / ...assist / 30s / superset: B / progress: custom(bothSides: 1, load: 10kg) { ...assist }

## Day 3
// ...Squat[1]
Bench Press[1-7] / ...main
// ...Squat[1]
Squat[1-7] / ...main
// ...Bench Press, Dumbbell[1]
Bench Press, Dumbbell[1-7] / ...assist / 30s / superset: A
// ...Lat Pulldown[1]
Lat Pulldown[1-7] / ...assist / 30s / superset: A
// ...Cable Crunch[1]
Cable Crunch[1-7] / ...assist

# Week 2
## Day 1
main / 1x3 0kg 180s, 1x3 0kg 180s, 1x3+ (AMRAP) 0kg 180s, 5x5 (FSL) 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 3
// Cycle test week: get at least 3 clean reps on the 1+ set of each main lift. A complete, clean cycle earns the TM increase.
## Day 1
main / 1x5 0kg 180s, 1x3 0kg 180s, 1x1+ (AMRAP) 0kg 180s, 5x5 (FSL) 0kg 120s
assist / 5x10 0kg 75s
// Cycle test week: get at least 3 clean reps on the 1+ set of each main lift. A complete, clean cycle earns the TM increase.
## Day 2
// Cycle test week: get at least 3 clean reps on the 1+ set of each main lift. A complete, clean cycle earns the TM increase.
## Day 3

# Week 4
## Day 1
main / 1x5 0kg 180s, 1x5 0kg 180s, 1x5+ (AMRAP) 0kg 180s, 5x5 (FSL) 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 5
## Day 1
main / 1x3 0kg 180s, 1x3 0kg 180s, 1x3+ (AMRAP) 0kg 180s, 5x5 (FSL) 0kg 120s
assist / 5x10 0kg 75s
## Day 2
## Day 3

# Week 6
// Cycle test week: get at least 3 clean reps on the 1+ set of each main lift. A complete, clean cycle earns the TM increase.
## Day 1
main / 1x5 0kg 180s, 1x3 0kg 180s, 1x1+ (AMRAP) 0kg 180s, 5x5 (FSL) 0kg 120s
assist / 5x10 0kg 75s
// Cycle test week: get at least 3 clean reps on the 1+ set of each main lift. A complete, clean cycle earns the TM increase.
## Day 2
// Cycle test week: get at least 3 clean reps on the 1+ set of each main lift. A complete, clean cycle earns the TM increase.
## Day 3

# Week 7 - Lighter week
// Lighter week: easy 3x5 on the main lifts, 2x10 assistance at 80%. No AMRAP, no FSL, no progression changes.
## Day 1
main / 1x5 0kg 90s, 1x5 0kg 90s, 1x5 0kg 90s
assist / 2x10 0kg 60s
// Lighter week: easy 3x5 on the main lifts, 2x10 assistance at 80%. No AMRAP, no FSL, no progression changes.
## Day 2
// Lighter week: easy 3x5 on the main lifts, 2x10 assistance at 80%. No AMRAP, no FSL, no progression changes.
## Day 3
```
