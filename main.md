# Solo System RPG — Product Blueprint
Last updated: 2026-04-15

---

# 1. Project Overview

## Working Title
**Solo System RPG**

## Format
Telegram Mini App + Telegram Bot notifications

## Core Idea
This is not just a fitness tracker.
This is a **personal progression operating system** inspired by Solo Leveling.

The app turns real-life self-development into an RPG-like system with:

- character profile
- stats
- levels
- ranks
- quests
- streaks
- body progression
- learning progression
- discipline progression
- adaptive recommendations
- Telegram-based reminders and interaction

The user develops across multiple dimensions of life, not only gym performance.

---

# 2. Product Vision

## Main Fantasy
The user should feel:

- “I have entered a system”
- “My life is becoming measurable and progressive”
- “I am leveling up as a character”
- “My body, mind, discipline, and knowledge all matter”
- “The system knows me, evaluates me, and gives me missions”
- “My progress is visible, ranked, and earned”

## Product Type
**AI-assisted self-development RPG system**

## Core Promise
The system should help the user become stronger, healthier, smarter, more disciplined, and more capable through structured daily and weekly progression mechanics.

---

# 3. Platform Context

## Primary Platform
Telegram Mini App

## Secondary Component
Telegram Bot

## Why this matters
The product must be designed specifically for Telegram behavior:

- quick access
- mobile-first
- short interactions
- notification-driven re-engagement
- direct quest reminders in Telegram
- lightweight UI flows
- fast check-ins

## Notification Delivery
All reminders and alerts should come through Telegram, not email.

Examples:

- daily quest generated
- reminder to log meals
- reminder to log water
- training reminder
- weekly weigh-in reminder
- streak warning
- weekly review ready
- mission failed / incomplete
- achievement unlocked
- rank increased

---

# 4. Product Goal

## Main Goal
Build a Telegram-based RPG-style life system that tracks, evaluates, and improves the user across:

- physical development
- nutrition
- sleep and recovery
- discipline
- learning
- languages
- goals and routine

## Secondary Goal
Create a system that feels alive and intelligent, not just a static tracker.

---

# 5. Product Pillars

## Pillar 1 — Identity
The system must know the user deeply enough to generate relevant progression.

## Pillar 2 — Progression
Everything should connect to measurable character growth.

## Pillar 3 — Adaptive Missions
The system should assign quests based on the user’s actual state.

## Pillar 4 — RPG Feedback
The user must feel visible advancement through XP, ranks, achievements, and stat changes.

## Pillar 5 — Telegram Loop
The app must use Telegram as a natural interaction and re-engagement channel.

---

# 6. Core User Types

## Primary User
A self-improvement oriented user who wants:

- structure
- progression
- gamification
- habit control
- body transformation
- learning growth
- accountability

## Typical motivations
- lose weight
- gain muscle
- become disciplined
- improve sleep
- learn language
- build stronger routine
- become more consistent
- feel “locked in”

---

# 7. Product Scope

## The app should track
- body metrics
- workouts
- food and drink
- sleep
- hydration
- habits
- learning sessions
- language sessions
- personal goals
- weekly check-ins

## The app should calculate
- XP
- levels
- rank
- domain scores
- streaks
- quest completion
- performance trends
- mission difficulty
- adaptation logic

## The app should generate
- daily quests
- weekly quests
- review summaries
- system messages
- warnings
- recommendations

---

# 8. Core System Domains

The app is built around 5 major growth domains.

## 8.1 Body
Tracks body transformation and physical capability.

Includes:
- weight
- target weight
- body progress
- training frequency
- exercise progression
- strength trends
- endurance
- body consistency

## 8.2 Nutrition
Tracks intake quality and eating behavior.

Includes:
- meals
- water
- protein
- calories
- macros
- sugar habits
- meal timing
- consistency

## 8.3 Recovery
Tracks the user’s restoration capacity.

Includes:
- sleep duration
- sleep quality
- energy level
- stress
- fatigue
- recovery score

## 8.4 Mind
Tracks cognitive growth and knowledge.

