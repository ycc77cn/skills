---
name: nuxt-minimalist-design
description: 确保所有 Nuxt 代码遵循极简主义设计风格，包括高留白、黑白配色、高对比度阴影等。当需要创建或修改 Nuxt 页面时调用此技能。
---

# Nuxt 极简主义设计规范

## 技能目标

确保所有 Nuxt 项目中的页面和组件：
- 遵循极简主义设计原则
- 使用高留白、黑白配色方案
- 应用低对比度阴影和无衬线字体
- 禁止使用大角度圆角
- 保持层级分明的信息架构
- 保持每一个组件突出且明显

## 应用场景

当以下情况时，应调用此技能：
- 创建新的 Nuxt 页面或组件
- 修改现有 Nuxt 页面的设计风格
- 重构 Nuxt 项目的视觉效果
- 为 Nuxt 项目实现资源站或功能型页面

## 设计规范

### 1. 整体风格

- **极简主义**：减少视觉元素，突出核心功能
- **高留白**：适当增加元素间距，提高可读性
- **黑白配色**：主要使用白色背景，黑色文字，灰色作为辅助色
- **低对比度阴影**：使用轻微的阴影效果，增强层次感但不过分突出
- **无衬线字体**：使用系统默认无衬线字体或类似字体
- **层级分明**：通过字体大小、粗细和间距建立清晰的视觉层次

### 2. 页面结构

- **顶部导航栏**：简洁的横向导航，左侧可放置极简几何 Logo
- **超大搜索框**：页面核心功能，居中显示，大小适中
- **内容列表**：清晰的文字内容展示，适当的间距和对齐
- **信息层级**：标题 > 描述 > 元数据的清晰层次结构

### 3. 颜色规范

```css
/* 主要颜色 */
:root {
  --color-white: #ffffff;      /* 背景色 */
  --color-black: #000000;      /* 主文字色 */
  --color-gray-100: #fafafa;   /* 浅灰色背景 */
  --color-gray-200: #f5f5f5;   /* 次要背景 */
  --color-gray-300: #e8e8e8;   /* 边框和分割线 */
  --color-gray-400: #f0f0f0;   /* 辅助线 */
  --color-gray-500: #666666;   /* 次要文字 */
  --color-gray-600: #999999;   /* 辅助文字 */
  --shadow-light: 0 4px 12px rgba(0, 0, 0, 0.05);  /* 低对比度阴影 */
  --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.08);  /* 悬停阴影 */
}
```

### 4. 布局规范

- **响应式设计**：确保在不同设备上都能良好显示
- **网格系统**：使用一致的网格布局，保持元素对齐
- **间距规范**：建立统一的间距体系，如 8px、16px、24px、32px、48px、64px、80px
- **对齐方式**：左对齐为主，中心对齐用于标题和重要元素

### 5. 组件规范

