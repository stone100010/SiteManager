# 开发计划与里程碑

## 阶段划分

### Phase 1 — 基础框架与核心功能

**目标**：可用的最小产品，支持站点增删改查与分类筛选

| 任务 | 描述 |
|------|------|
| 项目初始化 | Next.js + TypeScript + Tailwind + Prisma 搭建 |
| 数据库建表 | Prisma Schema + 迁移 + 种子数据 |
| API 开发 | 站点 CRUD + 分类 CRUD 接口 |
| SiteCard 组件 | 卡片 UI、悬浮效果、状态灯 |
| SiteGrid 组件 | 响应式网格布局 |
| CategoryFilter 组件 | 类型筛选栏 |
| SiteForm 组件 | 新增/编辑模态框 |
| SearchBar 组件 | 搜索栏 + Cmd/Ctrl+K |
| Header 组件 | 导航栏 + 主题切换 |
| ConfirmDialog 组件 | 删除确认弹窗 |
| 暗色模式 | Tailwind dark mode 适配 |

**交付物**：可独立运行的 Web 应用，支持完整的站点管理流程

### Phase 2 — 体验增强

**目标**：提升使用体验，加入健康检测与拖拽排序

| 任务 | 描述 |
|------|------|
| 健康检测 | 后端定时检测站点可达性，卡片显示在线/离线状态 |
| 拖拽排序 | @dnd-kit 实现卡片拖拽调整顺序 |
| Favicon 抓取 | 新增站点时自动获取网站图标 |
| 导入导出 | JSON/CSV 格式批量导入导出 |
| 标签系统 | 多维度标签分类与筛选 |
| EmptyState | 空状态友好提示 |
| 键盘快捷键 | 快速搜索、ESC 关闭弹窗等 |

**交付物**：功能完整的站点管理面板

### Phase 3 — 高级特性

**目标**：锦上添花的高级功能

| 任务 | 描述 |
|------|------|
| 网站预览缩略图 | 卡片内嵌网站截图 |
| 点击统计 | 记录点击次数，支持按热度排序 |
| 多用户支持 | 简单账号体系，独立数据 |
| 分享功能 | 生成分享链接 |
| Docker 部署 | Dockerfile + docker-compose |

**交付物**：生产就绪的完整产品

## 技术风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| SQLite 并发写入 | 多用户场景下可能锁表 | 启用 WAL 模式，写操作排队 |
| Favicon 抓取失败 | 部分站点无 favicon | 提供默认图标回退 + 手动上传 |
| 健康检测误判 | 短暂超时导致误报 | 连续 3 次失败才标记离线 |
| 拖拽排序性能 | 大量卡片时卡顿 | 虚拟化列表（react-virtuoso） |

## 质量保障

| 维度 | 措施 |
|------|------|
| 代码规范 | ESLint + Prettier + TypeScript strict |
| 类型安全 | 全链路 TypeScript，API 请求有类型定义 |
| 组件测试 | 核心组件单元测试（Vitest + Testing Library） |
| API 测试 | 接口集成测试 |
| 视觉回归 | 关键页面截图对比 |
| 构建 | CI 中 `npm run build` 必须通过 |

## 技术栈版本

| 依赖 | 版本 |
|------|------|
| Next.js | 14+ |
| React | 18+ |
| TypeScript | 5+ |
| Tailwind CSS | 3.4+ |
| Prisma | 5+ |
| Zustand | 4+ |
| SWR | 2+ |
| @dnd-kit | 6+ |
| Lucide React | 最新 |