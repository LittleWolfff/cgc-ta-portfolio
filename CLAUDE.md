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

## 模块换位必读 ⚠️ 踩坑记录

**改模块顺序最容易全面崩盘。** 不是改个编号就行——需要同时对齐三处：

| 要改的 | 在哪 | 注意事项 |
|--------|------|---------|
| HTML 区块物理顺序 | `index.html` 里 `<section id="xxx">` 的先后 | 必须和左栏顺序完全一致，否则滚动高亮会跳级 |
| 左栏导航 | `<aside class="sidebar">` 里 `href` 顺序 | 和 HTML 区块一一对应 |
| 背景交替 | 每个 `<section>` 的 class | `section`=暗底, `section section-alt`=亮底，交替排 |
| 区块编号 | `section-num` | 从 01 开始递增 |

**正确顺序（2026-08-10 定版）**：
```
01 关于(dark) → 02 作品(light) → 03 项目(dark) → 04 工作(light) → 05 技能(dark) → 06 联系(gradient)
```

**以后加新模块**：确定插在第几位 → 改 HTML 插入区块 → 改左栏插入一行 → 后面所有编号 +1 → 检查后面所有背景是否需要翻转（加/去 section-alt）。

**批量换位技巧**（模块太多手动搬容易出错）：
```bash
# 提取两个模块 → 交换位置 → 写回
sed -n 'A,Bp' index.html > /tmp/block1.txt  # 提取模块1
sed -n 'C,Dp' index.html > /tmp/block2.txt  # 提取模块2
# 重建：前半 + block2 + 中间缝隙 + block1 + 后半
(sed -n '1,Xp' index.html; cat /tmp/block2.txt; ...) > new.html
```

## 技术栈参考

- 基础模板：https://github.com/zqd12345/portfolio（暗色电影感单页）
- 布局改造：flexbox 左侧固定栏 + 右侧滚动区
- 滚动动画：IntersectionObserver（`js/main.js` 底部）
- 视频弹窗、图片灯箱：原生 JS，无依赖
