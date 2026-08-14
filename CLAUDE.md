# TA 作品集网站 — 技术文档

> 📌 这个文档给未来的阿聪和未来的小辞看。新对话里读一遍就全懂。

## 部署信息

| 项目 | 值 |
|------|-----|
| 仓库 | https://github.com/LittleWolfff/cgc-ta-portfolio |
| 公网地址 | https://littlewolfff.github.io/cgc-ta-portfolio/ |
| 部署方式 | GitHub Pages（master 分支），push 即更新 |

## 双仓库工作流 ⚠️ 重要

这个 `portfolio-site/` 文件夹有**两套 Git**，互不干扰：

| 仓库 | 作用 | 连到哪 |
|------|------|--------|
| `portfolio-site/.git` | 作品集小仓库 → push 到 GitHub 部署 | `LittleWolfff/cgc-ta-portfolio` |
| `ClaudeCodeWorkspace/.git` | 工作区大仓库 → commit 到工蜂 | 工蜂 ugit 查看历史 |

**日常流程：**
1. 改网站文件 → 刷新浏览器看效果
2. 每次小改动：在 `ClaudeCodeWorkspace/` 根目录 `git commit`（工蜂留记录）
3. 阶段性大更新 / 阿聪主动说「推 GitHub」：在 `portfolio-site/` 里 `git add -A && git commit && git push`（部署到公网）

两个仓库独立，代码一样的。工蜂保留每次小改的记录，GitHub 只在关键节点更新——提交历史干净，但本地不丢任何记录。

## 架构：三文件，零依赖

```
portfolio-site/
├── index.html     ← 所有页面内容
├── css/style.css  ← 暗色主题 + 左栏布局
├── js/main.js     ← 作品数据 + 交互逻辑
└── assets/        ← 图片、视频丢这里
    ├── images/
    └── videos/
```

没有框架、没有构建。本地打开 `index.html` 就能看效果，推 GitHub 就部署。

## 如何加作品（最常用操作）

打开 `js/main.js`，在 `WORKS` 数组里加一项。三种类型：

```javascript
// 本地视频
{id:"m1", type:"video", cat:"render",
 title:"作品标题", tag:"标签",
 file:"assets/videos/xxx.mp4", poster:"assets/images/xxx.webp",
 size:"约15MB · 1080P", desc:"描述文字"},

// B站视频（填 bvid 就行）
{id:"m2", type:"bilibili", cat:"render",
 title:"作品标题", tag:"标签",
 poster:"assets/images/xxx.webp",
 bvid:"BVxxxxxxxxxx", desc:"描述"},

// 截图 / Shader 节点图
{id:"m3", type:"image", cat:"shader",
 title:"截图标题", src:"assets/images/xxx.webp"},
```

分类（cat）可选：`char`（角色渲染）、`grass`（草渲染）、`water`（水渲染）、`vfx`（特效）、`render`（渲染）、`shader`（Shader）、`tool`（工具/管线）。

### 描述（desc）格式约定 ⚠️

描述用阿聪的口吻写：技术细节带「为什么」，可以有大白话比喻。**结构固定三段**：

```
背景：为什么做这个（动机/想了解什么）
流程：具体做了什么（技术点 + 为什么这么做）
收获：学到/搞懂了什么（带具体例子，别空话）
```

- `\n` 表示换行，代码里 `desc:"背景：...\n流程：...\n收获：..."` 会渲染成三行
- 标签「背景/流程/收获」会自动高亮成金色，开头词写对就生效
- 知乎流程笔记用 `{{link}}` 占位符内联到描述里（配 `link:"https://..."` 字段），会渲染成可点的「流程笔记」链接
- 默认「暂无描述信息」——阿聪没给内容时别乱编
- 别夸大，别用「真正」「彻底」这类过度肯定的词，平实描述就行
- 图片卡片也会渲染 desc（有 desc 显示 desc，没 desc 显示「点击图片查看大图」）

**放好素材 → 改 WORKS 数组 → 刷新浏览器 → 看到新作品。** 不用改 HTML。

