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
| Persona Design | [`角色设定/`](角色设定/) | First-person persona: install YangCC into an AI agent |
| Prompts | [`提示词/`](提示词/) | Copy-ready prompt texts, not organized as skills |

Categories serve for domain grouping only. Skill directories sit directly under a category, and the directory name states its own scope — for example `综合占卜-八层卜术`, which reads as "Comprehensive Divination — Eight Layers". The `提示词/` category is the exception and groups prompts by usage.

---

## 2. Skill List

### Chinese Divination

| Skill | Directory | Scope | Status |
| --- | --- | --- | --- |
| Comprehensive Divination | [`国学占卜/综合占卜-八层卜术/`](国学占卜/综合占卜-八层卜术/) | Eight layers: Destiny (Bazi with compatibility), Affairs (Liuyao), Fortune (Xiao Liuren), Physiognomy (human and land), Timing (date selection), Strategy (Qimen and Da Liuren), Mountains (talisman archive research), Folklore (dream interpretation) | Imported |
| Plum Blossom Numerology | [`国学占卜/梅花易数-四法十八类/`](国学占卜/梅花易数-四法十八类/) | Four casting methods: time, number, text, external omen; eighteen divination categories | Imported |

### Software Development

| Skill | Directory | Scope | Status |
| --- | --- | --- | --- |
| Code Standardization | [`软件开发/代码规范化-六维/`](软件开发/代码规范化-六维/) | Six dimensions: code body, files and directories, comments, interface naming, engineering conventions, security; refactor and authoring modes | Imported |
| Development Workflow | [`软件开发/开发标准流程-七步/`](软件开发/开发标准流程-七步/) | Seven steps: discuss first, back up, edit, launch both ends, browser test, white-box audit, item-by-item verification | Imported |
| Nuxt Chinese Comments | [`软件开发/Nuxt中文注释-函数级/`](软件开发/Nuxt中文注释-函数级/) | Four comment types: file header, function, code block, component | Imported |
| Nuxt Minimalist Design | [`软件开发/Nuxt极简设计-三要素/`](软件开发/Nuxt极简设计-三要素/) | Three elements: high whitespace, monochrome palette, high-contrast shadows, plus five detailed aspects | Imported |
| Code Backup | [`软件开发/代码备份-ZIP归档/`](软件开发/代码备份-ZIP归档/) | `beifen` directory, ZIP format, timestamp plus action naming, dependency and build exclusions | Imported |

### Digital Forensics