Includes:
- reading
- study sessions
- focused work
- knowledge tasks
- mental consistency

## 8.5 Language
Tracks language acquisition.

Includes:
- vocabulary practice
- listening practice
- grammar study
- speaking sessions
- reading in target language
- streak and skill progression

---

# 9. Character System

## 9.1 Character Profile
Each user has a character profile.

### Core profile data
- Telegram user ID
- username / display name
- age
- sex
- height
- current weight
- target weight
- activity level
- experience level in training
- selected goals
- primary growth path
- secondary growth path
- preferred language
- notification preferences
- daily available time
- restrictions / limitations

## 9.2 Character Identity Layer
The user should feel like a character, not just a profile row.

Possible components:
- character card
- class / path
- title
- rank badge
- overall level
- domain levels
- streak aura
- evolution status

---

# 10. Stats System

## 10.1 Main Stats
The user should have both overall and domain-specific stats.

### Physical Stats
- Strength
- Endurance
- Mobility
- Recovery
- Consistency
- Body Control

### Mental Stats
- Focus
- Discipline
- Learning
- Resilience
- Knowledge

### Life Progress Stats
- Language Skill
- Routine Stability
- Nutrition Control
- Sleep Stability
- Goal Compliance

## 10.2 Stat Design Principle
Stats should not be fake decoration.
Each stat must be tied to actual logged behavior or outcome.

Example:
- Discipline increases through repeated mission completion
- Recovery increases through good sleep and fatigue control
- Language skill increases through real logged language practice
- Strength increases through workout progression

---

# 11. Progression System

## 11.1 XP Model
The app should use layered XP.

### Action XP
Awarded for performing actions.
Examples:
- logged workout
- logged water
- logged meal
- completed study session
- weekly weigh-in submitted

### Quality XP
Awarded for good execution.
Examples:
- completed full workout
- hit protein target
- slept over target hours
- stayed within nutrition target
- completed difficult quest

### Outcome XP
Awarded for real progress results.
Examples:
- improved body weight trend toward goal
- increased strength
- improved streak consistency
- reduced missed tasks
- improved language performance

## 11.2 Why layered XP matters
Without layered XP, users can game the system with meaningless taps.
The system must reward real progress, not button pressing.

---

# 12. Level System

## 12.1 Overall Level
Represents total progression across all systems.

## 12.2 Domain Levels
Separate levels for:
- Body
- Nutrition
- Recovery
- Mind
- Language

## 12.3 Leveling Principle
The overall level should come from combined progression, not only gym logs.

---

# 13. Rank System

## Proposed rank ladder
- Unranked
- Bronze
- Silver
- Gold
- Platinum
- Diamond
- Master
- Legend

## Rank logic
Rank should not depend only on total XP.

Rank should also include:
- consistency
- quest completion quality
- weekly compliance
- body trend alignment with goal
- recovery stability
- discipline score

This prevents fake progression through spam logging.

---

# 14. Paths / Archetypes

The user may choose one main path and one secondary path.

## Example Paths
- Warrior Path
- Discipline Path
- Scholar Path
- Polyglot Path
- Rebuild Path
- Aesthetic Path
- Balance Path

## Function of Paths
Paths affect:
- mission weighting
- XP weighting
- recommendation style
- achievement types
- dashboard focus

Example:
If the user selects Warrior Path:
- workouts matter more
- strength missions appear more often
- body domain gets higher quest frequency

If the user selects Polyglot Path:
- language missions appear more often
- speaking/listening logs matter more

---

# 15. Quest System

This is the heart of the product.

## 15.1 Daily Quests
Every day the system generates:
- 1 main quest
- 2–4 side quests
- 1 discipline quest
- 1 recovery quest

### Example
**Main Quest**
- Complete upper body workout

**Side Quests**
- Drink 2.5L water
- Hit 140g protein
- Practice English for 20 minutes

**Discipline Quest**
- Sleep before 00:00

**Recovery Quest**
- Walk 7000 steps

