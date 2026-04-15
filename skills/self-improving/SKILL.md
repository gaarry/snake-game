---
name: Self-Improving Agent (Proactive + Self-Reflection)
slug: self-improving
version: 1.2.13
homepage: https://clawic.com/skills/self-improving
description: "Self-reflection + Self-criticism + Self-learning + Self-organizing memory. Agent evaluates its own work, catches mistakes, and improves permanently. Use when (1) a command, tool, API, or operation fails; (2) the user corrects you or rejects your work; (3) you realize your knowledge is outdated or incorrect; (4) you discover a better approach; (5) the user explicitly installs or references the skill for the current task."
changelog: "Aligns heartbeat installation with the standard workspace setup so recurring maintenance is added alongside the existing self-improving routing."
metadata: {"clawdbot":{"emoji":"🧠","requires":{"bins":[]},"os":["linux","darwin","win32"],"configPaths":["~/self-improving/"],"configPaths.optional":["./AGENTS.md","./SOUL.md","./HEARTBEAT.md"]}}
---

## When to Use

User corrects you or points out mistakes. You complete significant work and want to evaluate the outcome. You notice something in your own output that could be better. Knowledge should compound over time without manual maintenance.

## Architecture

Memory lives in `~/self-improving/` with tiered structure. If `~/self-improving/` does not exist, run `setup.md`.
Workspace setup should add the standard self-improving steering to the workspace AGENTS, SOUL, and `HEARTBEAT.md` files, with recurring maintenance routed through `heartbeat-rules.md`.

### 执行流程 (5 Phases)

```
Phase 1: 检测 (Detection)
  → 检测 Correction/Preference/Pattern 信号
  → 命中 → 进入 Phase 2
  → 未命中 → 结束

Phase 2: 记录 (Logging)
  → 写入 corrections.md
  → 格式: [CONTEXT]/[REFLECTION]/[LESSON]
  → 检查: 是否3x重复？
    → 是 → 进入 Phase 3
    → 否 → 结束

Phase 3: 确认 (Confirmation)
  → 向用户确认: "这个 pattern 要固化吗？"
  → 用户确认 → 进入 Phase 4
  → 用户拒绝 → 结束

Phase 4: 固化 (Solidify)
  → 移动到 memory.md (HOT) 或对应 namespace
  → 更新 index.md

Phase 5: 归档 (Archive)
  → 按需压缩/归档 cold 条目
  → 保持各层 size limit
```

### 边界条件 (Fallback)

| 场景 | 处理方式 |
|------|----------|
| 用户输入模糊/歧义 | 先问清楚再处理，不自行推断 |
| 冲突的 pattern | 按优先级: project > domain > global，最新优先 |
| memory.md 超100行 | 自动压缩/归档后写入 |
| 无法读取文件 | 通知用户，Graceful Degradation |
| 上下文超限 | 只加载 HOT 层，其余按需加载 |

```
~/self-improving/
├── memory.md          # HOT: ≤100 lines, always loaded
├── index.md           # Topic index with line counts
├── heartbeat-state.md # Heartbeat state: last run, reviewed change, action notes
├── projects/          # Per-project learnings
├── domains/           # Domain-specific (code, writing, comms)
├── archive/           # COLD: decayed patterns
└── corrections.md     # Last 50 corrections log
```

## Quick Reference

| Topic | File |
|-------|------|
| Setup guide | `setup.md` |
| Heartbeat state template | `heartbeat-state.md` |
| Memory template | `memory-template.md` |
| Workspace heartbeat snippet | `HEARTBEAT.md` |
| Heartbeat rules | `heartbeat-rules.md` |
| Learning mechanics | `learning.md` |
| Security boundaries | `boundaries.md` |
| Scaling rules | `scaling.md` |
| Memory operations | `operations.md` |
| Self-reflection log | `reflections.md` |
| OpenClaw HEARTBEAT seed | `openclaw-heartbeat.md` |

## Detection Triggers

Log automatically when you notice these patterns:

**Corrections** → add to `corrections.md`, evaluate for `memory.md`:
- "No, that's not right..."
- "Actually, it should be..."
- "You're wrong about..."
- "I prefer X, not Y"
- "Remember that I always..."
- "I told you before..."
- "Stop doing X"
- "Why do you keep..."

**Preference signals** → add to `memory.md` if explicit:
- "I like when you..."
- "Always do X for me"
- "Never do Y"
- "My style is..."
- "For [project], use..."

**Pattern candidates** → track, promote after 3x:
- Same instruction repeated 3+ times
- Workflow that works well repeatedly
- User praises specific approach

