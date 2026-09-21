# TA 作品集网站 — 技术文档

> 📌 这个文档给未来的阿聪和未来的小辞看。新对话里读一遍就全懂。

---

## 🟢 先看这里：这个网站是什么、怎么用

**一个网站、一份文件、两个出口。**

```
portfolio-site/index.html
   ├─ 双击它 ──────────────→ 本地预览（即时生效，不用等部署）← 阿聪平时看这个
   └─ git push origin master → 公网 https://littlewolfff.github.io/cgc-ta-portfolio/
```

| 你想干嘛 | 怎么做 |
|---------|--------|
| **看效果**（最快） | **双击 `portfolio-site/index.html`** + `Ctrl+Shift+R` 硬刷 |
| 改页面内容 | 改 `portfolio-site/index.html` |
| 加 / 改作品 | 改 `portfolio-site/js/main.js` 的 `WORKS` 数组 |
| 改样式 | 改 `portfolio-site/css/style.css`（⚠️ 同时升 `index.html` 里的 `?v=` 版本号） |
| **更新公网** | `git add -A && git commit && git push`（阿聪已持续授权），等 1-2 分钟部署 |

**🔴 三个最容易搞错的点**

1. **本地预览不需要复制文件、不需要同步脚本**——你双击的 `index.html` 本身就是源文件，push 的是同一份。所谓「本地版 / 公网版」是同一个文件的两个出口，不是两个网站
2. **`1、网站搭建/网站素材/个人网站/` 是 2026-06 的早期草稿**（1818 字节占位页，全是「待补充」），**已废弃**——别在那儿改东西，改了不影响实际网站
3. **本地改了忘 push = 公网停在旧版**（阿聪踩过这坑，所以现在以公网为最终真相）——改完确认没问题就 push，别攒着

**URL 里的 `#games`、`#works` 这些锚点**对应的模块见下方「如何改页面文字」。

---

## 部署信息

| 项目 | 值 |
|------|-----|
| 仓库 | https://github.com/LittleWolfff/cgc-ta-portfolio |
| 公网地址 | https://littlewolfff.github.io/cgc-ta-portfolio/ |
| 部署方式 | GitHub Pages（master 分支），push 即更新 |
| 视频托管 | 腾讯云 COS（视频走 COS，代码/图片走 GitHub Pages） |

### ⚠️ 缓存机制（「改完看不到」先读这里）

**网站有两层防缓存，缺一不可：**

| 层 | 机制 | 要不要手动管 |
|----|------|-------------|
| **html** | `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">` 等三个 meta | ✅ **已配好，不用管** |
| **js / css** | URL 加 `?v=日期` | ⚠️ **改代码时必须手动升** |

**改完 `js/main.js` 或 `css/style.css`，把 `index.html` 里这两行的版本号改掉**：

```html
<link rel="stylesheet" href="css/style.css?v=20260919f">
<script src="js/main.js?v=20260919f"></script>
```

用**当天日期**，同一天改多次就加字母后缀：`20260919a` → `b` → `c` → …

**为什么两层都要**（只做一个都会漏）：
- **只加版本号** → 浏览器仍缓存 **html**，html 引的旧版本号，链条没断
- **只加 meta** → html 每次是新的，但 **js 的 URL 没变** → 浏览器直接用缓存的旧 js

**2026-09-19 反复中招两次**：
1. 公网点「自练内容」显示「作品还在路上」——新 html（有 self 按钮）+ 旧 js（没 self 数据）
2. 改了「技术文档」的段落位置，公网已验证更新（版本号 f、顺序正确），但浏览器仍显示旧版——**html 被缓存，引的还是旧 js**

**排查流程（按顺序走）**：
1. **公网异常但本地正常** → 先怀疑缓存，别急着改代码
2. **无痕窗口验证** → 无痕正常 = **100% 是缓存问题**
3. **确认服务端**：`curl` 公网 js 查关键词 / 比对 md5，确认部署是否真完成
4. **解决**：让阿聪 `Ctrl+Shift+R` 硬刷新一次（两层机制配齐后，以后普通刷新即可）

### COS 视频托管 SOP ⚠️（为什么 + 怎么做，新对话照着走）

**为什么用 COS**：GitHub Pages 服务器在海外，视频文件大，国内访问卡（换流量/WiFi 都没用，物理距离决定）。代码和图片小，继续走 GitHub Pages；只有大视频走 COS。

**已有配置（2026-08 建桶，别重复建）**：

| 项 | 值 |
|----|-----|
| 存储桶名 | `cgc-portfolio-1466904848` |
| 地域 | 广州 `ap-guangzhou` |
| 访问权限 | 公有读私有写（关键，否则视频打不开） |
| 请求域名 | `cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com` |
| 控制台 | https://console.cloud.tencent.com/cos |