## 加视频作品 SOP（全流程）

> 📁 作品源文件镜像：`W_项目/260810_求职/作品展示镜像/`（按分类建子文件夹，对应网站 02 作品展示各栏目）

### 第一步：PR 导出（照抄）

| 参数 | 值 |
|------|-----|
| 格式 | H.264（.mp4） |
| 编码模式 | VBR，2 次 |
| 分辨率 | 1920×1080（跟序列一致） |
| 帧率 | 跟源素材一致，别转换 |
| 目标码率 | **20 Mbps** |
| 最大码率 | **30 Mbps** |
| 音频 | AAC / 48kHz / 256kbps |
| 硬件加速 | 勾上（NVIDIA NVENC） |
| 最高渲染质量 | 勾上 |

> 20 Mbps → 约 **150 MB/分钟**。导出后 >50MB 用 ffmpeg CRF 18 压缩，≤50MB 直传。

### 第二步：判断是否需要压缩

| 视频大小 | 处理 |
|----------|------|
| **≤ 50 MB** | 不压，直接放进 `assets/videos/` |
| **> 50 MB** | ffmpeg CRF 18 压缩 |

### 第三步（可选）：ffmpeg CRF 18 压缩

PR 导出的视频放进 `作品展示镜像/{分类}/`，然后命令行压缩：

```bash
# 工具路径
FFMPEG="D:/Conley/ClaudeCodeWorkspace/C_工具/视频压缩/小丸工具箱/App/tools/ffmpeg.exe"

# 压缩命令（CRF 18 视觉无损，推荐默认）
"$FFMPEG" -i 原视频.mp4 -c:v libx264 -crf 18 -preset slower -c:a aac -b:a 256k 输出_crf18.mp4 -y
```

| 参数 | 含义 | 可选值 |
|------|------|--------|
| `-crf` | 画质，越小越清晰 | 18（无损）~ 23（高质量），默认 21 |
| `-preset` | 压缩速度 | slower（最优）/ slow / medium / fast |
| `-c:a aac -b:a 256k` | 音频编码 | 256k 够用 |

> 202 MB → 33 MB（实测，CRF 18 视觉无损），画质肉眼无差。GitHub 单文件 100 MB 以内尽管用 CRF 18。

### 第三步：放进网站

1. 压缩后的 mp4 复制到 `portfolio-site/assets/videos/`
2. 编辑 `js/main.js`，在 `WORKS` 数组添加/替换条目：
   ```javascript
   {id:"xx", type:"video", cat:"char",
    title:"作品标题", tag:"标签",
    file:"assets/videos/xxx.mp4", poster:"assets/images/xxx.webp",
    size:"约25MB · 1080P",
    desc:"暂无描述信息"},
   ```
3. `cat` 可选项：`char`（角色渲染）、`grass`（草渲染）、`render`（渲染）、`shader`（Shader）、`tool`（工具/管线）
4. 浏览器打开 `index.html` 验证

### GitHub 限制速查

| 阈值 | 行为 |
|------|------|
| 50 MB | Git push 警告，但能成功 |
| 100 MB | 🚫 硬限制，拒绝 push |
| 1 GB | 仓库总大小建议上限 |

### B站不可用（2026-08-11 确认）

B站「仅自己可见」无法生成分享链接，不能嵌入网站。结论：不走 B站。

## 如何改页面文字

直接改 `index.html`，每个区块有清晰的注释标记：
- Hero 区：名字、副标题
- 关于区：自我介绍
- 技能区：技能卡片
- 经历区：工作/项目经验
- 联系区：邮箱、微信

### 专业技能板块写法 ⚠️

**核心原则：形式对齐大厂 TA 招聘要求，写「泛技能点」，不举具体例子、不写细节。**