## 15.2 Weekly Quests
Examples:
- complete 4 workouts
- lose 0.3–0.7 kg depending on goal
- maintain calorie compliance on 5 days
- complete 3 language sessions
- submit weekly reflection
- keep streak alive for 7 days

## 15.3 Quest Principles
Quests must be:
- personalized
- achievable
- adaptive
- measurable
- relevant to goals

---

# 16. Adaptive Mission Engine

## Inputs
- user goal
- current weight
- weekly check-in
- recent compliance
- preferred path
- time availability
- sleep condition
- missed tasks
- streak status

## Outputs
- daily quest package
- difficulty level
- reminders
- fallback missions
- weekly adjustments

## Behavior examples
If user misses many quests:
- reduce volume
- prioritize minimum effective actions
- shift toward recovery and discipline

If user performs well:
- increase mission complexity
- unlock harder quests
- raise reward tier

If user’s weight is moving away from goal:
- increase nutrition-focused tasks
- tighten compliance quests
- trigger analysis message

---

# 17. Weekly Review System

Every week the system should ask for a structured check-in.

## Weekly inputs
- current weight
- optional body photo
- energy level
- sleep quality
- stress level
- adherence rating
- comment / reflection
- wins of the week
- hardest obstacle

## Weekly outputs
- weekly score
- body trend analysis
- compliance analysis
- rank impact
- mission plan for next week
- system narrative summary

## Example output tone
- “Weekly review completed.”
- “Body alignment with goal: stable.”
- “Discipline score improved.”
- “Sleep debt detected.”
- “Nutrition compliance is the main bottleneck.”

---

# 18. Logging Systems

## 18.1 Body Metrics
- weight
- waist
- chest
- arms
- hips
- body photos
- weekly progress note

## 18.2 Workout Logging
- workout name
- training type
- exercises
- sets
- reps
- load
- duration
- RPE / difficulty
- completion status

## 18.3 Nutrition Logging
- meal entries
- calories
- protein
- carbs
- fats
- meal type
- notes
- whether user stayed on plan

## 18.4 Water Logging
- total liters / ml
- completion vs target

## 18.5 Sleep Logging
- sleep start
- wake time
- total sleep duration
- sleep quality
- morning energy

## 18.6 Learning Logging
- topic
- minutes
- content type
- difficulty
- notes

## 18.7 Language Logging
- language
- type: vocabulary / listening / grammar / speaking / reading
- duration
- result
- notes

## 18.8 Habit Logging
- habit type
- completed or missed
- count
- streak impact

---

# 19. Nutrition and Weight Logic

## Important rule
Weight must matter, but it must **not** be the only signal.

## Weight-related scoring should depend on the user’s goal
### If goal = fat loss
Positive signals:
- safe downward trend
- nutrition compliance
- protein adherence
- workout compliance
- water consistency

### If goal = muscle gain
Positive signals:
- strength improvement
- weight gain within target range
- protein target
- workout progression

### If goal = recomposition
Positive signals:
- stable or slight weight change
- better strength
- improved compliance
- better body metrics

---

# 20. Discipline System

Discipline is a central stat.

## Discipline should consider
- quest completion rate
- consistency
- task delay behavior
- streak survival
- daily check-in habits
- missed mission frequency

## Why this matters
The system should reward structure, not only performance output.

---

# 21. Streak System

## Types of streaks
- daily login streak
- daily quest streak
- workout streak
- nutrition streak
- language streak
- weekly review streak

## Streak behavior
- streak raises discipline score
- streak improves mission rewards
- streak may unlock titles
- streak breaks should hurt, but not destroy motivation

---

# 22. Penalty System

Penalties should exist, but be controlled.

## Possible penalties
- streak reset
- partial quest XP loss
- discipline score drop
- warning message
- rank pressure if repeated

## Important design rule
Do not make the system toxic.
Use pressure, not humiliation.

Tone should be:
- serious
- system-like
- corrective
- motivating

Not:
- insulting
- mocking
- punishing excessively

---

# 23. Achievement System

