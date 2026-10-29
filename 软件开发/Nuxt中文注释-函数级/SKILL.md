---
name: "nuxt-chinese-comments"
description: "确保所有 Nuxt 代码使用中文注释，并在每个函数上方添加中文说明。当需要创建或修改 Nuxt 代码时调用此技能。"
---

# Nuxt 中文注释规范

## 技能目标

确保所有 Nuxt 项目中的代码：
- 使用中文注释
- 在每个函数上方添加中文说明
- 保持代码可读性和可维护性

## 应用场景

当以下情况时，应调用此技能：
- 创建新的 Nuxt 组件、页面或工具函数
- 修改现有 Nuxt 代码
- 重构 Nuxt 项目代码
- 为 Nuxt 项目添加新功能

## 注释规范

### 1. 文件头部注释

在每个文件顶部添加文件说明：

```vue
<!--
文件名称：组件/页面名称
文件描述：详细描述文件的功能和用途
创建时间：YYYY-MM-DD
-->
<template>
  <!-- 模板内容 -->
</template>
```

### 2. 函数注释

在每个函数上方添加详细的中文说明：

```javascript
/**
 * 函数名称：函数的具体名称
 * 功能描述：详细描述函数的功能
 * 参数：
 *   param1: 参数1的类型和说明
 *   param2: 参数2的类型和说明
 * 返回值：返回值的类型和说明
 * 示例：
 *   // 使用示例
 */
function exampleFunction(param1, param2) {
  // 函数实现
}
```

### 3. 代码块注释

对于复杂的代码块，添加中文注释说明：

```javascript
// 处理用户登录逻辑
if (userLoggedIn) {
  // 验证用户权限
  if (hasPermission) {
    // 执行授权操作
  }
}
```

### 4. 组件注释

在 Vue 组件中添加适当的注释：

```vue
<!-- 导航栏组件 -->
<nav class="nav">
  <!-- 左侧 Logo -->
  <div class="logo">...</div>
  <!-- 右侧导航链接 -->
  <div class="nav-links">...</div>
</nav>
```

## 示例

### 完整的 Nuxt 页面示例

```vue
<!--
文件名称：首页
文件描述：网站首页，包含导航栏、核心功能展示和页脚
创建时间：2024-01-29
-->
<template>
  <div class="page-container">
    <!-- 头部导航栏 -->
    <header class="header">
      <nav class="nav">
        <a href="#" class="nav-link active">首页</a>
        <a href="#" class="nav-link">服务</a>
        <a href="#" class="nav-link">案例</a>
        <a href="#" class="nav-link">联系</a>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <section class="hero">
        <h1 class="hero-title">核心功能</h1>
      </section>
    </main>
  </div>
</template>

<script setup>
/**
 * 响应式导航链接点击事件
 * @param {string} link - 链接地址
 * @returns {void}
 */
const handleNavClick = (link) => {
  // 处理导航链接点击
  console.log('点击导航链接:', link)
}
</script>

<style scoped>
/* 页面容器样式 */
.page-container {
  min-height: 100vh;
  background: #ffffff;
}

/* 头部导航样式 */
.header {
  background: #ffffff;
  border-bottom: 1px solid #f5f5f5;
}
</style>
```

## 检查清单

使用此技能时，请确保：

- [ ] 所有文件都有中文头部注释
- [ ] 所有函数都有中文函数说明
- [ ] 复杂代码块有中文注释
- [ ] 注释内容清晰、准确
- [ ] 注释与代码同步更新

## 最佳实践

- 注释应该解释 "为什么" 而不是 "是什么"
- 保持注释简洁明了，避免冗余
- 定期更新注释，确保与代码保持一致
- 使用中文标点符号，保持语言一致性