- 技能区 = 能力陈述（我能做什么），作品区 = 证据（我做过什么），两者不重复
- 措辞用招聘要求的泛表达：「熟悉实时渲染」「熟悉 PBR 流程」「了解图形学基础」，而不是「做过 LOD 分级」「落地过 GPU 草」这种具体
- 别堆名词、别重复、别吹大（「精通」「深耕」不用，用「熟练/了解/熟悉」）
- 别写 2D 动画师技能（如 Spine）—— TA 招聘不要求
- 别锁死具体方向（如「擅长卡通渲染」→ 显得只会 NPR，改「熟悉实时渲染与材质开发」这种通用能力）

**当前三大块结构**（2026-08 定版）：
```
01 渲染与 Shader     → Shader 编写 / 图形学基础 / 光照·PBR·后处理
02 引擎与资产        → Unity·UE / DCC 工具 / 资产流程
03 工具与协作        → Python·C# / 规范·文档·协作
```

**技能维度参考**（腾讯/网易 TA 招聘高频要求，改技能时对照）：
渲染 Shader、图形学基础、渲染管线、光照模型、PBR、后处理、性能优化、引擎 Unity/UE、DCC（Maya/Blender/Substance）、Python/C# 工具、跨岗协作、技术文档

**「先写后补」策略**：招聘要求里暂时没掌握但以后要会的，可以写「了解/熟悉」（泛），具体补课方向记在 `W_项目/260810_求职/CLAUDE.md` 的「技能补缺清单」——别写「精通」级别的、面试一问就露的（如 RenderDoc、Houdini、图形 API、GPU 架构）。

## 左栏导航

- HTML 在 `<aside class="sidebar">` 里
- CSS 搜索 `sidebar` 看所有相关样式
- 导航链接的 `href` 和内容区 `id` 对应（`#about` → `<section id="about">`）
- 小屏（<860px）自动隐藏左栏

## 区块编号

每个 section 的 `<p class="section-num">` 换数字就行。CSS 里 `.section-num` 控制样式（目前是巨大透明数字，不抢内容）。

## 主题颜色

在 `css/style.css` 顶部 `:root` 里改三个变量：
- `--bg`：背景色
- `--accent`：强调色（金色）
- `--text` / `--muted`：文字色

## 部署流程

```bash
cd portfolio-site
# 改完文件后...
git add -A && git commit -m "描述改了什么" && git push
# 等 1 分钟，刷新网站链接就看到更新
```

## 环境坑点 ⚠️

| 问题 | 原因 | 解法 |
|------|------|------|
| `python` 命令被 Claude Code 沙箱拦截 | Windows Apps 路径 `/c/Users/.../WindowsApps/python.exe` 被限制 | 用绝对路径 `D:\C_Software\Python\App\Python\python.exe` |
| `pip install python-docx` 失败 | Claude Code Bash 环境限制 | 用 Windows 自带的 `win32com.client`（Word COM）操作 docx，无需 pip |
| Word COM 文件路径有中文时 `Documents.Open()` 失败 | COM 的编码问题 | 先 `cp` 到无中文临时路径再操作；或用 Python 直接传绝对路径（本次成功） |

## docx 转 PDF（简历更新用）

```python
# 用 D:\C_Software\Python\App\Python\python.exe（不是 WindowsApps 那个）
import win32com.client
doc_path = r'简历的完整绝对路径.docx'
out_path = r'输出的完整绝对路径.pdf'
word = win32com.client.Dispatch('Word.Application')
word.Visible = False
word.DisplayAlerts = 0
doc = word.Documents.Open(doc_path)
doc.SaveAs(out_path, 17)  # 17 = wdFormatPDF
doc.Close()
word.Quit()
```

## docx 内容提取（读链接、读文字）

```python
# 直接解析 docx（本质是 zip 包），不需要 Word
import zipfile
z = zipfile.ZipFile(r'路径.docx')
# 找链接：读 word/_rels/document.xml.rels，搜 Target= 带 http 的
# 读正文：读 word/document.xml，解析 <w:t> 标签
```

## 工蜂 / GitHub 双推

- 工蜂：`ClaudeCodeWorkspace/` 大仓库，每次小改动都 commit
- GitHub：`portfolio-site/` 小仓库，阶段成果 push 部署
- 两个仓库独立，同时维护

## 加模块 / 换模块 必读 ⚠️ 踩坑记录

