# 命名规范

> 本文件是 code-refactor skill 的拆分规则文件，详细定义命名规范。

---

## 一、命名风格对照表

| 对象 | 风格 | 示例 | 反例 |
|------|------|------|------|
| 变量 / 函数 / 方法 | 小驼峰 / 下划线（按语言） | `userName` / `user_name` | `usr`、`a`、`tmp_data` |
| 常量 | 全大写下划线 | `MAX_RETRY_COUNT` | `maxRetry`、`MAX` |
| 类 / 结构体 / 接口 | 大驼峰 | `UserInfo`、`OrderController` | `userInfoClass` |
| HTTP 接口名 | 动词 + 资源 | `getUserInfo`、`createOrder` | `doWork`、`handleData` |
| HTTP 路径 | 小写 + 横杠 | `/user/order-list` | `/User/OrderList`、`/getUser` |
| 数据库表 | 下划线 | `user_order` | `UserOrder` |
| 数据库字段 | 下划线 | `user_name` | `userName` |
| 布尔变量 | `is/has/can` 前缀 | `isVip`、`hasPermission` | `vip`、`permission` |

---

## 二、命名禁用清单

### 2.1 禁止拼音

- ❌ `user_info` 不可写成 `yonghu`
- ❌ `order_list` 不可写成 `dingdan`

### 2.2 禁止无意义缩写

- ❌ `btn` 不可写成 `b`
- ❌ `user` 不可写成 `u`
- ❌ `data` 不可写成 `d`

### 2.3 禁止单字母变量

- ❌ 禁止 `a`、`b`、`c`、`x`、`y`、`z`（循环变量 `i/j/k`、异常 `e` 除外）

### 2.4 禁止模糊命名

- ❌ `doWork`、`handleData`、`process`、`tmp`、`temp`
- ❌ `func1`、`func2`、`method1`、`method2`
- ❌ `data1`、`data2`、`result1`、`result2`

### 2.5 禁止混用风格

- ❌ 同一个项目不允许部分用驼峰、部分用下划线
- ❌ 同一个项目不允许部分用英文、部分用拼音

---

## 三、命名语义化规则

### 3.1 变量命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 计数器 | `count` + 被计数对象 | `userCount`、`orderCount` |
| 累加器 | `total` + 被累加对象 | `totalAmount`、`totalPrice` |
| 列表 | 对象名 + `List` 或 `s`（复数） | `userList`、`users` |
| 映射 | 对象名 + `Map` | `userMap`、`orderMap` |
| 状态 | 对象名 + `Status` 或 `State` | `orderStatus`、`paymentState` |
| 结果 | 对象名 + `Result` | `queryResult`、`calcResult` |

### 3.2 函数命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 获取 | `get` + 对象名 | `getUserInfo`、`getOrderList` |
| 创建 | `create` / `add` + 对象名 | `createOrder`、`addUser` |
| 更新 | `update` / `modify` + 对象名 | `updateUserInfo`、`modifyOrder` |
| 删除 | `delete` / `remove` + 对象名 | `deleteUser`、`removeOrder` |
| 查询 | `query` / `find` + 对象名 | `queryOrders`、`findUserById` |
| 计算 | `calc` / `compute` + 对象名 | `calcTotal`、`computeAverage` |
| 验证 | `validate` / `check` + 对象名 | `validateUser`、`checkOrder` |
| 处理 | `handle` / `process` + 对象名（需具体） | `handleLogin`、`processPayment` |

### 3.3 类命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 实体类 | 实体名（大驼峰） | `User`、`Order` |
| 服务类 | 实体名 + `Service` | `UserService`、`OrderService` |
| 控制器类 | 实体名 + `Controller` | `UserController`、`OrderController` |
| 工具类 | 功能名 + `Util` / `Utils` / `Helper` | `DateUtil`、`StringUtils`、`FileHelper` |
| 异常类 | 异常描述 + `Exception` / `Error` | `UserNotFoundException`、`ValidationError` |
| 配置类 | 功能名 + `Config` / `Configuration` | `DatabaseConfig`、`AppConfiguration` |

---

## 四、HTTP 接口命名规范

### 4.1 REST 风格命名

| 操作 | 命名格式 | 示例 |
|------|----------|------|
| 查询列表 | `get` + 实体名 + `List` | `getUserList` |
| 查询详情 | `get` + 实体名 + `ById` | `getUserById` |
| 创建 | `create` + 实体名 | `createUser` |
| 更新 | `update` + 实体名 + `ById` | `updateUserById` |
| 删除 | `delete` + 实体名 + `ById` | `deleteUserById` |

### 4.2 路径命名规范

| 规则 | 说明 | 示例 |
|------|------|------|
| 小写 | 全路径小写 | `/user/order-list` |
| 横杠分隔 | 多单词用横杠连接 | `/user/order-list` |
| 复数资源 | 资源名用复数 | `/users`、`/orders` |
| 避免动词 | 路径不含动词（用HTTP方法表达） | `/users/{id}`（正确）、`/get-users`（错误） |

---

## 五、数据库命名规范

### 5.1 表命名

| 规则 | 说明 | 示例 |
|------|------|------|
| 下划线命名 | 多单词用下划线连接 | `user_order` |
| 小写 | 全表名小写 | `user_order`（正确）、`UserOrder`（错误） |
| 业务前缀 | 可加业务前缀 | `sys_user`、`biz_order` |
| 避免冗余 | 表名不含 `table` 后缀 | `user`（正确）、`user_table`（错误） |

### 5.2 字段命名

| 规则 | 说明 | 示例 |
|------|------|------|
| 下划线命名 | 多单词用下划线连接 | `user_name` |
| 小写 | 全字段名小写 | `user_name`（正确）、`userName`（错误） |
| 避免冗余 | 字段名不含表名前缀（在表中已明确） | `name`（正确）、`user_name`（错误，在user表中） |
| 主键 | `id` 或 `表名_id` | `id`、`user_id` |
| 外键 | `关联表名_id` | `order_id`、`user_id` |

---

## 六、命名替换执行逻辑

### 6.1 替换流程

```
Step 1: 扫描代码，记录所有变量、函数、类、接口、表、字段命名
Step 2: 分析命名是否符合规范（风格、语义、禁用清单）
Step 3: 根据规范生成新命名（旧名 → 新名）
Step 4: 记录替换对照表（位置、影响范围）
Step 5: 全项目替换（变量、函数调用、注释、文档）
Step 6: 输出命名替换对照表
```

### 6.2 替换影响范围分析

| 命名类型 | 影响范围 |
|----------|----------|
| 变量 | 函数内部、调用位置 |
| 函数 | 调用位置、文档注释、测试文件 |
| 类 | 实例化位置、继承位置、文档注释 |
| HTTP接口 | 前端调用、文档、测试 |
| 数据库表 | SQL语句、ORM映射、文档 |
| 数据库字段 | SQL语句、ORM映射、文档 |