#### 导航栏
- 高度：64px - 80px
- 背景：白色 (#ffffff)
- 边框：底部 1px 浅灰色边框 (#f0f0f0)
- 导航链接：15px 字体，间距 32px - 48px

#### 搜索框
- 高度：48px - 64px
- 宽度：根据页面宽度自适应，最大 800px
- 边框：2px 浅灰色边框 (#e8e8e8)
- 背景：浅灰色 (#fafafa)
- 占位符：灰色文字 (#999999)

#### 内容卡片
- 背景：浅灰色 (#fafafa)
- 内边距：24px - 32px
- 圆角：8px
- 阴影：轻微阴影效果
- 悬停效果：背景色变化或轻微上浮

#### 按钮
- 极简设计：无边框或细边框
- 颜色：黑色文字，白色背景或相反
- 悬停效果：轻微的背景色变化

## 禁止元素

- **复杂花纹**：避免使用任何装饰性花纹
- **插画和卡通元素**：不使用任何插画或卡通风格的元素
- **渐变色彩**：禁止使用颜色渐变效果
- **立体阴影**：避免使用明显的立体阴影效果
- **装饰性图标**：只使用功能必需的极简图标
- **多余动效**：减少不必要的动画效果
- **深色背景**：主要使用白色背景
- **杂乱布局**：保持整洁的网格布局
- **图片过多**：减少不必要的图片使用
- **艺术字体**：只使用无衬线字体
- **边框装饰**：避免使用装饰性边框

## 代码示例

### 完整的极简资源站页面

```vue
<!--
文件名称：极简资源站首页
文件描述：遵循极简主义设计风格的资源站首页，包含顶部导航、搜索框和内容列表
创建时间：YYYY-MM-DD
-->
<template>
  <div class="page-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="nav-container">
        <div class="logo">
          <div class="logo-shape"></div>
        </div>
        <nav class="nav">
          <a href="#" class="nav-link active">全部</a>
          <a href="#" class="nav-link">软件工具</a>
          <a href="#" class="nav-link">设计素材</a>
          <a href="#" class="nav-link">开发文档</a>
          <a href="#" class="nav-link">学习资源</a>
        </nav>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <!-- 搜索区域 -->
      <section class="search-section">
        <input 
          type="text" 
          class="search-input" 
          placeholder="搜索资源..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
      </section>

      <!-- 内容列表 -->
      <section class="content-list">
        <div 
          class="content-item" 
          v-for="(item, index) in resources" 
          :key="index"
          @click="navigateToResource(item.id)"
        >
          <h3 class="item-title">{{ item.title }}</h3>
          <p class="item-desc">{{ item.description }}</p>
          <div class="item-meta">
            <span class="item-tag">{{ item.category }}</span>
            <span class="item-date">{{ formatDate(item.createdAt) }}</span>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p class="copyright">版权 ©{{ new Date().getFullYear() }} 极简资源站</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/**
 * 搜索查询
 */
const searchQuery = ref('')

/**
 * 资源数据
 */
const resources = ref([
  {
    id: 1,
    title: 'VS Code 编辑器',
    description: '轻量级但功能强大的代码编辑器，支持多种编程语言',
    category: '软件工具',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Figma 设计工具',
    description: '基于浏览器的协作界面设计工具，支持实时协作',
    category: '设计素材',
    createdAt: '2024-01-14'
  }
])

/**
 * 处理搜索
 * @returns {void}
 */
const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
  // 搜索逻辑实现
}

/**
 * 导航到资源详情
 * @param {number} id - 资源ID
 * @returns {void}
 */
const navigateToResource = (id) => {
  console.log('导航到资源:', id)
  // 导航逻辑实现
}

/**
 * 格式化日期
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期
 */
const formatDate = (dateStr) => {
  return dateStr
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-black);
  background: var(--color-white);
}

/* 页面容器 */
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部导航 */
.header {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-400);
  padding: 0 40px;
  height: 72px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-shape {
  width: 32px;
  height: 32px;
  background: var(--color-black);
  border-radius: 4px;
}

.nav {
  display: flex;
  gap: 48px;
}

.nav-link {
  text-decoration: none;
  color: var(--color-gray-500);
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: var(--color-black);
}

.nav-link.active {
  color: var(--color-black);
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -26px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-black);
}

/* 主内容区 */
.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  width: 100%;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 64px;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 800px;
  height: 64px;
  padding: 0 32px;
  font-size: 18px;
  border: 2px solid var(--color-gray-300);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
  background: var(--color-gray-100);
}

.search-input:focus {
  border-color: var(--color-black);
  background: var(--color-white);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.search-input::placeholder {
  color: var(--color-gray-600);
}

/* 内容列表 */
.content-list {
  display: grid;
  gap: 16px;
}

.content-item {
  padding: 24px 32px;
  background: var(--color-gray-100);
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.content-item:hover {
  background: var(--color-gray-200);
  transform: translateY(-2px);
}

.item-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-black);
}

.item-desc {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--color-gray-500);
  line-height: 1.6;
}

.item-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.item-tag {
  padding: 4px 12px;
  background: var(--color-gray-300);
  font-size: 12px;
  color: var(--color-gray-500);
  border-radius: 4px;
}

.item-date {
  font-size: 12px;
  color: var(--color-gray-600);
}

/* 页脚 */
.footer {
  background: var(--color-white);
  border-top: 1px solid var(--color-gray-400);
  padding: 40px;
  margin-top: auto;
}

.copyright {
  text-align: center;
  font-size: 14px;
  color: var(--color-gray-600);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 24px;
    height: 64px;
  }

  .nav {
    gap: 24px;
  }

  .nav-link {
    font-size: 14px;
  }

  .nav-link.active::after {
    bottom: -20px;
  }

  .main {
    padding: 40px 24px;
  }

  .search-section {
    margin-bottom: 48px;
  }

  .search-input {
    height: 56px;
    padding: 0 24px;
    font-size: 16px;
  }

  .content-item {
    padding: 20px 24px;
  }
}
</style>
```

## 设计检查清单

使用此技能时，请确保：

- [ ] 遵循极简主义设计原则
- [ ] 使用高留白和适当的间距
- [ ] 采用黑白为主的配色方案
- [ ] 使用低对比度阴影效果
- [ ] 应用无衬线字体
- [ ] 建立清晰的信息层级
- [ ] 突出核心功能（如搜索框）
- [ ] 避免使用禁止的设计元素
- [ ] 确保响应式设计
- [ ] 保持界面干净整洁

## 最佳实践

- **功能优先**：设计应服务于功能，而非装饰
- **一致性**：保持整个项目设计风格的统一
- **可读性**：确保文字内容清晰易读
- **性能**：减少不必要的动画和效果，提高页面加载速度
- **用户体验**：简化操作流程，减少用户认知负担

## 常见问题

### Q: 如何在保持极简风格的同时确保功能完整？
A: 专注于核心功能，将次要功能适当隐藏或整合，通过清晰的导航和搜索功能引导用户。

### Q: 如何处理不同屏幕尺寸的适配？
A: 使用响应式设计，在小屏幕上适当调整布局，确保核心功能仍然易于使用。

### Q: 极简设计是否意味着缺乏个性？
A: 不是。通过精心的排版、间距和交互细节，可以在极简风格中展现独特的品牌个性。