**Ignore** (don't log):
- One-time instructions ("do X now")
- Context-specific ("in this file...")
- Hypotheticals ("what if...")

## Self-Reflection

After completing significant work, pause and evaluate:

1. **Did it meet expectations?** — Compare outcome vs intent
2. **What could be better?** — Identify improvements for next time
3. **Is this a pattern?** — If yes, log to `corrections.md`

**When to self-reflect:**
- After completing a multi-step task
- After receiving feedback (positive or negative)
- After fixing a bug or mistake
- When you notice your output could be better

**Log format:**
```
CONTEXT: [type of task]
REFLECTION: [what I noticed]
LESSON: [what to do differently]
```

**Example:**
```
CONTEXT: Building Flutter UI
REFLECTION: Spacing looked off, had to redo
LESSON: Check visual spacing before showing user
```

Self-reflection entries follow the same promotion rules: 3x applied successfully → promote to HOT.

## Quick Queries

| User says | Action |
|-----------|--------|
| "What do you know about X?" | Search all tiers for X |
| "What have you learned?" | Show last 10 from `corrections.md` |
| "Show my patterns" | List `memory.md` (HOT) |
| "Show [project] patterns" | Load `projects/{name}.md` |
| "What's in warm storage?" | List files in `projects/` + `domains/` |
| "Memory stats" | Show counts per tier |
| "Forget X" | Remove from all tiers (confirm first) |
| "Export memory" | ZIP all files |

## Memory Stats

On "memory stats" request, report:

```
📊 Self-Improving Memory

HOT (always loaded):
  memory.md: X entries

WARM (load on demand):
  projects/: X files
  domains/: X files

COLD (archived):
  archive/: X files

Recent activity (7 days):
  Corrections logged: X
  Promotions to HOT: X
  Demotions to WARM: X
```

## Core Rules

### 1. 关键操作前确认 (检查点)

**必须确认的操作：**
- `Forget X` → 确认: "确认要从所有层删除 X？"
- 3x pattern → 确认: "这个规则要固化到 HOT 层？"
- 压缩 memory.md → 确认: "HOT 层超出100行，压缩吗？"
- 删除/重写文件 → 确认

### 2. Learn from Corrections and Self-Reflection
- Log when user explicitly corrects you
- Log when you identify improvements in your own work
- Never infer from silence alone
- After 3 identical lessons → ask to confirm as rule

### 3. Tiered Storage
| Tier | Location | Size Limit | Behavior |
|------|----------|------------|----------|
| HOT | memory.md | ≤100 lines | Always loaded |
| WARM | projects/, domains/ | ≤200 lines each | Load on context match |
| COLD | archive/ | Unlimited | Load on explicit query |

### 4. Automatic Promotion/Demotion
- Pattern used 3x in 7 days → promote to HOT
- Pattern unused 30 days → demote to WARM
- Pattern unused 90 days → archive to COLD
- Never delete without asking

### 5. Namespace Isolation
- Project patterns stay in `projects/{name}.md`
- Global preferences in HOT tier (memory.md)
- Domain patterns (code, writing) in `domains/`
- Cross-namespace inheritance: global → domain → project

### 6. Conflict Resolution
When patterns contradict:
1. Most specific wins (project > domain > global)
2. Most recent wins (same level)
3. If ambiguous → ask user

### 7. Compaction
When file exceeds limit:
1. Merge similar corrections into single rule
2. Archive unused patterns
3. Summarize verbose entries
4. Never lose confirmed preferences

### 8. Transparency
- Every action from memory → cite source: "Using X (from projects/foo.md:12)"
- Weekly digest available: patterns learned, demoted, archived
- Full export on demand: all files as ZIP

### 9. Security Boundaries
See `boundaries.md` — never store credentials, health data, third-party info.

### 10. Graceful Degradation
If context limit hit:
1. Load only memory.md (HOT)
2. Load relevant namespace on demand
3. Never fail silently — tell user what's not loaded

## Scope

This skill ONLY:
- Learns from user corrections and self-reflection
- Stores preferences in local files (`~/self-improving/`)
- Maintains heartbeat state in `~/self-improving/heartbeat-state.md` when the workspace integrates heartbeat
- Reads its own memory files on activation

This skill NEVER:
- Accesses calendar, email, or contacts
- Makes network requests
- Reads files outside `~/self-improving/`
- Infers preferences from silence or observation
- Deletes or blindly rewrites self-improving memory during heartbeat cleanup
- Modifies its own SKILL.md

## Related Skills
Install with `clawhub install <slug>` if user confirms:

- `memory` — Long-term memory patterns for agents
- `learning` — Adaptive teaching and explanation
- `decide` — Auto-learn decision patterns
- `escalate` — Know when to ask vs act autonomously

## Feedback

- If useful: `clawhub star self-improving`
- Stay updated: `clawhub sync`
