# Site Manager — 网站地址管理面板

卡片式网站书签管理工具，支持分类筛选、搜索、暗色模式、健康检测。

## 技术栈

- **框架**：Next.js 16 (App Router) + TypeScript
- **样式**：Tailwind CSS 4
- **数据库**：PostgreSQL (Prisma ORM)
- **状态管理**：Zustand + SWR
- **图标**：Lucide React

## 快速开始

```bash
# 安装依赖
pnpm install

# 配置数据库连接
cp .env.example .env
# 编辑 .env 中的 DATABASE_URL

# 推送数据库 schema + 种子数据
pnpm db:push
pnpm db:seed

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://user:pass@host:5432/site-manager?schema=public` |

## 功能

- 卡片式站点展示，响应式 4/3/2/1 列布局
- 按类型分类筛选（开发工具、文档中心、API 服务等）
- 关键词搜索（名称/地址/标签）
- 新增、编辑、删除站点
- 自定义标签系统
- 站点健康检测（在线/离线/未知）
- 暗色模式
- 导入导出（JSON/CSV）
- Favicon 自动获取
- Ctrl+K 快捷搜索

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/sites?category=&search=` | 站点列表（支持筛选） |
| POST | `/api/sites` | 新增站点 |
| GET | `/api/sites/[id]` | 站点详情 |
| PUT | `/api/sites/[id]` | 更新站点 |
| DELETE | `/api/sites/[id]` | 删除站点 |
| GET | `/api/categories` | 分类列表 |
| POST | `/api/categories` | 新增分类 |
| POST | `/api/health` | 健康检测 |
| GET | `/api/import-export?format=json` | 导出数据 |
| POST | `/api/import-export` | 导入数据 |

## 部署

### Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置 `DATABASE_URL` 环境变量指向公网 PostgreSQL
4. 部署完成后执行 `prisma migrate deploy` 同步 schema

### 自托管

```bash
pnpm build
pnpm start
```

## 项目结构

```
src/
├── app/
│   ├── layout.tsx, page.tsx
│   └── api/          # API 路由
├── components/       # UI 组件
│   ├── Header, CategoryFilter, SiteCard, SiteGrid
│   ├── SiteForm, ConfirmDialog
├── stores/           # Zustand 状态
├── hooks/            # SWR 数据 hooks
└── lib/              # 工具函数 + 类型 + Prisma 客户端
```