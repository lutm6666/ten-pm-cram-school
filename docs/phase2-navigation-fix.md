# Phase 2 yenroll navigation fix (2026-10-13)

Base: `4f7df62611f5c064f4f7a81045c7972719f17ba4`, branch `art-overhaul-phase2`.

The parent can stall near `(18.995, 3.439)` while leaving class because the
teacher stands at `(18.6, 2.9)`. A passing step puts the current grid cell inside
the teacher's avoidance margin. A* used a static furniture-only start cell even
when its temporary route grid marked that cell and its neighbors unavailable.
Every detour then returned null. The player correctly arrived at the lobby but
the interaction target was still in class.

The detour now selects a continuously reachable start from the same avoidance
grid and keeps the connector waypoint. Actors inside a planning margin may move
out of it while retaining body collision checks. Furniture and room walls remain
collidable. Guidance follows the NPC anchor for the whole active trip, including
yield frames, rather than switching targets with the per-frame moving flag.

Hosted testing exposed an additional forward/back oscillation: stationary
obstacles never cleared, but each forward frame reset the delay before replanning.
Stationary NPCs now trigger an immediate detour. Furniture recovery retains the
traffic plan instead of replacing it with a static path through the same actor.
Standing story destinations are reserved while their NPCs are still moving;
story position changes replan active routes. Moving students yield through body
collision checks rather than masking the entire queue as a stationary obstacle.
The regression includes four time steps, three recorded podium positions and
the full classroom departure with the parent starting in her actual chair.

`tests/navigation.js` reproduces the podium jam at three time steps; the base
version fails and the fix passes arrival, wall and body separation assertions.
The test is part of `npm test`. No timeout was increased or test skipped.
Stub test builds omit external font links so logic tests do not wait on a font
CDN; the production page retains its fonts.

Real WebGL Chromium was played through the whole yun route with choice 1,
starting from the role selection. Main steps used the guide button and action
button; dialogue/choices/minigames were clicked through. There were no story
jumps, teleports or save-state fixtures in this run. yenroll was reached from the
counter and the parent dialogue opened; the route ended at 平安關門 with no page
errors. Screenshots, position/target JSON and video are saved in the task outputs.

The separate real WebGL phase2 regression passed earthquake text/cover pose and
cleanup, seven background C-class students plus named students reaching seats,
staggered traffic without overlap/wall crossing, distance-driven walking gait,
locker orientation, entrance model, mobile Chromium controls at 375/390/430px,
desk-corner escape and opposing traffic. Those stress scenarios use explicit
fixtures; they are distinct from the complete yun UI playthrough above.

The existing preview workflow additionally runs these real Chromium regressions
before publishing its screenshot artifact and preview branch. Full local and
GitHub Actions results must be checked against the submitted head; this document
alone is not proof of a completed hosted run.

Not verified: Safari, physical phones, all camera angles, or manual completion
of every route/choice. `main` is not merged or changed by this work.
