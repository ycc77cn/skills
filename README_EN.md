# YCC Skills Collection

An open-source skill library for AI agents, organized by domain and following the `SKILL.md` convention.

[简体中文](README.md) | **English**

> This project comes from [YCC Resource Site](https://ycc77.cn), website: ycc77.cn

---

## 1. Category Overview

| Category | Directory | Domain |
| --- | --- | --- |
| Chinese Divination | [`国学占卜/`](国学占卜/) | Traditional arts: fate calculation, divination, physiognomy, date selection, folklore |
| Software Development | [`软件开发/`](软件开发/) | Code standards, engineering workflow |
| Digital Forensics | [`电子取证/`](电子取证/) | Evidence preservation, extraction, analysis, reconstruction |
| Penetration Testing | [`渗透/`](渗透/) | Pentesting, vulnerability research, security assessment |

Categories serve for domain grouping only. There is no second-level taxonomy. Skill directories sit directly under a category, and the directory name states its own scope — for example `综合占卜-七层卜术`, which reads as "Comprehensive Divination — Seven Layers".

---

## 2. Skill List

### Chinese Divination

| Skill | Directory | Scope | Status |
| --- | --- | --- | --- |
| Comprehensive Divination | [`国学占卜/综合占卜-七层卜术/`](国学占卜/综合占卜-七层卜术/) | Seven layers: Destiny (Bazi), Affairs (Liuyao), Fortune (Xiao Liuren), Physiognomy (human and land), Timing (date selection), Strategy (Qimen and Da Liuren), Folklore (dream interpretation) | Pending import |
| Plum Blossom Numerology | [`国学占卜/梅花易数-四法十八类/`](国学占卜/梅花易数-四法十八类/) | Four casting methods: time, number, text, external omen; eighteen divination categories | Pending import |

### Software Development

No skills yet. New skills will be added as `name-scope` directories when content is ready.

### Digital Forensics

No skills yet. New skills will be added as `name-scope` directories when content is ready.

### Penetration Testing

No skills yet. New skills will be added as `name-scope` directories when content is ready.

> Status notes: `Pending import` means the skill exists and awaits packaging; `Planned` means content is not yet written.

---

## 3. The Skill Manifest: SKILL.md

**Every skill directory contains a `SKILL.md`, which is the complete system specification for that skill.**

This is the file an AI tool reads to recognize and operate a skill. It is more than metadata: it describes the entire system — what the skill does, how many layers or branches it has, what each layer covers, which rules drive the reasoning, which sources back it up, what it must refuse to do, and how results are presented.

A complete `SKILL.md` must cover the following:

| Item | Requirement |
| --- | --- |
| Name and trigger description | `name` and `description` in the YAML header; the description must let an AI decide accurately when to invoke the skill |
| Positioning and principles | One sentence on what the skill is, plus the inviolable ground rules |
| System and layers | Full list of internal branches, layers, and categories, with the problem each one solves and how deep it goes |
| Execution flow | Every step from receiving a request to producing output, including pre-checks and routing decisions |
| Rules and sources | Where judgments come from (rule base, source-text base, scripts) and which prevails on conflict |
| Output specification | Structure of the result, how terminology is explained, required disclaimers |
| Boundaries | What the skill refuses to do, how it responds when a request exceeds scope, and where the safety lines are |

`SKILL.md` and `README.md` serve different readers, and both are required:

| File | Reader | Focus |
| --- | --- | --- |
| `SKILL.md` | AI tools | Full system: layers, flow, rules, sources, boundaries, output |
| `README.md` | Humans | Quick orientation: purpose, scope, invocation, boundaries |

A skill without `SKILL.md` is not accepted. A `SKILL.md` too vague to support the whole system counts as incomplete.

---

## 4. Directory and Naming Conventions

### Structure

Two levels only: `category / skill directory`. No second-level taxonomy, so no empty nesting.

### Naming

1. Category names are Chinese domain terms, four characters or fewer, self-explanatory at a glance;
2. Skill directories follow the `name-scope` pattern, separated by a hyphen, where the suffix summarizes the branches or quantity the skill covers;
3. Directory names are Chinese throughout — no pinyin abbreviations, no English;
4. One skill equals one complete package, never split internally. Scope is expressed in the name suffix, in `SKILL.md`, and in the directory `README.md` — not by splitting directories.

Examples:

```text
国学占卜/综合占卜-七层卜术/     # not split into 命 / 卜 / 相 subdirectories
国学占卜/梅花易数-四法十八类/   # "four methods" = casting methods; "eighteen categories" = reading categories
```

### Internal layout of a skill directory

```text
<category>/<name-scope>/
├── SKILL.md        # Required. Full system specification; this is what the AI reads
├── README.md       # Required. Human-facing notes: purpose, scope, usage, boundaries
├── LICENSE         # Optional. Only when licensing differs from the repository root
└── ...             # Scripts, rule bases, source texts, templates, and other resources
```

---

## 5. Installation

Clone the whole repository:

```bash
git clone https://github.com/ycc77cn/skills.git
```

Copy the skill directory you need into your AI tool's skills folder:

| Tool | Skills folder |
| --- | --- |
| Trae | `~/.trae-cn/skills/` or `.trae/skills/` inside a project |
| Claude Code | `~/.claude/skills/` or `.claude/skills/` inside a project |

Example, installing Plum Blossom Numerology:

```bash
cp -r "skills/国学占卜/梅花易数-四法十八类" ~/.trae-cn/skills/meihua-yishu
```

Because skill directory names are in Chinese, always specify the destination name when copying so tools resolve them correctly.

---

## 6. Contributing

### 6.1 Adding a skill

1. Confirm `SKILL.md` is complete and describes the whole system, with a `description` that triggers accurately;
2. Create a `name-scope` directory under the proper category and place the whole package inside without splitting it;
3. Write the directory `README.md` covering purpose, scope, usage, and boundaries;
4. **Update all four READMEs as described in 6.2**;
5. Confirm no third-party copyrighted content and no paid-edition content is mixed in.

### 6.2 README Synchronization (Mandatory)

**A skill must be committed together with its README updates. Adding a skill first and fixing the docs later is not allowed; documentation must never lag behind the repository contents.**

For every skill added, all four locations below must be updated in the same commit:

| Location | What to update |
| --- | --- |
| `README.md` | Add a row to the Chinese skill list: name, directory link, scope, status |
| `README_EN.md` | Add the same row to the English list, matching the Chinese version item by item |
| `<category>/README.md` | Add a row to the category's "included skills" table and sync the status |
| `<skill directory>/README.md` | Fill in purpose, scope, invocation, and boundaries |

Check three things before committing:

1. Skill count, directory paths, and status labels must be identical across the Chinese and English lists;
2. When a status changes from `Pending import` to `Imported`, change all four places at once — never leave a stale status anywhere;
3. Run `git diff --stat` to self-check. A commit whose READMEs did not change accordingly is invalid and must not be pushed.

---

## 7. License

This project is released under the MIT License. See [LICENSE](LICENSE).

If a skill directory contains its own `LICENSE`, that file takes precedence.