## Examples
- First Blood — complete first quest
- Iron Initiate — complete first 10 workouts
- Water Protocol — hit hydration target 7 days
- Protein Disciple — hit protein target 10 times
- Language Hunter — complete 20 language sessions
- Discipline Keeper — preserve streak for 21 days
- Weekly Survivor — complete 4 weekly reviews

---

# 24. Notification System (Telegram)

## Delivery channel
Telegram Bot messages

## Required notification types
- daily quests available
- daily reminder
- meal log reminder
- water reminder
- workout reminder
- sleep reminder
- weekly weigh-in request
- weekly review ready
- streak at risk
- achievement unlocked
- level up
- rank up
- mission failed
- personalized insight

## Notification style
Short, sharp, system-like.

### Example tone
- “Daily quest package generated.”
- “Hydration target behind schedule.”
- “Weekly weigh-in required.”
- “Quest window closing.”
- “Discipline streak at risk.”
- “Rank advancement conditions nearly met.”

---

# 25. Telegram UX Model

## App Entry Points
Users should be able to enter from:
- Telegram Bot button
- Mini App launch button
- reminder links
- command-based flows later if needed

## UX principle
The Telegram experience should support:
- quick open
- quick log
- quick complete
- quick review

The Mini App is the main interface.
The Bot is the reminder and trigger layer.

---

# 26. Visual Direction

## Visual theme
Inspired by Solo Leveling system aesthetics:
- dark UI
- high contrast
- neon glow
- cyber HUD style
- rank badges
- XP bars
- glowing cards
- system overlays
- body maps
- futuristic typography treatment

## Mood
- elite
- mysterious
- progression-driven
- powerful
- game-like but clean

## UI characteristics
- mobile-first
- strong hierarchy
- bold progress indicators
- compact logging flows
- smooth animated transitions
- responsive inside Telegram WebView

---

# 27. Screen Architecture

## Main Screens

### 1. Home
- greeting / system status
- overall level
- current rank
- XP bar
- today quests
- streak summary
- quick log shortcuts

### 2. Character
- avatar / identity card
- stats
- path
- titles
- domain levels
- progress overview

### 3. Quests
- daily quests
- weekly quests
- completed quests
- failed quests
- rewards

### 4. Body
- weight
- metrics
- progress chart
- workout summary
- body domain status

### 5. Nutrition
- meal log
- water log
- macros
- daily compliance

### 6. Mind
- learning sessions
- knowledge stats
- focus history

### 7. Language
- language sessions
- streak
- skill categories
- weekly total

### 8. Weekly Review
- weigh-in
- reflections
- weekly score
- system analysis

### 9. Settings
- goals
- notification preferences
- path preferences
- Telegram settings
- privacy

---

# 28. MVP Definition

## MVP Goal
Build the first working version that already feels like a real progression system.

## MVP includes
1. Telegram auth / identity binding
2. onboarding
3. character profile
4. goals setup
5. daily quests
6. weekly quests
7. workout logging
8. nutrition logging
9. water logging
10. weekly weigh-in
11. XP, levels, ranks
12. streaks
13. Telegram reminders
14. weekly review summary

## MVP does not need yet
- full AI coaching depth
- wearable integrations
- social features
- guilds
- PvP
- advanced computer vision
- fully dynamic body avatar
- ultra-complex nutrition engine

---

# 29. V2 Ideas

- AI-generated weekly coaching analysis
- adaptive difficulty engine refinement
- stronger body visualization
- deeper language analytics
- journaling intelligence
- mood correlation
- calendar-linked plans
- voice input
- advanced achievements
- personalized risk alerts

---

# 30. V3 Ideas

- guild / squad mode
- friend leaderboards
- boss battles
- co-op quests
- mentor mode
- shared accountability
- deeper AI story mode
- custom class system
- premium coaching modules

---

# 31. Technical Direction

## Suggested stack
### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend
- Supabase
- Postgres
- Edge Functions if needed

### Auth
- Telegram auth binding for Mini App
- user profile linked to Telegram ID

