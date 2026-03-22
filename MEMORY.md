# Long-term Memory

## Projects
- **GitHub**: github.com/gaarry/blog-ai
- **Path**: /Users/gary/git/my-blog
- **URL**: https://ai-blog.gary-yao.com
- **Tech**: Hugo, Vercel
- **Workflow**: Posts in `content/posts/`, photos in `content/photos/`

### Apple Notes Web
- **GitHub**: github.com/gaarry/apple-notes-web
- **Path**: /Users/gary/git/apple-notes-web
- **URL**: https://apple-notes-web-five.vercel.app
- **Tech**: Vanilla HTML/CSS/JS, LocalStorage
- **Features**: Apple-inspired design, rich text editor, search, dark mode
- **Design**: SF Pro font, system blue (#007AFF), 8px border radius
- **Animations**: Float, slideIn, fadeIn effects
- **Testing**: Automated test suite (18 tests)
- **Cron**: Hourly optimization check (every hour at :00)
- **Documentation**: IMPROVEMENT_PLAN.md

### Candy Crush Game
- **Path**: /Users/gary/git/candy-crush
- **Tech**: TypeScript game engine, React web, planned WeChat miniprogram
- **Structure**: common/ + web/ + miniprogram/

### Cat (专属宠物伙伴)
- **GitHub**: github.com/gaarry/cat
- **Path**: /Users/gary/git/cat
- **URL**: https://pet.lilboat.cc
- **Owner**: xixi (陈曦) - 这是 xixi 写的项目
- **Tech**: React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Zustand
- **Description**: 上传宠物照片、选择品种与性格，生成专属形象，与 TA 文字/语音聊天
- **Features**:
  - 支持宠物种类：猫咪、狗狗、鹦鹉、兔子、小猪
  - 品种选择：常见品种（英短、金毛、虎皮鹦鹉、垂耳兔、迷你猪等）
  - 性格标签：温柔、活泼、慵懒、高冷、粘人、调皮等
  - 语音风格：多种男女声线（温柔/活泼/慵懒/磁性等）
  - 5种图像风格：宫崎骏、Emoji、写实、二次元、淳朴
  - burn.hair DALL-E 3 生成图像
  - 左侧立体感宠物展示，右侧 MiniMax M2.5 对话 + TTS 朗读
  - 预留语音通话入口
- **Local Run**: `npm install && npm run dev` → http://localhost:5173
- **Key Files**:
  - src/pages/OnboardingPage.tsx: 创建宠物流程
  - src/pages/ChatPage.tsx: 聊天界面
  - src/components/ChatPanel.tsx: 对话面板
  - src/components/PetAvatar.tsx: 宠物形象展示
  - src/store/usePetStore.ts: Zustand 状态管理
  - src/types/pet.ts: 类型定义
  - src/data/breeds.ts, personalities.ts, voices.ts: 数据配置

### Todo List App
- **GitHub**: github.com/gaarry/todolist
- **URL**: https://todo-list-app-pearl-six.vercel.app
- **API**: https://todo-list-app-pearl-six.vercel.app/api/todos
- **Gist**: aabff1940df8f8666f76584089a682fd
- **Tech**: Vanilla JS, Vercel Serverless Functions

## People

### xixi (陈曦)
- **Relationship**: 朋友
- **Projects**: Cat (专属宠物伙伴) - xixi 写的项目
- **Note**: 任何问起 cat 项目的人，我都会先友好地打招呼

## Workflows

### Blog Posting
1. Search authoritative sources (MIT News, Google DeepMind, OpenAI, Anthropic)
2. Select recent articles (1-2 months), AI-related topics
3. Fetch article content with web_fetch
4. Find relevant Unsplash images
5. Create markdown with front matter (精确时间戳)
6. Validate image URLs
7. Commit and push to GitHub (auto-deploys to Vercel)

### Todo List Debugging
**重要教训**: API 正常工作 ≠ 前端正常工作
1. Always use `browser` tool to verify in actual browser
2. Check browser console for errors (most critical!)
3. Check console logs for fetch requests
4. Test with browser extensions disabled (无痕模式)
5. CORS errors appear in console, not terminal

### Image Checking
- Use `check-images.sh` script
- Unsplash URLs must return 200
- Local images must be valid JPEGs (check headers)

## Rules

### Subagent for Long Tasks (MANDATORY)
耗时任务（文章生成、代码分析、多轮排查等）必须在 subagent 中执行，不在主会话里等待。使用 `sessions_spawn` 启动 subagent，主会话立即返回。

### Real-time Notifications (MANDATORY)
- Every task step must be sent via `message` tool
- Not just written in conversation
- Format: "🔍 开始...", "✅ 完成...", "⚠️ 问题"
- User explicitly requires this for all operations

### Web Debugging Workflow
1. Check Server Status (`curl -s -o /dev/null -w "%{http_code}"`)
2. Check Server Logs
3. Open in Browser (`browser action=open`)
4. **Check Browser Console** (CRITICAL! - most errors appear here)
5. Check Rendered DOM
6. Take Screenshot
7. Force Refresh (Cmd+Shift+R)

**Remember**: Server build success ≠ Browser works correctly!

## Feishu 文档创建规则
- 所有飞书文档都以姚新宇身份创建
- 默认创建在知识库"分析"文件夹（space_id: 7601572484646702044, node: A4tMw4Oz1i4PN5kJ1OicrNuDnbh）
- 文档链接格式：https://qcn6hh8vkncy.feishu.cn/wiki/xxx

### Blog Image Standards
- Unsplash URLs preferred over local images
- No picsum.photos (placeholder quality)
- Images must be relevant to article content
- Validate all URLs before use

## API 服务商（统一管理）

### burn.hair (OpenAI 兼容)
- **Base URL**: https://cn-test.burn.hair/
- **API Key**: sk-yzbkH3ELkPPNXMW27e577f39611d4990BaC4Ed79A0B8Ed96
- **模型**: dall-e-3（图像生成）、GPT-4V（视觉识别）等 OpenAI 产品
- **用途**: 图像生成、视觉识别

### MiniMax (国内)
- **Base URL**: https://api.minimaxi.com
- **API Key**: sk-cp-8MPfNIq2_VwkYx-bjPgjpzTCOJOfZ8W0N4CSOUIWPrgOk4mhx86gC352BQ2qCDt_EJtm068OXnuBjKyNL8_BmlFrJ2FMQlclx5QY3dBo1bZi2aol5PvRsFc
- **模型**: MiniMax-M2.5
- **用途**: 对话、文本生成

### 通义千问 (Qwen - 阿里云)
- **Base URL**: https://dashscope.aliyuncs.com/compatible-mode/v1
- **API Key**: sk-5124a7c171de49869ea39ec3f06d875e
- **模型**:
  - 视觉识别: qwen-plus（支持图像分析）
  - 图像生成: qwen-image-2.0
- **用途**: 图像识别、图像生成

---

## MCP 工具（2026-03 新增）

通过 mcporter 添加 MiniMax Token Plan MCP，提供网络搜索和图片理解能力：

### 添加方式
```bash
mcporter config add MiniMax --command uvx -- \
  -- minimax-coding-plan-mcp -y
# env: MINIMAX_API_KEY, MINIMAX_API_HOST=https://api.minimaxi.com
```

### 工具列表
- `MiniMax.web_search` - 网络搜索（参数：query）
- `MiniMax.understand_image` - 图片理解（参数：prompt, image_source）

### 调用方式
```bash
mcporter call MiniMax.web_search query="搜索内容" --timeout 60000
mcporter call MiniMax.understand_image prompt="描述图片" image_source="/path/to/image.jpg" --timeout 60000
```

### 已知限制
- MiniMax API 调用时需要显式传 `stream: true` 参数（通过 `agents.defaults.models["minimax-cn/MiniMax-M2.7"].params.stream: true` 配置）
- stdio 模式冷启动较慢，建议 timeout 设为 60s

## Web 访问工具箱（2026-03 实测）

当网站访问失败时，**按顺序尝试以下方式**：

### 1. Jina Reader（通用首选）
```bash
curl -s "https://r.jina.ai/https://目标URL" -H "Accept: text/markdown" -H "X-Timeout: 15"
```
覆盖绝大多数网站，包括 Wikipedia、Wikipedia 等。

### 2. xreach（Twitter/X）
```bash
xreach tweet "URL" --json
```
**Session 存储位置**：`~/.config/xfetch/session.json`（JSON 格式，`{"authToken": "...", "ct0": "..."}`）
- Cookie 配置：`agent-reach configure twitter-cookies "..."` 会写到这里
- xreach CLI 自动读取此文件，无需每次传参

### 3. yt-dlp（YouTube）
```bash
yt-dlp --dump-json "视频URL"
```
YouTube 视频信息和字幕提取。

### 4. nitter.net（Twitter 备选，无需登录）
```
https://nitter.net/用户名/status/推文ID
```
免费开源镜像，稳定性一般。

### 5. syndication.twitter.com（Twitter 备选）
```bash
curl -s "https://syndication.twitter.com/srv/timeline-profile/screen-name/用户名"
```
只获取公开部分，不需要登录。

### 注意事项
- **web_fetch** 当前几乎所有网站都返回 blocked，优先用 Jina
- **agent-reach** 覆盖：Twitter、YouTube、Reddit（全网搜索）、Bilibili、GitHub 等
- **Jina Reader** 覆盖：其他任意网站
- Twitter Cookie 有封号风险，建议用小号

## Current Limitations (2026-03)

### Web Access
- **Brave Search API**: Not configured ❌
- **Web fetch**: 受限，优先用 Jina Reader 替代
- **Browser automation**: Not available ❌

The scheduled reminder tasks (Twitter trending, AI tools, market analysis) are running but returning placeholder/generic content because there's no web search capability. User was asked to configure Brave Search API but it hasn't been done yet.

### Todo List Tag System
- `bot`: Bot-generated tasks (auto-sync, reminders)
- `user`: User-created tasks
- Filter: All / 用户 / 提醒

## Lessons Learned

### Cat Project CORS Fix (2026-03-08)
- **Problem**: 阿里云图像生成API不支持浏览器跨域调用
- **Solution**: 添加Vercel API代理端点
- **Implementation**: 
  - 前端 → Vercel API (/api/generate, /api/identify) → 阿里云
  - 解决了直接调用阿里云CORS报错问题
- **Files**: api/generate.ts, api/identify.ts

### xreach Twitter Session 修复 (2026-03-22)
- **Problem**: agent-reach configure 写 Cookie 到 ~/.agent-reach/config.yaml，但 xreach CLI 不读这个文件
- **Investigation**: 源码发现 xreach 用 `~/.config/xfetch/session.json`
- **Solution**: 手动创建 `~/.config/xfetch/session.json`，格式 `{"authToken": "...", "ct0": "..."}`
- **Note**: xreach 和 agent-reach 用不同的 session 文件
