# 田螺姑娘 · Nomiluo

> 你的生活 AI 管家——默默付出，懂你，把你想做的事提前做了。

## 项目结构

```
nomiluo/
├── app/
│   ├── page.tsx              # 落地页（暖色系，邮件收集）
│   ├── page.module.css
│   ├── chat/page.tsx         # 对话界面（流式输出）
│   ├── chat/chat.module.css
│   ├── api/
│   │   ├── chat/route.ts     # 流式对话 API（接 OpenRouter）
│   │   ├── daily-brief/route.ts  # 每日简报（Vercel Cron）
│   │   └── waitlist/route.ts # 候补名单收集
│   ├── lib/supabase.ts       # 数据库客户端
│   ├── layout.tsx
│   └── globals.css           # 暖褐色系 CSS 变量
├── vercel.json               # Cron 配置（每天 UTC 00:00）
├── package.json
└── README.md
```

## 本地启动

```bash
npm install
cp .env.example .env.local   # 填写环境变量
npm run dev
```

## 环境变量

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenRouter
OPENROUTER_API_KEY=

# Vercel Cron 安全密钥（自己设一个随机字符串）
CRON_SECRET=
```

## Supabase 建表 SQL

```sql
-- 候补名单
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- 用户表（后续扩展）
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  timezone text default 'Asia/Shanghai',
  preferences jsonb default '{}',
  daily_brief_enabled boolean default false,
  created_at timestamptz default now()
);

-- 每日简报记录
create table daily_briefs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  content text not null,
  generated_at timestamptz default now()
);
```

## 部署到 Vercel

1. `vercel` 一键部署
2. 在 Vercel Dashboard 填写环境变量
3. Cron Job 会自动生效（每天 UTC 00:00 = 北京时间 08:00）

## 技术栈

- **框架**: Next.js 15 (App Router)
- **数据库**: Supabase
- **模型**: OpenRouter → claude-4.6-sonnet
- **部署**: Vercel（含 Cron Jobs）
- **域名**: nomiluo.com（Cloudflare DNS）