> 这是全站最容易崩的地方。改模块顺序不是改个编号就完事，**四处必须同步对齐**，漏一处就出问题。

### 四处同步点（一处都不能漏）

| # | 要改的 | 在哪 | 说明 |
|---|--------|------|------|
| 1 | HTML 区块 | `index.html` 里 `<section id="xxx">` | 物理顺序，一个 section 一个 id |
| 2 | 左栏导航 | `<aside class="sidebar">` 里的 `.sidebar-link` | 桌面端目录，`href` 和 section `id` 对应 |
| 3 | 汉堡菜单导航 | `<header class="nav">` 里的 `.nav-links a` | 移动端目录，**2026-08 新增，最容易漏** |
| 4 | 编号 + 背景 | `section-num` 数字 + section 的 class | 编号从 01 递增；背景交替 |

> ⚠️ **滚动高亮不用手动改**：`js/main.js` 的 `updateSidebar()` 动态抓 `section[id]` + 全量查 `a[href]`，加/删模块自动适配。前提是上面四处 `href`/`id` 对得上。

### 正确顺序（2026-08-14 定版）

```
01 关于(dark) → 02 作品(light) → 03 项目(dark) → 04 工作(light)
→ 05 技能(dark) → 06 游戏(light) → 07 联系(gradient)
```

背景规则：`section`=暗底(#0b0c10)、`section-alt`=亮底(#101219)、`section-contact`=暗底（联系专属，固定最后）。整体暗亮交替。

> ⚠️ **联系特例**：联系 section 原本是「亮→暗」渐变（顶部=亮底 #101219），要求它**前面的模块是暗底**，否则亮亮相连。加模块插在联系前时若导致联系前是亮底，就把联系背景改成纯暗 `var(--bg)`。

### 加新模块 SOP（照着走）

1. **定位置**：确定插在第几位（N），它前面模块的背景决定它是暗还是亮（交替）
2. **改 HTML**：在对应位置插入 `<section>`，写 `section-num`=N、`section-kicker`（英文）、`section-title`（中文）、内容区
3. **改左栏**：`sidebar` 里插一行 `.sidebar-link`，编号 N
4. **改汉堡**：`.nav-links` 里插一行，编号 N（⚠️ 别漏！漏了手机端点不到新模块）
5. **后面编号 +1**：N 之后的**三处**（section-num、sidebar、nav-links）所有编号都 +1
6. **检查背景**：新模块之后的每个 section 背景是否需要翻转（暗↔亮）
7. **改正确顺序表**：更新本节的「正确顺序」

### 换模块位置 SOP

跟加模块同理：先删旧位置（三处导航 + section），再插新位置，重排编号 + 翻转背景。**别只搬 section 不搬导航**，否则目录点击跳转错位。

### 批量换位技巧（模块多时手动搬易错）

```bash
# 提取两个模块 → 交换位置 → 写回
sed -n 'A,Bp' index.html > /tmp/block1.txt  # 提取模块1
sed -n 'C,Dp' index.html > /tmp/block2.txt  # 提取模块2
# 重建：前半 + block2 + 中间缝隙 + block1 + 后半
(sed -n '1,Xp' index.html; cat /tmp/block2.txt; ...) > new.html
```

### 历史踩坑

- 2026-08-14 加「游戏经历」模块：只改了 section + 左栏，差点漏了汉堡 `nav-links`——补上后总结出「四处同步」规则。
- 2026-08-14 联系背景撞色：游戏(亮底 #101219) 插到联系前，联系顶部也是 #101219，两个色块连成一片。解法：联系背景从渐变改成纯暗 `var(--bg)`。教训：**联系前一个模块必须是暗底**，否则撞色。

## 技术栈参考

- 基础模板：https://github.com/zqd12345/portfolio（暗色电影感单页）
- 布局改造：flexbox 左侧固定栏 + 右侧滚动区
- 滚动动画：IntersectionObserver（`js/main.js` 底部）
- 视频弹窗、图片灯箱：原生 JS，无依赖
