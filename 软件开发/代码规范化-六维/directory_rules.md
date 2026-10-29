# 文件 & 目录规范

> 本文件是 code-refactor skill 的拆分规则文件，详细定义文件和目录规范。

---

## 一、目录分层标准

### 1.1 标准分层对照表

| 项目类型 | 标准分层 | 分层职责说明 |
|----------|----------|--------------|
| 后端 - Java Spring | `controller / service / service.impl / mapper / model / config / util / middleware / dto / vo / constant / exception` | controller(入口)→service(业务)→mapper(数据访问)→model(数据模型) |
| 后端 - Go | `cmd / internal / pkg / api / model / service / config / util / middleware` | cmd(启动入口)→internal(私有业务)→pkg(公共库)→api(接口) |
| 后端 - Python FastAPI | `routers / services / models / schemas / crud / core / utils / config / deps` | routers(路由)→services(业务)→crud(数据操作)→schemas(数据结构) |
| 前端 - Vue | `views / components / api / store / router / utils / assets / styles` | views(页面)→components(组件)→api(接口)→store(状态) |
| 前端 - React | `src/components / src/pages / src/api / src/hooks / src/store / src/utils / src/styles` | pages(页面)→components(组件)→hooks(自定义钩子)→store(状态) |

### 1.2 目录职责判定规则

| 目录 | 职责边界 | 判定依据 |
|------|----------|----------|
| controller / routers | 接口入口、参数校验、响应封装 | 是否直接处理 HTTP 请求/响应 |
| service | 业务逻辑编排、事务处理 | 是否包含核心业务流程 |
| model / schemas | 数据结构定义、字段约束 | 是否定义数据模型或校验规则 |
| mapper / crud | 数据库操作、SQL 执行 | 是否直接操作数据库 |
| util / utils | 通用工具函数、无业务依赖 | 是否可跨模块复用 |
| config | 配置读取、环境变量 | 是否处理配置文件 |
| middleware | 请求拦截、权限校验、日志 | 是否拦截 HTTP 请求 |
| dto | 请求参数传输对象 | 是否仅用于接口入参传递 |
| vo | 响应参数传输对象 | 是否仅用于接口出参传递 |

### 1.3 目录判定执行逻辑

**运行流程**：

```
Step 1: 扫描文件，读取文件内容
Step 2: 分析文件内容特征（关键词、函数签名、类定义）
Step 3: 匹配判定规则表，确定归属目录
Step 4: 如果文件包含多个目录特征，按职责拆分
Step 5: 输出目录调整对照表（原路径 → 新路径）
```

**文件内容特征判定规则**：

| 文件内容特征 | 判定归属目录 |
|--------------|--------------|
| 包含 `@RequestMapping`、`@GetMapping`、`router.get()` 等HTTP路由定义 | controller / routers |
| 包含 `@Service`、业务逻辑函数（事务处理、数据计算） | service |
| 包含 `@Entity`、`class User`、`BaseModel` 等数据结构定义 | model / schemas |
| 包含 `@Mapper`、`SELECT * FROM`、`db.query()` 等数据库操作 | mapper / crud |
| 包含 `@Util`、工具函数（时间格式化、字符串处理） | util / utils |
| 包含 `@Configuration`、环境变量读取、配置加载 | config |
| 包含 `@Middleware`、请求拦截、权限校验、日志记录 | middleware |

---

## 二、文件命名规范

### 2.1 命名风格对照表

| 语言 | 命名风格 | 示例 |
|------|----------|------|
| Python | 下划线 `snake_case` | `user_service.py` |
| Java | 类大驼峰、变量方法小驼峰 | `UserController.java`、`getUserById` |
| Go | 简单单词小写、复杂用小驼峰 | `main.go`、`userHandler.go` |
| TypeScript / JavaScript | 类大驼峰、变量函数小驼峰 | `UserApi.ts`、`userApi.ts` |
| C / C++ | 头文件下划线、实现文件下划线 | `user_service.h`、`user_service.cpp` |

---

## 三、文件功能划分与拆分规则

