# 技术架构设计

## 整体架构

```
┌─────────────────────────────────────────────┐
│              浏览器（Browser）               │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ React   │  │ Tailwind │  │ Zustand   │  │
│  │ 组件层  │  │ 样式层   │  │ 状态管理  │  │
│  └────┬────┘  └──────────┘  └─────┬─────┘  │
│       │                           │         │
│       └───────────┬───────────────┘         │
│                   │ fetch / SSE              │
└───────────────────┼─────────────────────────┘
                    │
┌───────────────────┼─────────────────────────┐
│          Next.js API Routes                 │
│                   │                         │
│  ┌────────┐  ┌───┴───┐  ┌────────────┐     │
│  │ sites  │  │ health │  │ categories │     │
│  │ CRUD   │  │ check  │  │ 管理       │     │
│  └───┬────┘  └───┬───┘  └─────┬──────┘     │
│      │           │            │             │
│      └───────────┼────────────┘             │
│                  │                          │
│         ┌────────┴────────┐                 │
│         │   Prisma ORM    │                 │
│         └────────┬────────┘                 │
└──────────────────┼──────────────────────────┘
                   │
┌──────────────────┼──────────────────────────┐
│         PostgreSQL 数据库                    │
│         192.168.40.2:5432                    │
│         (Vercel 部署时切换公网数据库)         │
└─────────────────────────────────────────────┘
```

## 技术选型

| 层级 | 技术 | 选型理由 |
|------|------|----------|
| 框架 | Next.js 14+ (App Router) | 全栈框架，API Routes 内置，SSR/SSG 灵活，生态成熟 |
| 语言 | TypeScript | 类型安全，减少运行时错误，提升开发体验 |
| UI 样式 | Tailwind CSS | 原子化 CSS，快速构建一致 UI，暗色模式原生支持 |
| 状态管理 | Zustand | 轻量、简洁、TypeScript 友好，无 boilerplate |
| 数据库 | PostgreSQL | 企业级关系数据库，Vercel 部署友好，支持并发读写 |
| ORM | Prisma | 类型安全的数据库操作，自动迁移，开发体验优秀 |
| 拖拽 | @dnd-kit/core | 现代 React 拖拽库，无障碍友好，性能好 |
| 图标 | Lucide React | 轻量、风格统一、开源免费 |
| 请求 | 原生 fetch + SWR | 缓存、重试、去重，适合数据查询场景 |
| 健康检测 | node-fetch (API Route) | 服务端定时检测站点可达性 |

## 目录结构

```
site-manager/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局（主题、字体、全局样式）
│   │   ├── page.tsx                # 主页面
│   │   ├── globals.css             # 全局 CSS + Tailwind 指令
│   │   └── api/
│   │       ├── sites/
│   │       │   ├── route.ts        # GET（列表）、POST（新增）
│   │       │   └── [id]/
│   │       │       └── route.ts    # GET（详情）、PUT（更新）、DELETE（删除）
│   │       ├── categories/
│   │       │   └── route.ts        # 分类 CRUD
│   │       ├── health/
│   │       │   └── route.ts        # 健康检测
│   │       └── import-export/
│   │           └── route.ts        # 导入导出
│   ├── components/
│   │   ├── SiteCard.tsx            # 站点卡片
│   │   ├── SiteGrid.tsx            # 卡片网格容器
│   │   ├── SiteForm.tsx            # 新增/编辑表单（Modal）
│   │   ├── CategoryFilter.tsx      # 类型筛选栏
│   │   ├── SearchBar.tsx           # 搜索栏
│   │   ├── ThemeToggle.tsx         # 主题切换
│   │   ├── Header.tsx              # 顶部导航
│   │   ├── EmptyState.tsx          # 空状态占位
│   │   └── ConfirmDialog.tsx       # 确认弹窗
│   ├── stores/
│   │   └── site-store.ts           # Zustand 全局状态
│   ├── lib/
│   │   ├── db.ts                   # Prisma 客户端实例
│   │   ├── types.ts                # TypeScript 类型定义
│   │   └── utils.ts                # 工具函数
│   └── hooks/
│       └── use-sites.ts            # SWR 数据请求 hook
├── prisma/
│   ├── schema.prisma               # 数据模型定义
│   └── seed.ts                     # 种子数据
├── .env                            # 数据库连接等环境变量（gitignore）
├── .env.example                    # 环境变量示例
├── public/                         # 静态资源
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## API 设计

### 站点管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/sites` | 获取站点列表（支持 `?category=&search=` 筛选） |
| POST | `/api/sites` | 新增站点 |
| GET | `/api/sites/[id]` | 获取站点详情 |
| PUT | `/api/sites/[id]` | 更新站点 |
| DELETE | `/api/sites/[id]` | 删除站点 |
| PATCH | `/api/sites/[id]/order` | 更新排序 |

### 分类管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |
| POST | `/api/categories` | 新增分类 |
| PUT | `/api/categories/[id]` | 更新分类 |
| DELETE | `/api/categories/[id]` | 删除分类 |

### 其他

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/health/check` | 触发健康检测 |
| GET | `/api/health/status` | 获取健康状态 |
| GET | `/api/import-export?format=json` | 导出数据 |
| POST | `/api/import-export` | 导入数据 |

## 关键设计决策

### 为什么选 PostgreSQL？

- **Vercel 部署友好**：原生支持 Vercel Postgres / Neon / Supabase 等 Serverless PG
- **并发安全**：多实例 Serverless 场景下无锁问题
- **功能丰富**：全文搜索、JSON 字段、枚举类型等，后续扩展灵活
- **开发/生产一致**：本地用内网 PG，生产切公网 PG，Schema 完全兼容
- **连接配置**：通过 `DATABASE_URL` 环境变量切换，零代码改动

### 为什么选 Next.js App Router？

- 全栈能力：前后端统一框架，减少项目数量
- API Routes：无需单独的 Express/Fastify 服务
- 服务端组件：首屏可 SSR，SEO 友好（虽然本项目非必需）
- 部署灵活：支持 Node.js 运行或静态导出

### 为什么选 Zustand 而不是 Redux？

- API 简洁，几乎无 boilerplate
- 包体积小（~1KB）
- TypeScript 支持优秀
- 本项目状态复杂度不高，Redux 过重
