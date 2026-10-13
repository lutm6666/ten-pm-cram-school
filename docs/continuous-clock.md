# Continuous task clock

`G.idx` identifies the next unfinished task. `G.stepReady` says whether its
scheduled `t` has arrived and its entry effects have been applied. Advancing
the task index never advances `G.clock`.

- `enterStep()` prepares a waiting task in walking mode. `activateStep()` runs
  once, from the walking clock, when `G.clock >= toMin(step().t)`.
- NPC entry instructions, chapter cards and automatic dialogues run only at
  activation. `openStep()` and `nextStep()` independently reject pending tasks.
- Waiting retains the previous stage's allowed side quests; movement, items,
  environment information and eligible chats remain available. Main markers,
  interaction and navigation become available at activation.
- Crowd schedules and named arrivals use the actual clock. Reaching the last
  task's index cannot start the closing phase before that task is active.
- `due` uses the original next non-auto task / minimum-eight-minute rule at
  activation. Late counters, minutes, scaled effects and log entries keep their
  existing calculation. Resume restores the original deadline instead of
  granting another eight minutes.
- Saves include `stepReady`, `due` and `chapterPending`. Resume replays completed
  NPC changes and the current task only when active. Walking minute checkpoints,
  returning Home and `pagehide` retain waiting time and position. A chapter not
  yet acknowledged is restored. Legacy saves infer activation from their clock.
- A side dialogue or minigame can spend time across a scheduled start. Pending
  main activation waits until walking resumes, so it cannot replace that dialogue.

## Skipping a wait

While a task is pending, the next card offers 「等到 HH:MM」. `skipWait()` sets
`G.clock` to the task's scheduled start (never beyond), runs the normal bell,
message and crowd updates, then `settleScene()` places anyone still walking on
real-time seconds (background arrivals, departures, named NPC entries and
in-progress paths) at their destinations before `activateStep()`. Waiting stays
optional: players may still explore, chat or do side tasks until the start.
`tests/continuous-clock.js` covers the skip on all five day-one roles.

While waiting, the card shows only 「空檔・可以四處看看」. The HUD names the
next time only for scheduled tasks (not random events, automatic tasks or
overtime), so nothing that should surprise the player is announced early.

Teaching roles (teacher, jh) never roam during class: when their task is
pending in the class phase, `lessonSkip()` keeps them at their podium and runs
the clock to the next task or the next non-class bell, whichever is first.

## Regression coverage

`npm test` builds the stub page and runs the existing navigation, narrative,
playthrough, resume and extras matrix together with `tests/continuous-clock.js`.
All five first-day roles and all five second-day roles remain in the matrix.
`npm run test:phase2` additionally checks real WebGL scenes and NPC movement.

The new clock suite covers twelve-minute-early completion on each role, guarded
interaction/completion before the start, natural activation, original late
penalties, waiting exploration/side quests, save/reload, chapter and auto events,
future NPCs and the final-task crowd phase. Clock-boundary assertions run just
before and at the scheduled start.

Playthroughs advance long waits through production `simulateFrame()` in slices
of at most 50 ms. They preserve task identity, require activation at the real
schedule and keep all original navigation bounds and ending assertions.
`__dbg.jump()` is an explicit scheduled-scene fixture available only in debug
builds; gameplay does not use it.

Continuous waiting exposed a classroom-exit merge in the yun playthrough. An
actor's passing step could move beyond an intermediate waypoint, then turn
back into the same four-person merge. `moveAgent()` now discards such obsolete
waypoints only when the next connector has safe line of sight. The final
destination, furniture boundaries and body separation remain required. The
navigation regression replays the failing four-actor positions at five frame
rates and requires every actor to arrive within the original 45-second bound.

Local verification on 2026-10-13 passed all 18 script invocations in the complete
matrix, including 13 clock scenario groups, plus the real WebGL Phase 2 runner.
Normal UI completion retained the visible 17:22 clock with the next task waiting
for 17:50. Manual Chromium play also retained 17:27 at completion and restored
the waiting state at 17:49. Physical mobile hardware was not tested.

On Windows, `tests/run.js` accepts `PYTHON` for the Python executable. Local
Chromium validation used installed Chrome because the pinned Chromium 129
binary fails the Windows side-by-side loader. GitHub Actions continues using
the repository's pinned Playwright and its Linux Chromium.