### 3.1 核心原则

**一个文件只做一件事，单一职责。**

### 3.2 文件大小限制

| 文件类型 | 最大行数 | 超过后的处理 |
|----------|----------|--------------|
| 业务逻辑文件（service / controller） | 500 行 | 按功能拆分为多个文件 |
| 工具函数文件（util / utils） | 300 行 | 按功能类别拆分 |
| 配置文件 | 100 行 | 按配置类别拆分到子目录 |
| 模型定义文件（model / schema） | 200 行 | 按实体拆分 |
| 测试文件 | 不限 | 按被测函数分组 |

### 3.3 文件拆分判定标准

#### 3.3.1 按功能拆分

一个文件包含多个不相关功能时，必须拆分。

- ✅ 正确：`user_service.py`（仅用户业务）、`order_service.py`（仅订单业务）
- ❌ 错误：`user_order_service.py`（混合用户和订单业务）

#### 3.3.2 按职责拆分

数据定义与业务逻辑必须分离。

- ✅ 正确：`user_model.py`（模型定义）、`user_service.py`（业务逻辑）
- ❌ 错误：`user.py`（混合模型和业务逻辑）

#### 3.3.3 按层级拆分

接口层与业务层必须分离。

- ✅ 正确：`user_controller.py`（接口）、`user_service.py`（业务）
- ❌ 错误：`user_api.py`（混合接口和业务）

#### 3.3.4 代码行数判定

超过限制必须拆分，拆分后的文件命名需体现具体功能。

- ✅ 正确：`user_registration.py`、`user_login.py`、`user_profile.py`
- ❌ 错误：`user_part1.py`、`user_part2.py`

### 3.4 文件合并判定标准

| 条件 | 是否合并 | 说明 |
|------|----------|------|
| 多个文件功能高度相关且总代码 < 200 行 | 建议合并 | 减少文件碎片化 |
| 工具函数散落在多个文件且功能相近 | 必须合并 | 统一到一个工具文件 |
| 模型定义分散在多个文件且属于同一业务领域 | 可以合并 | 便于维护 |

---

## 四、Import / Require 分层

### 4.1 三段式顺序

每组空一行分隔：

1. 系统内置包 / 标准库
2. 第三方依赖
3. 本地业务文件（用相对路径）

### 4.2 附加要求

- 同组内按字母顺序排列
- 删除重复 import
- 删除未使用的 import

---

## 五、目录安全规范

### 5.1 安全规则表

| 规则 | 说明 | 违反后果 |
|------|------|----------|
| 禁止在 web 根目录存放敏感文件 | `.env`、`config.ini`、密钥文件必须放在非公开目录 | 敏感信息泄露 |
| 配置文件必须按环境分离 | `config/dev`、`config/prod`、`config/test` | 生产配置误用于测试 |
| 禁止硬编码敏感信息 | 密码、密钥、Token 必须通过环境变量或配置文件注入 | 敏感信息泄露 |
| 日志文件必须存放在独立目录 | `logs/` 目录，禁止与源码混放 | 日志污染源码目录 |

---

## 六、混合文件处理逻辑

### 6.1 混合文件拆分处理

| 情况 | 处理方式 | 示例 |
|------|----------|------|
| 文件同时包含HTTP路由和业务逻辑 | 拆分为controller和service | `user_api.py` → `user_controller.py` + `user_service.py` |
| 文件同时包含数据模型和业务逻辑 | 拆分为model和service | `user.py` → `user_model.py` + `user_service.py` |
| 文件同时包含数据库操作和业务逻辑 | 拆分为mapper/crud和service | `user_db.py` → `user_mapper.py` + `user_service.py` |

### 6.2 零散文件归类逻辑

| 零散文件类型 | 归类规则 |
|--------------|----------|
| 单个工具函数文件 | 合并到 `utils/common_utils.py` |
| 单个数据模型文件 | 合并到 `models/base_model.py` |
| 单个配置文件 | 归类到 `config/` |
| 单个中间件文件 | 归类到 `middleware/` |