**COS 桶文件夹结构**（对齐镜像文件夹的两个大类，英文名避免 URL 中文编码。**视频+图片+简历都在 COS，统一管理**）：

```
works/        ← 作品展示
├── char/     角色渲染：unity-anon-char-render.mp4 + poster-anon.webp + ue-char-christina.webp
├── grass/    草渲染：unity-grass-render.mp4 + grass-quad.png
├── water/    水渲染：unity-water-render.mp4
├── vfx/      特效：unity-vfx-explosion.mp4
└── tool/     工具：blender-asset-tool.mp4
projects/     ← 项目经历
├── project-dream-maker.mp4 + poster-dream-maker.webp
├── project-amuse-ourselves.mp4
├── photon-training.webp + photon-training-full.webp
└── fuchenlu.webp + fuchenlu-full.webp
resume.pdf    ← 简历（原名「简历.pdf」，传 COS 改英文名避免 URL 中文编码）
```

> 代码（HTML/CSS/JS）仍走 GitHub Pages，只有**媒体资源（视频/图片/PDF）走 COS**。本地 `assets/` 里的源文件可删可留作备份。

**视频外链格式**：`https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/{大类}/{子类}/{文件名}.mp4`
例如：`.../works/char/unity-anon-char-render.mp4`

**加新视频到 COS 的完整流程**（小辞命令行操作，不用网页）：

1. **压缩**（网站视频统一压到 CRF 23，画质够 + 文件小）：
   ```bash
   FFMPEG="D:/Conley/ClaudeCodeWorkspace/C_工具/视频压缩/小丸工具箱/App/tools/ffmpeg.exe"
   "$FFMPEG" -i 原视频.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k 输出.mp4 -y
   ```
   ⚠️ 坑：个别视频（如自娱自乐，PR 高码率导出的）用 CRF 23 反而变大，得降到 CRF 26 重压。
2. **上传**（coscmd，密钥已配置在本地 `C:\Users\Serendipity\.cos.conf`）：
   ```bash
   COSCMD="D:/C_Software/Python/App/Python/Scripts/coscmd.exe"
   "$COSCMD" upload 本地文件.mp4 works/char/文件名.mp4
   ```
3. **改 src**：`js/main.js` 的 WORKS 数组或 `index.html` 项目卡，把视频链接换成 COS 外链
4. **删旧文件**：`"$COSCMD" delete -f 旧路径`（保持桶干净）
5. 本地视频文件可删（省 GitHub 体积）或保留备份

**coscmd 常用命令**：
```bash
coscmd list                              # 列出桶内文件
coscmd upload 本地路径 cos远端路径       # 上传
coscmd delete -f cos路径                 # 删除
coscmd config -a ID -s KEY -b 桶名 -r 地域   # 重新配置密钥
```

**建桶时的关键设置**（以后万一要新建桶照着填）：地域广州、访问权限「公有读私有写」、数据冗余单 AZ，其他（版本控制/加密/极智压缩/日志/内容安全/自定义域名）全部不开启。

**名词解释**（阿聪问过）：AZ = 可用区 = 一个独立机房；单 AZ = 数据存一个机房（便宜，个人够用），多 AZ = 存多个机房（贵，防机房故障）。

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

### ⚠️ 图片卡尺寸规范（2026-09-18 踩坑后定，务必先读）

**第一条规则：加新卡之前，先看同分类里已有的卡用的哪种模式 —— 新卡必须跟着用。**

两种模式，靠字段切换：

| 模式 | 字段 | 图宽 | 适用 |
|------|------|------|------|
| **默认（大图）** | `contain:true` | 卡片宽的 **58%**（约 645px） | 横图 |
| **竖图模式** | `portrait:true` | 卡片宽的 **28%**（约 311px） | 竖图 / 方图 |

**只在「该分类还没有任何图片卡」时**，才按图片形状判断：

- 横图（宽 > 高）→ `contain:true`
- 竖图 / 方图（高 ≥ 宽）→ `portrait:true`

**源图分辨率下限（硬性）**：

| 模式 | 源图宽下限 | 原因 |
|------|-----------|------|
| 默认（58%） | **≥ 800px** | 要显示到约 645px，低了会被放大发虚 |
| 竖图（28%） | **≥ 320px** | 要显示到约 311px |

**图片比例也要对齐**：同分类里已有卡的图是什么比例，新图就裁成什么比例，
否则宽度一样但高度对不上，看着还是不齐。裁剪命令：