| Skill | Directory | Scope | Status |
| --- | --- | --- | --- |
| Tool Invocation Framework | [`电子取证/安全工具调用-框架底座/`](电子取证/安全工具调用-框架底座/) | Seven tool families: disk, memory, network, scanning, mobile, cracking, recovery; scheduling and audit trail | Imported |
| Data Acquisition | [`电子取证/数据采集-证据固定/`](电子取证/数据采集-证据固定/) | Imaging, hash verification, anomaly extraction, parallel acquisition, tamper monitoring | Imported |
| Storage File Forensics | [`电子取证/存储文件取证-磁盘分区/`](电子取证/存储文件取证-磁盘分区/) | Database files, spreadsheets, structured data, logs, backups, proprietary formats, metadata | Imported |
| Memory Forensics | [`电子取证/内存取证-易失数据/`](电子取证/内存取证-易失数据/) | Memory images, processes, network connections, credentials and keys, malicious code, system info | Imported |
| Mobile Device Forensics | [`电子取证/移动设备取证-安卓苹果/`](电子取证/移动设备取证-安卓苹果/) | Extraction tiers, iOS and Android paths, in-depth app analysis | Imported |
| Cloud Forensics | [`电子取证/云环境取证-云主机对象/`](电子取证/云环境取证-云主机对象/) | Cloud platform data, containers, service logs, SaaS, IAM, hybrid cloud | Imported |
| Database Forensics | [`电子取证/数据库取证-库表记录/`](电子取证/数据库取证-库表记录/) | Recovery, operation audit, tamper detection, security analysis, type differences, export | Imported |
| Network Traffic Forensics | [`电子取证/网络流量取证-协议还原/`](电子取证/网络流量取证-协议还原/) | Capture, protocol parsing, covert channels, session reconstruction, behavior analysis | Imported |
| Email Forensics | [`电子取证/电子邮件取证-客户端邮箱/`](电子取证/电子邮件取证-客户端邮箱/) | Header tracing, content, attachments, accounts, metadata, server logs | Imported |
| Blockchain Forensics | [`电子取证/区块链取证-链上资金/`](电子取证/区块链取证-链上资金/) | On-chain transactions, address clustering, fund tracing, contracts, cross-chain, threat intel | Imported |
| IoT Forensics | [`电子取证/IoT取证-物联网终端/`](电子取证/IoT取证-物联网终端/) | Smart home, vehicles, wearables, ICS, drones, firmware and protocols | Imported |
| Social Media Forensics | [`电子取证/社交媒体取证-账号内容/`](电子取证/社交媒体取证-账号内容/) | Domestic and international platforms, account tracing, propagation, illegal content, preservation | Imported |
| Multimedia Analysis | [`电子取证/多媒体分析-图像音频视频/`](电子取证/多媒体分析-图像音频视频/) | Image search, video structuring, forgery detection, audio analysis, metadata | Imported |
| Text and NLP Analysis | [`电子取证/文本分析-NLP挖掘/`](电子取证/文本分析-NLP挖掘/) | Semantic retrieval, relationship graphs, temporal behavior, cross-language, sentiment | Imported |
| Timeline Analysis | [`电子取证/时间线分析-行为还原/`](电子取证/时间线分析-行为还原/) | Multi-source time integration, timeline construction, behavior patterns, key events, timestamp validation | Imported |
| Data Recovery | [`电子取证/数据恢复-碎片重组/`](电子取证/数据恢复-碎片重组/) | Signature carving, fragment reassembly, database recovery, RAID rebuild, special cases | Imported |
| Data Cleaning | [`电子取证/数据清洗-取证数据/`](电子取证/数据清洗-取证数据/) | Deduplication, format normalization, outliers, missing values, quality scoring, masking | Imported |
| Anomaly Detection | [`电子取证/异常识别-模式比对/`](电子取证/异常识别-模式比对/) | Fund-chain analysis, network anomalies, clustering, association rules, risk scoring | Imported |
| Encryption and Password Cracking | [`电子取证/加密破解-密码密钥/`](电子取证/加密破解-密码密钥/) | Password recovery, file and disk encryption, OS passwords, hash identification, strength assessment | Imported |
| Malware Analysis | [`电子取证/恶意软件分析-样本行为/`](电子取证/恶意软件分析-样本行为/) | Sample profiling, static and dynamic analysis, family classification, attribution, threat intel | Imported |
| Anti-Forensics Detection | [`电子取证/反取证检测-痕迹对抗/`](电子取证/反取证检测-痕迹对抗/) | Wiping traces, data hiding, timestamp tampering, log clearing, rootkits, sandbox evasion | Imported |
| Sandbox Execution | [`电子取证/沙箱执行-隔离运行/`](电子取证/沙箱执行-隔离运行/) | Environment management, sample execution, behavior monitoring, operation validation, isolation | Imported |
| Environment Emulation | [`电子取证/环境仿真-运行还原/`](电子取证/环境仿真-运行还原/) | Disk image, database, mobile, and network emulation with consistency verification | Imported |
| Evidence Compliance | [`电子取证/证据合规-司法报告/`](电子取证/证据合规-司法报告/) | Process compliance, chain of custody, judicial report generation, visualization, courtroom support | Imported |
| File Organization | [`电子取证/文件整理-自动归类/`](电子取证/文件整理-自动归类/) | Naming rules, directory structure, classification standards, auto-organization, safeguards | Imported |

### Penetration Testing

| Skill | Directory | Scope | Status |
| --- | --- | --- | --- |
| SRC Vulnerability Research | [`渗透/SRC漏洞挖掘-全流程/`](渗透/SRC漏洞挖掘-全流程/) | Endpoint discovery, authorization and injection and logic flaw validation, WAF evasion, multi-stack white-box audit, Chinese SRC reports | Imported |
| Attack Log Analysis | [`渗透/攻击日志分析-入侵溯源/`](渗透/攻击日志分析-入侵溯源/) | Intrusion confirmation, attack chain reconstruction, deep log analysis, sample extraction, attribution | Imported |

### Persona Design

| Skill | Directory | Scope | Status |
| --- | --- | --- | --- |
| YangCC Persona | [`角色设定/杨CC性格-人设复刻/`](角色设定/杨CC性格-人设复刻/) | Ten personality traits, four layers of speech style, three interaction scenarios, five execution rules | Imported |

> This skill is authored by YangCC himself. Once installed, the AI speaks, judges, and delivers the way he does — in effect, YangCC is installed into the agent and does the work for you.

### Prompts

No prompts yet. This category uses `PROMPT.md` + `README.md` instead of `SKILL.md`; see [`提示词/README.md`](提示词/README.md).

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

**Single exception**: the `提示词/` category allows three levels, namely `提示词/<usage group>/<prompt directory>/`. Prompts are numerous and varied in purpose, so grouping by usage keeps things readable. Prompt directories use `PROMPT.md` + `README.md` instead of `SKILL.md`.

### Naming

1. Category names are Chinese domain terms, four characters or fewer, self-explanatory at a glance;
2. Skill directories follow the `name-scope` pattern, separated by a hyphen, where the suffix summarizes the branches or quantity the skill covers;
3. Directory names are Chinese throughout — no pinyin abbreviations, no English;
4. One skill equals one complete package, never split internally. Scope is expressed in the name suffix, in `SKILL.md`, and in the directory `README.md` — not by splitting directories.

Examples:

```text
国学占卜/综合占卜-八层卜术/     # not split into 命 / 卜 / 相 subdirectories
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

**Third-party content notice**: Some skills embed full third-party texts and knowledge bases, intended for study and research only. If you are a rights holder and believe any content infringes your rights, please contact the author (ycc77cn) via a repository Issue or the profile contact; the content will be removed promptly upon verification.
