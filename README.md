# 杨CC 技能合集

面向 AI Agent 的开源技能库，按领域分类整理，统一遵循 `SKILL.md` 规范。

> 此项目出自于 [杨CC资源站](https://ycc77.cn) 网址：ycc77.cn

---

## 分类总览

| 一级分类 | 目录 | 包含方向 |
| --- | --- | --- |
| 国学占卜 | `divination/` | 综合占卜、四柱八字、紫微斗数、梅花易数 |
| 软件开发 | `software-dev/` | 代码规范、开发流程 |
| 电子取证 | `forensics/` | 内存取证、日志分析 |

---

## 技能清单

### 一、国学占卜 `divination/`

| 技能 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 综合占卜 | `divination/general/` | 待迁入 | 六爻、小六壬、择日、民俗多层规则库，附古籍原文库 |
| 四柱八字 | `divination/bazi/` | 规划中 | 子平法排盘、十神格局、大运流年 |
| 紫微斗数 | `divination/ziwei/` | 规划中 | 十二宫、四化飞星、星曜组合 |
| 梅花易数 | `divination/meihua/` | 待迁入 | 时间／数字／文字／外应四种起卦法，十八类占断 |

### 二、软件开发 `software-dev/`

| 技能 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 代码编写与重构规范 | `software-dev/code-spec/` | 待迁入 | 代码本体、文件目录、注释、接口命名、工程规范、安全防护六维 |
| 开发标准流程 | `software-dev/workflow/` | 待迁入 | 从需求沟通到最终交付的七步标准流程 |

### 三、电子取证 `forensics/`

| 技能 | 路径 | 状态 | 说明 |
| --- | --- | --- | --- |
| 内存取证 | `forensics/memory-forensics/` | 规划中 | 内存镜像获取、进程与网络痕迹提取、时间线还原 |
| 日志分析 | `forensics/log-analysis/` | 规划中 | Windows 事件日志、Linux 系统日志、应用日志排查 |

> 状态说明：`待迁入` 表示技能已存在、等待整理入库；`规划中` 表示目录已预留、内容待编写。

---

## 目录规范

一个具体技能对应一个目录，层级为 `分类／子类／技能`。技能目录内部结构：

```text
<分类>/<子类>/<技能目录>/
├── SKILL.md        # 必需。技能主文件，含 name、description 元信息
├── README.md       # 建议。面向人的使用说明
├── LICENSE         # 可选。与根目录授权不同时才需要
└── ...             # 脚本、规则库、原文库、模板等资源
```

约定三条：

1. 目录名一律使用英文短横线命名（kebab-case），不使用中文，避免 URL 编码与脚本引用问题；
2. 中文名称与释义统一写在各级 `README.md` 的对照表中；
3. 技能目录内必须有 `SKILL.md`，缺此文件视为未完成。

---

## 安装使用

克隆整个仓库：

```bash
git clone https://github.com/ycc77cn/skills.git
```

按需把技能目录复制到所用 AI 工具的技能目录：

| 工具 | 技能目录 |
| --- | --- |
| Trae | `~/.trae-cn/skills/` 或项目内 `.trae/skills/` |
| Claude Code | `~/.claude/skills/` 或项目内 `.claude/skills/` |

示例，取梅花易数：

```bash
cp -r skills/divination/meihua ~/.trae-cn/skills/meihua
```

---

## 许可

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE)。

各技能目录内若存在独立 `LICENSE`，以该文件为准。