```bash
FFMPEG="D:/Conley/ClaudeCodeWorkspace/C_工具/视频压缩/小丸工具箱/App/tools/ffmpeg.exe"
# crop=宽:高:起始x:起始y —— 只取左边就写 0:0
"$FFMPEG" -i 原图.png -vf "crop=278:201:0:0" -c:v libwebp -quality 92 输出.webp -y
```

**2026-09-18 的坑（返工两次）**：《UE》管线——角色管线卡我用了 `portrait:true`（28%），
而同分类的克雷斯蒂娜用的是默认 `contain`（58%），结果两张卡一大一小。
**根因就是没先看同分类已有的卡**——所以这条提到了最前面。

**放好素材 → 改 WORKS 数组 → 刷新浏览器 → 看到新作品。** 不用改 HTML。

### 项目卡（type:"project"）与多图轮播 ⚠️

项目卡是给「正式项目」用的大卡片（带日期 + 角色 + 技术文档链接），缩略图有**三种形态**，靠字段自动判断：

| 形态 | 触发字段 | 实例 |
|------|---------|------|
| **视频** | 有 `video` | 【Unity】《游戏造梦师》 |
| **单图** | 有 `src`、无 `multi` | 【UE】《浮沉录》 |
| **多图轮播** | `src` + `multi:true` + `fullImgs` + `thumbs` | 暂无（功能保留） |

**多图轮播写法**（以后要用照抄）：

```javascript
{id:"px", type:"project", cat:"xxx",
 title:"卡片标题", date:"2026.01 — 2026.12", role:"Unity / 3D美术",
 multi:true,                                              // ← 开多图
 thumbBg:"linear-gradient(135deg,#0f1a1a,#1a2d2d,#081212)",
 src:"https://.../封面.webp",                             // ← 缩略图显示这张
 fullImgs:"https://.../大图1.webp|https://.../大图2.webp",  // ← 灯箱大图，| 分隔
 thumbs:"https://.../缩略1.webp|https://.../缩略2.webp",    // ← 轮播缩略图，| 分隔
 icon:"📜", label:"角标文字",
 desc:"..."}
```

**效果**：缩略图左右出现 `‹ ›` 箭头，点击切换；点图开灯箱看大图。

**切回单图**：把 `multi` / `fullImgs` / `thumbs` 三个字段**删掉**即可，自动降级成单图形态。

**⚠️ 为什么动态生成的卡片也能点**：轮播和灯箱的事件都挂在 `document` 上（事件委托），不是绑在卡片元素上——所以 `render()` 每次重绘的卡片都能正常响应，**不需要重新绑定事件**。

> **历史**：《浮沉录》曾用多图（第二张图效果不好，2026-09-18 下线）。完整实现保留在 `cardHTML` 的 project 分支里，加回字段即可复用。

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

### 游戏经历板块写法 ⚠️

- **定位**：展示玩家身份/成分，让面试官知道你玩什么、玩多深，不是炫技
- **分类用通俗大类**：动作游戏 / 角色扮演 / 策略模拟 / 二次元手游——别用「魂类」「肉鸽」「ARPG」「类银河恶魔城」这种有争议或小众的词
- **排序**：时长高的排前面，没时长的排后面
- **描述用阿聪自己的口语，小辞只润色不通顺的地方**：保留「我觉得」「那种」「猜中的时候」这种活人感，别过度精简、别 AI 化（教训：曾把王者荣耀、星露谷描述压成书面语，被指「没有活人感」）

### 🔴 游戏经历每行的格式（2026-09-21 定，别再改回去）

**每行拆成「游戏时长」「游戏经历」两段**，标签用作品卡同款的 `.desc-label`（金色加粗）：

```html
<p class="game-desc"><span class="desc-label">游戏时长：</span>200h+<br><span class="desc-label">游戏经历：</span>弹刀节奏有固定规律，像音游一样爽快；短小精悍，换个 mod 又能打一周目</p>
```

- **为什么这么写**：多数厂（网易互娱 / 雷火 / 腾讯）的投递表单把「游戏时长」和「游玩程度/游戏经历」拆成**两个独立字段**。网站按同样结构写，填表时能**分段直接复制**
- 🔴 **时长写的是「表单档位」，不是精确时长**（只狼写 `200-500h`，**不是** `200h+`）——因为表单的时长是**下拉选择**，只能选档位；网站上直接写档位，填表时照抄，不用现场换算
  - **网游 / 手游 → 年份档**：`1年以内 / 1~2年 / 2年及以上`（王者荣耀 = 2年及以上、金铲铲 = 1~2年、洛克王国世界 = 1年以内）
  - **单机 → 小时档**：`50h以内 / 50-100h / 100-200h / 200-500h / 500h以上`
  - 22 个游戏的档位对照表在 `2、简历投递/投递管理/投递模板/游戏经历.md`（2026-09-21 已定稿）
