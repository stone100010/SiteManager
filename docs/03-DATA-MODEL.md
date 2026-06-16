# 数据模型设计

## 实体关系图

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│  categories  │       │      sites       │       │    tags      │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id    (PK)   │◄──────│ category_id (FK) │       │ id    (PK)   │
│ name         │       │ id    (PK)       │       │ name         │
│ icon         │       │ name             │       └──────┬───────┘
│ color        │       │ url              │              │
│ sort_order   │       │ description      │              │
│ created_at   │       │ icon_url         │              │
│ updated_at   │       │ status           │              │
└──────────────┘       │ sort_order       │              │
                       │ created_at       │              │
                       │ updated_at       │              │
                       └────────┬─────────┘              │
                                │                        │
                                │  site_tags (关联表)     │
                                │  ┌─────────────────┐   │
                                └──│ site_id  (FK)   │   │
                                   │ tag_id   (FK)   │◄──┘
                                   └─────────────────┘
```

## 表结构定义

### categories — 分类表

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| `id` | String | PK, cuid | 主键 |
| `name` | String | UNIQUE, NOT NULL | 分类名称 |
| `icon` | String | NOT NULL, default "folder" | 分类图标（Lucide 图标名） |
| `color` | String | NOT NULL, default "#6366f1" | 分类标识色（HEX） |
| `sort_order` | Int | NOT NULL, default 0 | 排序权重（越小越靠前） |
| `created_at` | DateTime | NOT NULL, default now() | 创建时间 |
| `updated_at` | DateTime | NOT NULL, updatedAt | 更新时间 |

**预设分类**：

| name | icon | color |
|------|------|-------|
| 开发工具 | code | #6366f1 |
| 文档中心 | book-open | #8b5cf6 |
| API 服务 | server | #06b6d4 |
| 监控面板 | activity | #f59e0b |
| 社交媒体 | share-2 | #ec4899 |
| 内部系统 | lock | #10b981 |
| 其他 | layout-grid | #6b7280 |

### sites — 站点表

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| `id` | String | PK, cuid | 主键 |
| `name` | String | NOT NULL | 站点名称 |
| `url` | String | NOT NULL | 站点地址 |
| `description` | String | 可选 | 站点描述 |
| `icon_url` | String | 可选 | Favicon URL |
| `category_id` | String | FK → categories.id | 所属分类 |
| `status` | Enum | NOT NULL, default "unknown" | 健康状态 |
| `sort_order` | Int | NOT NULL, default 0 | 排序权重 |
| `click_count` | Int | NOT NULL, default 0 | 点击次数 |
| `last_checked_at` | DateTime | 可选 | 最后检测时间 |
| `created_at` | DateTime | NOT NULL, default now() | 创建时间 |
| `updated_at` | DateTime | NOT NULL, updatedAt | 更新时间 |

**status 枚举值**：

| 值 | 含义 |
|----|------|
| `online` | 站点可达 |
| `offline` | 站点不可达 |
| `unknown` | 未检测 |

### tags — 标签表

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| `id` | String | PK, cuid | 主键 |
| `name` | String | UNIQUE, NOT NULL | 标签名称 |

### site_tags — 站点-标签关联表

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| `site_id` | String | FK → sites.id, ON DELETE CASCADE | 站点 ID |
| `tag_id` | String | FK → tags.id, ON DELETE CASCADE | 标签 ID |

**联合主键**：`(site_id, tag_id)`

## Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum SiteStatus {
  online
  offline
  unknown
}

model Category {
  id         String   @id @default(cuid())
  name       String   @unique
  icon       String   @default("folder")
  color      String   @default("#6366f1")
  sortOrder  Int      @default(0) @map("sort_order")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  sites      Site[]

  @@map("categories")
}

model Site {
  id            String     @id @default(cuid())
  name          String
  url           String
  description   String?
  iconUrl       String?    @map("icon_url")
  categoryId    String     @map("category_id")
  category      Category   @relation(fields: [categoryId], references: [id])
  status        SiteStatus @default(unknown)
  sortOrder     Int        @default(0) @map("sort_order")
  clickCount    Int        @default(0) @map("click_count")
  lastCheckedAt DateTime?  @map("last_checked_at")
  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")
  tags          SiteTag[]

  @@map("sites")
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  sites SiteTag[]

  @@map("tags")
}

model SiteTag {
  siteId String @map("site_id")
  tagId  String @map("tag_id")
  site   Site   @relation(fields: [siteId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([siteId, tagId])
  @@map("site_tags")
}
```

## 数据校验规则

| 字段 | 规则 |
|------|------|
| `name` | 非空，1-100 字符 |
| `url` | 非空，合法 URL 格式（https:// 或 http:// 开头） |
| `description` | 可选，最大 500 字符 |
| `category_id` | 非空，必须存在于 categories 表 |
| `tags` | 可选，每个标签 1-30 字符，单站点最多 10 个标签 |

## 数据迁移策略

- 使用 Prisma Migrate 管理数据库 schema 变更
- 首次启动自动执行迁移并填充种子数据（预设分类）
- 后续升级通过 `prisma migrate deploy` 执行增量迁移

## 数据库连接配置

通过 `.env` 文件配置 `DATABASE_URL`：

```bash
# 本地开发（内网 PostgreSQL）
DATABASE_URL="postgresql://openaigc:nestai123@192.168.40.2:5432/site-manager?schema=public"

# Vercel 生产环境（公网数据库，在 Vercel 控制台配置）
# DATABASE_URL="postgresql://user:pass@your-public-pg-host:5432/site-manager?schema=public"
```

开发流程：
1. 本地开发使用内网 PG（192.168.40.2）
2. 部署 Vercel 时，在 Vercel 项目设置中配置 `DATABASE_URL` 指向公网 PG
3. 代码无需任何修改，通过环境变量自动切换