### State / forms
- Zustand
- React Hook Form
- Zod

### Charts / analytics
- Recharts

### Notifications
- Telegram Bot API

---

# 32. Data Model — High Level

## Main entities
- users
- profiles
- goals
- user_paths
- domain_scores
- weekly_checkins
- body_metrics
- workouts
- workout_exercises
- food_logs
- water_logs
- sleep_logs
- learning_logs
- language_logs
- habits
- quests
- quest_assignments
- quest_completions
- xp_events
- levels
- ranks
- achievements
- streaks
- notifications
- system_messages

---

# 33. Business Logic Principles

## Principle 1
No fake progression.

## Principle 2
User actions must affect stats meaningfully.

## Principle 3
The system should adapt, not spam.

## Principle 4
The app should stay lightweight in daily use.

## Principle 5
Telegram should be treated as a core product surface, not an afterthought.

---

# 34. Agent-Oriented Development Context

The project will be developed in VS Code with Claude Code and multiple agents.

## Important clarification
Do **not** design the production app to “run all agents every time”.
That is a development workflow problem, not an end-user runtime requirement.

## Correct separation
### Development agents
Used during project building:
- architect agent
- frontend agent
- backend agent
- DB agent
- QA agent
- prompt/doc agent
- product agent

### Runtime intelligence
Used in app logic:
- quest generator
- weekly analyzer
- nutrition analyzer
- discipline evaluator
- risk detector

---

# 35. Development Workflow Recommendation

## Development modes
### Mode A — Planning
Agents analyze specs, architecture, UX, and data model.

### Mode B — Build
Agents implement features in parallel by module.

### Mode C — QA
Agents validate:
- types
- flows
- mobile UI
- Telegram WebView behavior
- logic correctness

### Mode D — Refine
Agents optimize animation, UX friction, ranking logic, and scoring.

---

# 36. Obsidian Vault Strategy

This project should be stored in an Obsidian vault as a **single source of truth**.

## Goal
Claude should always read:
- what the product is
- how it should behave
- what is already built
- what is next
- what rules must never be broken

## Recommended vault structure