- 网站**不再显示精确时长**（原来的 `200h+` 已被档位替代）——精确数据如需回溯，看 git 历史或上面的档位对照表
- 游戏经历是**静态 HTML**（不走 `js/main.js` 的 `formatDesc`），所以标签要手写在 HTML 里；作品卡的「背景/流程/收获」才走 JS 自动高亮
- ⚠️ **改这里别用「·」分隔**：旧版是 `200h+ · 描述`，分隔点号有 ` · `（前后空格）和 `）· `（前无空格）两种写法混用，批量处理时容易漏（2026-09-21 差点漏掉王者荣耀那行）

### 游戏封面图工作流 ⚠️（19个游戏已配齐，新游戏照做）

**图源选择（按优先级）**：
1. **Steam CDN**（单机游戏）— `https://cdn.cloudflare.steamstatic.com/steam/apps/{appid}/header.jpg`
   - appid 查法：Steam 商店页 URL 里的数字，或搜「游戏名 steam appid」
   - ⚠️ appid 错了会拿到别的游戏封面（教训：丝之歌用了 1091500 拿到赛博朋克，正确是 1030300）
2. **iTunes API**（手游）— 用**中文名**搜：`https://itunes.apple.com/search?term={URL编码的游戏名}&country=cn&entity=software`，取 `artworkUrl512`
   - ⚠️ 必须用中文名（金铲铲之战、洛克王国世界），英文名会搜到别的 app
3. **官网/图片站**（无 Steam 无 iOS，如塞尔达）— 找官方横版图，或让阿聪自己给图（最快）

**处理**（Steam 横版封面 → 140px 小图 + 大图；手游图标 → 96×96 方形）：
```bash
FFMPEG="D:/Conley/ClaudeCodeWorkspace/C_工具/视频压缩/小丸工具箱/App/tools/ffmpeg.exe"
# 横版封面：140px宽小图 + 原图大图
"$FFMPEG" -i 图.jpg -vf "scale=140:-1" -quality 85 名.webp -y
"$FFMPEG" -i 图.jpg -quality 90 名-full.webp -y
# 手游方形图标：96x96
"$FFMPEG" -i 图.jpg -vf "scale=96:96:force_original_aspect_ratio=increase,crop=96:96" -quality 85 名.webp -y
```

**上传 + 嵌入**：
```bash
COSCMD="D:/C_Software/Python/App/Python/Scripts/coscmd.exe"
"$COSCMD" upload 名.webp games/名.webp
"$COSCMD" upload 名-full.webp games/名-full.webp
```
```html
<!-- 单机游戏：横版封面 -->
<td class="game-name-cell"><img class="game-cover" src=".../games/名.webp" alt="游戏名" data-full-img=".../games/名-full.webp">游戏名</td>
<!-- 手游：方形图标加 game-cover-icon -->
<td class="game-name-cell"><img class="game-cover game-cover-icon" src=".../games/名.webp" alt="游戏名" data-full-img=".../games/名-full.webp">游戏名</td>
```

**布局**：封面图 `align-items:flex-start` 靠顶、保持 140×66 比例；手游图标 `game-cover-icon` 96×96 方形圆角。

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

> 🔴 **2026-09-21 阿聪定的节奏：先在本地 html 快速验证，攒一波再推公网。**
> 原因：push 一次要等 1-2 分钟 GitHub Pages 部署，改一点推一点纯属浪费时间。

**推荐节奏**（小辞默认按这个走）：

| 步骤 | 谁做 | 做什么 |
|------|------|--------|
| 1 | 小辞 | 改 `index.html` / `css` / `js`（⚠️ 改 css/js 必须升 `index.html` 里的 `?v=日期` 版本号） |
| 2 | 小辞 | `git commit`（本地留记录，**不 push**） |
| 3 | 阿聪 | **双击 `portfolio-site/index.html`** 快速看效果（改了几版就看几版，不用等部署） |
| 4 | — | 不满意 → 回步骤 1 继续改 |
| 5 | 阿聪说「推」或攒够一批 | `git push` → 1-2 分钟后公网生效 |

```bash
cd "D:/Conley/ClaudeCodeWorkspace/W_项目/260810_求职/1、网站搭建/portfolio-site"
git add -A && git commit -m "描述改了什么"   # 每改必 commit（本地）
git push                                    # ⚠️ 等阿聪说推，或攒够一批再推
```

⚠️ **例外：投递前必须推**——HR 看的是公网，本地改了没推等于没改。
⚠️ 本地验证的缓存：改完按 `Ctrl+Shift+R` 硬刷；改 css/js 要升版本号，否则本地看到的还是旧样式。

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