```text
Solo-System-Vault/
  00_START_HERE/
    00_Project_Index.md
    01_Product_Blueprint.md
    02_Non_Negotiables.md
    03_Roadmap.md
    04_Current_State.md
    05_Next_Steps.md

  01_PRODUCT/
    Vision.md
    Core_Fantasy.md
    User_Personas.md
    Core_Loops.md
    Game_Mechanics.md
    Telegram_Experience.md
    Notification_System.md
    Monetization_Ideas.md

  02_UX_UI/
    UX_Principles.md
    Screen_Map.md
    Onboarding_Flow.md
    Home_Screen.md
    Character_Screen.md
    Quest_Screen.md
    Logging_Flows.md
    Weekly_Review_Flow.md
    Visual_Direction.md
    Motion_Guidelines.md

  03_SYSTEMS/
    Stats_System.md
    XP_System.md
    Level_System.md
    Rank_System.md
    Quest_System.md
    Streak_System.md
    Penalty_System.md
    Achievement_System.md
    Adaptive_Mission_Engine.md
    Weekly_Review_System.md

  04_DATA/
    Data_Model_Overview.md
    Database_Schema.md
    Table_Definitions.md
    Event_Model.md
    Domain_Score_Logic.md
    Notification_Triggers.md

  05_TECH/
    Architecture.md
    Frontend_Architecture.md
    Backend_Architecture.md
    Telegram_Integration.md
    Supabase_Setup.md
    Env_Variables.md
    Deployment.md
    Security.md

  06_BUILD/
    MVP_Scope.md
    Milestone_01_Foundation.md
    Milestone_02_Core_Loops.md
    Milestone_03_Progression.md
    Milestone_04_Notifications.md
    Milestone_05_Polish.md

  07_TASKS/
    Backlog.md
    Current_Sprint.md
    Bugs.md
    Decisions_Log.md
    Open_Questions.md

  08_PROMPTS/
    Claude_Master_Instruction.md
    Architect_Agent_Prompt.md
    Frontend_Agent_Prompt.md
    Backend_Agent_Prompt.md
    DB_Agent_Prompt.md
    QA_Agent_Prompt.md
    UI_Agent_Prompt.md

  09_REFERENCE/
    Inspiration.md
    Solo_Leveling_Style_Reference.md
    Telegram_Mini_App_Constraints.md
    UI_Examples.md

  10_LOGS/
    Build_Log.md
    Session_Log.md
    Release_Notes.md

37. Obsidian Organization Rules
Rule 1

00_START_HERE/00_Project_Index.md must be the first file Claude reads.

Rule 2

Every file must have:

purpose
status
owner
last updated
related files
Rule 3

Keep a strict distinction between:

product decisions
technical decisions
task lists
finished facts
open questions
Rule 4

Never mix temporary ideas with final rules without labeling them.

Rule 5

Maintain a file called:
02_Non_Negotiables.md
This should list all rules Claude must never violate.

38. Recommended Core Obsidian Files
00_Project_Index.md

Main navigation page.

Should include:

project summary
current milestone
current priorities
critical docs
quick links
01_Product_Blueprint.md

The master product definition.

02_Non_Negotiables.md

Examples:

must remain Telegram Mini App first
notifications must go to Telegram
mobile-first UX only
no fake XP mechanics
no bloated desktop-first layouts
stats must be tied to real behavior
progression must feel earned
04_Current_State.md

What is already built right now.

05_Next_Steps.md

What Claude should work on next.

39. How to Use Obsidian with Claude Well
Best practice

At the beginning of each work session, Claude should be given:

current milestone
current state
current task
non-negotiables
relevant system files
acceptance criteria
Good workflow
Step 1

Update Current_State.md

Step 2

Update Next_Steps.md

Step 3

Ask Claude to read:

Project Index
Product Blueprint
Non-Negotiables
Current State
Next Steps
relevant module docs
Step 4

Only then assign implementation work

40. Recommended Markdown Template for Each Obsidian File
# File Title

## Purpose
What this file defines.

## Status
Draft / Active / Final / Deprecated

## Owner
You / Claude / Shared

## Last Updated
YYYY-MM-DD

## Related Files
- [[Some_File]]
- [[Another_File]]

## Content
...
41. Master Development Plan
Phase 0 — Product Definition

Goal:
fully lock the product before coding too much.

Deliverables:

product blueprint
screen map
system logic
MVP definition
non-negotiables
architecture direction
Phase 1 — Foundation

Goal:
set up project shell and infrastructure.

Deliverables:

app shell
Telegram auth
DB project
initial schema
environment setup
basic routing
base theme
Phase 2 — Core User Loop

Goal:
let user onboard and interact with core progression loop.

Deliverables:

onboarding
profile creation
goals
path selection
daily quest generation
quest completion flow
Phase 3 — Logging Engine

Goal:
build meaningful input systems.

Deliverables:

workout logs
food logs
water logs
weekly check-ins
sleep logs
learning logs
language logs
Phase 4 — Progression Engine

Goal:
make the app feel like a real system.

Deliverables:

XP logic
levels
rank logic
streaks
achievements
domain scoring
Phase 5 — Telegram Integration

Goal:
build full re-engagement loop.

Deliverables:

bot notifications
reminders
streak alerts
review reminders
level-up alerts
Phase 6 — Polish

Goal:
make it feel premium and complete.

Deliverables:

motion
glow UI
system messages
edge-case handling
mobile optimization
data consistency pass
42. Milestone Plan
Milestone 1 — Foundation
create repo
create app structure
configure Telegram Mini App basics
configure Supabase
define core schema
set theme tokens
define navigation shell
Milestone 2 — Onboarding + Profile
build onboarding flow
create profile
set goals
set weight / target weight
set paths
save preferences
Milestone 3 — Quest System
implement daily quests
implement weekly quests
quest states
quest completion
quest reward system
Milestone 4 — Logging
workouts
meals
water
weekly weigh-ins
sleep
learning
language
Milestone 5 — Progression
XP engine
level engine
rank engine
streak engine
achievements
Milestone 6 — Telegram Notifications
bot integration
event-based notifications
reminders
weekly prompts
rank/achievement alerts
Milestone 7 — Review and Polish
bug pass
UI cleanup
logic validation
scoring rebalance
message tone consistency
43. Manual Checklist — Product Definition
Must be decided manually before serious build
exact app name
target audience priority
core domains included in MVP
rank ladder final version
path names final version
daily quest categories
weekly review questions
notification style
visual direction references
exact MVP boundaries
44. Manual Checklist — Telegram
Must be handled manually
create Telegram Bot
get Bot Token
configure Mini App launch path
decide bot username
define notification message style
define deep link behavior
define commands if needed
test notifications on real Telegram device
45. Manual Checklist — Supabase / Backend
Must be done manually
create Supabase project
save keys securely
create schema
configure RLS
set storage buckets if needed
create environment variables
document table ownership
define migration policy
46. Manual Checklist — UI / UX
Must be handled manually
define brand palette
define glow intensity
define card styles
define animation rules
define icon system
define mobile spacing
define text hierarchy
define empty states
define loading states
47. Manual Checklist — Logic Validation
Must be checked manually
can users exploit XP?
are quests meaningful?
is rank fair?
does weight logic match different goals?
do streak penalties feel too harsh?
are notifications too spammy?
are stats decorative or real?
is the app still useful if user skips 2–3 days?
is weekly review valuable or annoying?
48. Manual Checklist — Claude Session Start

Before giving Claude a new task, manually verify:

Current_State.md is updated
Next_Steps.md is updated
task scope is narrow
acceptance criteria are written
relevant files are linked
Claude knows what not to change
49. Suggested Non-Negotiables
# Non-Negotiables

- This product is Telegram Mini App first.
- Notifications must go to Telegram.
- UX must be mobile-first.
- The product is not just a fitness tracker.
- The system must support body, nutrition, recovery, mind, and language progression.
- XP must reflect real behavior and progress.
- Rank must not be based on fake spam actions.
- Daily use must be fast and low-friction.
- The interface must feel premium and system-like.
- Architecture should remain modular.
- Product logic is more important than superficial visuals.
50. Recommended Claude Master Instruction
You are working on Solo System RPG, a Telegram Mini App inspired by Solo Leveling.
This product is a self-development RPG system, not a generic habit tracker.

Always preserve the following:
- Telegram-first UX
- mobile-first layout
- meaningful progression
- adaptive quest logic
- real stat relationships
- premium dark futuristic visual direction
- modular architecture
- low-friction daily interactions

Before implementing any feature:
1. read Project Index
2. read Product Blueprint
3. read Non-Negotiables
4. read Current State
5. read Next Steps
6. read relevant system/tech docs

Do not introduce:
- desktop-first complexity
- fake gamification
- bloated navigation
- decorative stats without logic
- inconsistent naming
- random one-off components
- weak progression math

When building, think like:
- product architect
- game systems designer
- mobile UX designer
- Telegram-native app engineer
51. Recommended Development Session Template
# Session Brief

## Goal
What must be achieved in this session.

## Scope
Which files/modules can be changed.

## Do Not Change
List protected areas.

## Acceptance Criteria
- criterion 1
- criterion 2
- criterion 3

## References
- [[01_Product_Blueprint]]
- [[02_Non_Negotiables]]
- [[Current_State]]
- [[Next_Steps]]
52. What to Build First
Recommended order
lock product docs
set up Obsidian vault
define non-negotiables
define screen map
define schema draft
define quest logic draft
set up Telegram bot
set up Mini App shell
implement onboarding
implement daily quest flow

This is the correct order.
Do not start with beautiful UI only.

53. Biggest Risks
Risk 1

Beautiful interface with weak progression logic

Risk 2

Overcomplicated features before MVP loop works

Risk 3

Too many logs, too much friction

Risk 4

Spammy Telegram reminders

Risk 5

Meaningless XP inflation

Risk 6

Claude working without a stable source of truth

54. Final Product Summary

Solo System RPG is a Telegram Mini App that transforms self-development into a progression system inspired by Solo Leveling.

The user tracks body, nutrition, sleep, learning, language, and discipline.

The system evaluates behavior, generates quests, awards XP, calculates levels and ranks, sends Telegram notifications, and produces a real sense of progression.

The core value is not tracking alone.
The core value is turning personal growth into an earned system of advancement.


Ниже — как **лучше организовать Obsidian Vault**, чтобы Claude реально работал умно, а не хаотично.

## Как организовать vault правильно

Главная идея: у тебя в vault должно быть 3 слоя.

### 1. Слой истины
Это файлы, которые считаются главными и редактируются осторожно:
- `00_Project_Index.md`
- `01_Product_Blueprint.md`
- `02_Non_Negotiables.md`
- `03_Roadmap.md`

Это “конституция” проекта.

### 2. Слой текущей работы
Это то, что меняется постоянно:
- `04_Current_State.md`
- `05_Next_Steps.md`
- `07_TASKS/Backlog.md`
- `07_TASKS/Current_Sprint.md`
- `10_LOGS/Session_Log.md`

Это “оперативка”.

### 3. Слой спецификаций
Это модули:
- quests
- XP
- UI
- DB
- Telegram
- notifications
- onboarding

Это “инженерная база”.

---

## Самый важный принцип

Claude не должен каждый раз читать весь vault подряд.
Иначе будет каша.

Ему надо давать такой маршрут чтения:

1. `00_Project_Index.md`
2. `02_Non_Negotiables.md`
3. `04_Current_State.md`
4. `05_Next_Steps.md`
5. нужные модульные файлы

То есть сначала контекст, потом задача, потом только нужная глубина.

---

## Какой файл создать первым

Создай сначала ровно эти 6 файлов:

- `00_START_HERE/00_Project_Index.md`
- `00_START_HERE/01_Product_Blueprint.md`
- `00_START_HERE/02_Non_Negotiables.md`
- `00_START_HERE/03_Roadmap.md`
- `00_START_HERE/04_Current_State.md`
- `00_START_HERE/05_Next_Steps.md`

Этого уже хватит, чтобы работать системно.

---

## Что писать в `04_Current_State.md`

Там только факты:

- что уже создано
- что работает
- что не работает
- какие технологии уже выбраны
- какие решения уже зафиксированы
- какие файлы / папки уже есть
- какие риски известны

Не пиши туда хотелки. Только состояние.

---

## Что писать в `05_Next_Steps.md`

Там:
- ближайшая цель
- текущий milestone
- 3–7 следующих задач
- критерии готовности
- что нельзя трогать

---

## Как работать с Claude по-сильному

На каждую новую сессию давай ему не просто “сделай экран”, а вот так:

```md
Read these files first:
- 00_START_HERE/00_Project_Index.md
- 00_START_HERE/02_Non_Negotiables.md
- 00_START_HERE/04_Current_State.md
- 00_START_HERE/05_Next_Steps.md
- 03_SYSTEMS/Quest_System.md
- 02_UX_UI/Quest_Screen.md

Task:
Implement the Daily Quests screen for Telegram Mini App.

Requirements:
- mobile-first
- dark neon system style
- quick completion flow
- support main quest, side quests, discipline quest, recovery quest
- must feel premium and game-like
- do not change global navigation
- do not invent new product rules

Это уже сильно лучше, чем просто “сделай красиво”.

Что еще советую добавить в vault

Сильно поможет 4 дополнительных файла:

Decisions_Log.md — почему приняли важные решения
Open_Questions.md — что еще не решено
Bugs.md — ошибки и странности
Session_Log.md — что делали в каждой сессии

Это резко снижает хаос.

Практический совет по структуре папок

Если хочешь очень удобно, делай названия с цифрами, как я выше показал.
Тогда в Obsidian все будет идти в правильном порядке.
