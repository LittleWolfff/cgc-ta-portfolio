/* =========================================================
   陈冠聪 · TA 作品集 — 交互逻辑（基于 zqd12345/portfolio）
   ========================================================= */
(function(){
  "use strict";

  /* ---------- 作品数据 ---------- */
  var WORKS = [
    {id:"g1", type:"video", cat:"self",
     title:"【Unity】草渲染——GPU草", tag:"几何着色器 · 曲面细分",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/grass/unity-grass-render.mp4", poster:"",
     size:"约24MB · 1080P",
     desc:"背景：想了解 GPU 草渲染，学习用几何着色器和曲面细分从顶点实时生成草叶。\n流程：曲面细分加密地面顶点，几何着色器从每个顶点长出一片草（7 个顶点拼成叶片），用随机函数控制每片草的高度、宽度、弯曲；风场图驱动摆动，再写脚本把角色位置传给 shader，实现草被角色推开压弯的交互。\n收获：了解了 GPU 渲染管线里曲面细分和几何着色器这两个阶段，以及从顶点实时生成几何体的思路。\n{{link:技术文档：:https://my.feishu.cn/wiki/FVDMwFYBziSnvRkPTRrctVjun1b}}"},
    {id:"g2", type:"image", cat:"self",
     title:"【Unity】草渲染——面片草", src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/grass/grass-quad.png",
     desc:"背景：了解草渲染的更多方案是如何实现的。\n流程：顶点色红通道当摆动权重（根部固定、顶部摆），法线统一朝上让明暗更平滑，再拿噪声图采样做风吹的顶点动画。LOD 没用减面，而是直接切 shader——远处草砍掉动画和阴影，只留颜色。\n收获：了解了面片草的大致流程。\n{{link}}",
     link:"https://zhuanlan.zhihu.com/p/1982165167371473318"},
    {id:"w1", type:"video", cat:"self",
     title:"【Unity】水渲染——卡通交互水", tag:"Shader · 交互",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/water/unity-water-render.mp4", poster:"",
     size:"约35MB · 1080P",
     desc:"背景：想了解卡通风格的水渲染，以及水面交互的做法。\n流程：用深度图做深浅水渐变，岸边用噪声图和深度判断出泡沫；折射用 GrabPass 抓屏幕、法线贴图偏移采样；交互拿一个正交相机跟随角色，把角色渲染到 RenderTexture，水面 shader 采样它，在角色周围产生涟漪。\n收获：了解了卡通水的基本做法，以及用 RenderTexture 和正交相机做水面交互的思路。\n{{link:技术文档：:https://my.feishu.cn/wiki/Z8UqwdXKKib39ok0Ps8cpRvjnEh}}"},
    {id:"v1", type:"video", cat:"self",
     title:"【Unity】特效——爆炸", tag:"VFX · Shader",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/vfx/unity-vfx-explosion.mp4", poster:"",
     size:"约2.4MB · 1080P",
     desc:"背景：想了解 Unity 的 VFX 特效制作，跟着教程做一个完整的爆炸效果。\n流程：用粒子系统搭出火花、烟雾球、烟圈多层结构；烟雾球和烟圈在 Blender 里建模、Krita 画无缝贴图，再用噪声图加 custom 值做 clip 溶解，让烟雾按黑灰白顺序消散；粒子颜色走顶点色传给 shader 实现烟雾变黑，材质用 HDR 让火花和橙环发光。\n收获：了解了特效从 DCC 建模、画贴图到引擎粒子系统和溶解 shader 的完整流程，也学会了用 custom 数据让粒子系统和 shader 联动。\n{{link:技术文档：:https://my.feishu.cn/wiki/ThmAwKxUFieoeukqswdcbMiHnic}}"},
    {id:"a1", type:"image", cat:"ai",
     title:"【AI】UE 资产读取工具", tag:"MCP · UAssetAPI · Python",
     src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/ai/ue-asset-tool.webp?v=2", portrait:true,
     desc:"背景：UE 材质节点有时会出 bug，自己排查容易卡住，于是做了这个工具让 AI 能读到材质资产、帮忙分析节点逻辑——问题很快就定位到了；顺带还能让它讲解我还没看懂的节点实现。\n流程：基于 UAssetAPI 解析 .uasset 二进制文件，封装成 MCP Server 供 Claude Code 调用，让它能读到材质的参数、蓝图的父类、变量名与函数图。踩了不少坑——MCP 配置只认项目根目录的 .mcp.json、依赖装到 mcp 2.0 会直接崩、切换工程后必须重启 CC、Git Bash 会把 /Game/... 路径改写成 C:/Program Files/Git/Game/... 导致找不到资产。\n收获：现在做 UE 材质和蓝图时，卡住的地方可以让 AI 一起看逻辑，不用自己硬啃；已索引两个 UE 工程，能读取 5 个蓝图的父类、变量名、函数图名与接口函数签名，以及材质资产的 domain / blend_mode，产出 dump_blueprint.py 等可复用脚本。"},
    {id:"a2", type:"image", cat:"ai",
     title:"【AI】视频转文字流水线", tag:"ASR · LLM 纠错 · Python",
     src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/ai/video-to-text.webp?v=2", portrait:true,
     desc:"背景：学一个新领域时，同一个纯理论课题在 B 站往往有一堆教程，一个个从头看完效率太低，有时看完了才发现不是自己想要的。于是想把视频转成文字，再让 AI 先帮我梳理这个领域的知识框架，快速锁定精华，挑值得的教程回看。\n流程：下载 → ASR 识别 → LLM 术语级纠错，把每期视频转成文章后汇总喂给 AI 梳理。中间踩了一堆坑——6GB 显存要分片处理、funasr 依赖的 editdistance 没有预编译包得自写纯 Python 垫片顶替、Windows glob 大小写不敏感导致重复处理需用 set() 去重、下载被 412 反爬从 yt-dlp 换 you-get。\n收获：现在学新领域时，能先把整套教程转成文字让 AI 梳理框架、锁定精华，再挑需要的视频回看，不用一个个从头啃；识别准确率也从几乎乱码提升到可直接阅读的程度。"},
    {id:"a3", type:"image", cat:"ai",
     title:"【AI】飞书知识库共享", tag:"MCP · 飞书 API · pandoc",
     src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/ai/feishu-kb.webp", portrait:true,
     desc:"背景：想把本地攒的 Markdown 笔记搬运到飞书知识库中统一管理，如果人工一篇篇搬运会非常费力，于是研究连通了飞书知识库的 MCP，让 AI 帮助我传输文件的同时，还能帮我检索知识和写一些飞书文档，方便团队协作。\n流程：pandoc 转 docx（用 Lua filter 把图片宽度统一成 680px 适配飞书正文区），再走开放平台 API 六步导入——分片上传 → import_tasks → 轮询状态 → move_docs_to_wiki；反向还写了 wiki → 本地 md 的增量同步；接上 MCP 后，AI 能直接在知识库里写新文档。踩了不少坑——medias API 报 1061004 权限不足改走 files 通道、import_tasks 不支持挂载 wiki 要先导云空间再搬、MCP 改不了文档标题只能自己写脚本直调 API。\n收获：现在 AI 能直接在飞书知识库里检索和写文档，团队要用的资料可以让它整理成文、就地协作；同时也把「本地笔记 → 飞书知识库」的搬运做成了自动化——带大量插图的笔记能一次性导入且排版干净。"},
    {id:"a4", type:"image", cat:"ai",
     title:"【AI】知乎原文阅读工具", tag:"CLI 工具 · Python",
     src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/ai/zhihu-reader.webp", portrait:true,
     desc:"背景：平时主要在知乎上学东西，但很多时候 AI 帮不上忙——它读不到原文，只能拿搜索给的「多篇文章聚合提炼后的摘要」回答，细节经常对不上，也没法就着真实内容深入讲。想让 AI 在我学习时真正能答疑、帮我梳理知识，就得先解决「让它读到原文」这件事。\n流程：先试纯 API 直连，卡在知乎的 x-zse-96 动态签名上（前端 JS 用 URL + Cookie + 时间戳现算），换 UA、加 Referer、带完整 Cookie 全部 403；又试了真实浏览器方案，启动慢、新会话没登录态被风控拦、短信登录还要过滑块验证。最后发现现成的 zhihu-toolkit CLI，一条命令跑通。中途还踩了个环境坑——本机的 PYTHONHOME 会让 uv 装的隔离工具串用系统 Python 库，一跑就报 SRE module mismatch，得先清空它。\n收获：现在遇到不懂的内容，可以直接把原文（含图）抓成 markdown 喂给 AI，就着原文问、让它帮我梳理成体系；拿到的还是原文细节，不用再靠搜索的二手摘要凑，学起来踏实也高效。另外留了条兜底路线——Cookie 失效或知乎改版时，浏览器另存 HTML 丢进脚本解析也能用。"},
    {id:"p1", type:"project", cat:"amuse",
     title:"【Unity】《自娱自乐》", date:"2026.01 — 2026.04", role:"Unity / 3D美术 / 技术美术",
     video:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/projects/project-amuse-ourselves.mp4",
     thumbBg:"linear-gradient(135deg,#1a0e1f,#2d1a35,#120818)",
     desc:"背景：Unity 引擎的卡通解密游戏。依旧作为唯一的 3D 美术兼 TA，不过相比以前更有开发经验，更加得心应手。团队规模：3 美术、1 程序、1 策划。\n流程：负责所有 3D 资产建模、贴图与场景搭建；用混元 3D 生成高模，再手动拓扑成低模\n收获：独立开发模块化卡通渲染方案，拆分漫反射、阴影、环境光、边缘光等光照模块，实现 Ramp 卡通明暗、风格化条纹阴影、平滑法线描边、材质 ID 多色分区；自写全局设置系统与 Editor 工具链配合，流程更专业\n{{link:技术文档链接：:https://my.feishu.cn/wiki/ZFk3wSNKOiUtReke0XQcBVKfnZe}}"},
    {id:"c1", type:"video", cat:"amuse",
     title:"【Unity】角色渲染——千早爱音", tag:"NPR · 卡通",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/char/unity-anon-char-render.mp4", poster:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/char/poster-anon.webp",
     size:"约33MB · 1080P",
     desc:"背景：在学习了星见雅和其他一些角色的渲染方式后，为了体会自己独立落地的过程，从零开始制作角色。\n流程：Blender建模、蒙皮、K动画，SP画纹理和画遮罩，Unity实现渲染和人物移动。\n收获：网上的教程往往伴随着素材，这次的遮罩等素材自己画，提高了我的动手能力，比如通过琢磨油管教程，成功总结了怎么画面部SDF。通过改渲染逻辑，也让我对角色渲染有了更深的了解，比如为了解决头发自阴影的问题，尝试用遮罩把后发的阴影固定住。\n{{link:面部SDF画法：:https://my.feishu.cn/wiki/Xly1wKjVViIqt3kfLt5c8YlLn8o}}\n{{link:角色技术文档：:https://my.feishu.cn/wiki/Ttziwa474iLSv3k92x2cVDbYnxb}}", link:""},
    {id:"t1", type:"video", cat:"amuse",
     title:"【工具】Blender资产规范化工具", tag:"工具 · Python",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/tool/blender-asset-tool.mp4", poster:"",
     size:"约9.9MB · 1080P",
     desc:"背景：游戏项目里只有我一个 3D 美术，需要处理大量 3D 模型，经常要检查法线对不对、修改器有没有应用、名字有没有规范命名、原点在不在模型底部等等，耗精力且容易忘记检查而出错，于是想到用 CodeBuddy 生成一个规范化的工具。\n流程：边 vibe coding 边测试功能，同时应用于实际的游戏开发场景，不断更新迭代，实现了快速命名、检查 UV 是否拉伸严重、原点归零等操作一键处理、检查法线是否正确、快捷导出模型（内部配置了正确的导出设置）。同时考虑了上手难度，专门设置了顺序步骤，美术只需跟着步骤点击，简单易上手。\n收获：切实感受到自动化工具的好处，也为后续开发一系列 skill 和工具打下了基础。"},
    {id:"p2", type:"project", cat:"fuchenlu",
     title:"【UE】《浮沉录》", titleSuffix:'<span style="font-size:14px;font-weight:400">（锐意开发中）</span>',
     date:"2026.06 — 2026.08", role:"UE / 技术美术",
     thumbBg:"linear-gradient(135deg,#0f1a1a,#1a2d2d,#081212)",
     src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/projects/fuchenlu.webp",
     icon:"📜", label:"浮沉录",
     desc:"背景：动作冒险游戏。参与 UE 项目，促进 UE 的学习。团队规模：30 人+\n流程：目前负责渲染管线搭建、主角的渲染、布料模拟\n收获：对 UE 引擎有了更多的运用和学习，同时增加 UE 团队协作的经验"},
    {id:"c3", type:"image", cat:"fuchenlu",
     title:"【UE】管线——角色管线", tag:"管线规范 · UE",
     src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/pipeline/ue-pipeline-full.webp?v=2",
     desc:"背景：项目里要做主角、敌人等多个角色，但作为学生团队，产能有点跟不上。想拿主角当试验田，先搭一套角色管线跑通，后续用它加快其他角色的产出；同时也针对我们产能紧缺的实际情况，设计一套更贴合自己的方案。\n{{link:通用角色管线：:https://my.feishu.cn/wiki/TUwQwfUvSicvu0kMjQQcro39ndb}}。通过收集网上资料了解业内专业的角色管线流程，并补充进自己的实践流程（比如布料流程）；理论部分占比更大，只作为实际项目搭建角色管线的参考，后续会根据实际项目继续优化。\n{{link:浮沉录角色管线：:https://my.feishu.cn/wiki/IHUzwaBE4ix1VJk2Ao7c25H4n4t}}。根据项目实际的开发流程和经验，我独立搭建了一套更适配浮沉录项目和需求的管线——开发途中经常出现需求对不齐、流程不明确的问题，做成可视化流程后就清晰多了，之后再找特定成员单独提需求和跟进。\n收获：对角色的生产有了更清晰的认识。"},
    {id:"c2", type:"image", cat:"fuchenlu",
     title:"【UE】角色渲染——克雷斯蒂娜", src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/char/ue-char-christina.webp?v=2", contain:true,
     desc:"背景：用于预研 UE 的角色渲染，学习 UE 材质节点，并整理出材质函数，总结进个人 UE 插件中。\n流程：从网上获取模型fbx和基础贴图，导入UE进行渲染学习。\n收获：对UE材质节点和UE角色渲染有了更深的了解。", link:""},
    {id:"c4", type:"video", cat:"fuchenlu",
     title:"【UE】布料模拟系统", tag:"布料 · UE",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/cloth/cloth-demo.mp4", poster:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/cloth/cloth-poster.webp",
     size:"约0.6MB · 966x748",
     desc:"背景：主策希望主角外套的下摆能够飘动，于是开始研究布料系统。\n流程：从网上搜集教程加上啃 UE 官方文档，从零搭建布料系统，中间踩了不少坑——布料模拟没效果，后来让美术调整了布料与素体间的空隙才明显起来；布料各种穿模，才发现是物理资产没设置好，专门补学了物理资产的搭建方法；实机跑起来帧率很低，换成代理模型方案、并减少动力学碰撞素体的面数后，帧率大幅提升。\n收获：通过搭建布料系统，让我对 UE 引擎更加地熟悉，同时也对布料相关技术有了更深的了解。\n{{link:技术文档：:https://my.feishu.cn/wiki/DHs9wDraDiLY8BkZqe8cKe8in8f}}（摘自通用角色管线的布料部分）"},
    {id:"c5", type:"image", cat:"fuchenlu",
     title:"【工具】布料参数读取工具", tag:"Chaos Cloth · Dataflow · MCP",
     src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/tool/cloth-param-reader.webp", contain:true,
     desc:"背景：不同布料（比如西装和披风）质感不一样，对应的布料参数差别也很大——想用一套参数模板套所有布料并不现实。\n流程：连通了 Dataflow 的 MCP，再写了个小工具，可以直接读取某个 CA 里改动过的参数并留档；之后遇到质感相近的布料，就能快速翻出参考。\n收获：布料参数能方便地留档，慢慢攒成自己的「布料种子库」；另外 AI 能读到 Dataflow 的逻辑和节点参数，给出的参考建议实测确实有效，也让我对各个参数的作用理解更深了。"},
    {id:"p3", type:"project", cat:"dreamaker",
     title:"【Unity】《游戏造梦师》", date:"2024.06 — 2025.06", role:"Unity / 3D美术 / 技术美术",
     video:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/projects/project-dream-maker.mp4",
     poster:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/projects/poster-dream-maker.webp",
     trap:true,
     thumbBg:"linear-gradient(135deg,#2a1f0e,#3d2b14,#1a0f00)",
     desc:"背景：模拟经营类游戏。刚接触游戏开发，作为唯一的 3D 美术，从零摸索 3D 模型导入、SP 绘制纹理、Unity 渲染等过程。团队规模：10 人+\n流程：负责所有的 3D 模型建模和场景搭建，以及所有的纹理绘制、shader 编写\n收获：积累了 3D 游戏开发的经验，总结过不少坑，比如模型导入 Unity 之前要先检查面朝向是否正确；不断接触 shader，培养了对 TA 方向的兴趣，确定了 TA 方向并持续学习"},
  ];

  var CAT_LABEL = {self:"自练内容", amuse:"2026项目《自娱自乐》", fuchenlu:"2026项目《浮沉录》", dreamaker:"2025项目《游戏造梦师》", char:"角色渲染", grass:"草渲染", water:"水渲染", vfx:"特效", render:"渲染作品", shader:"Shader", tool:"工具/管线", ai:"AI 应用"};

  /* ---------- 栏首说明（按分类切换，未配置的分类不显示） ---------- */
  var CAT_INTRO = {
    amuse: {
      title: "目录",
      items: [
        "项目本体：【Unity】《自娱自乐》",
        "应用于项目：【Unity】角色渲染——千早爱音",
        "应用于项目：【工具】Blender资产规范化工具"
      ]
    },
    fuchenlu: {
      title: "目录",
      items: [
        "项目本体：【UE】《浮沉录》（锐意开发中）",
        "应用于项目：【UE】管线——角色管线",
        "应用于项目：【UE】角色渲染——克雷斯蒂娜",
        "应用于项目：【UE】布料模拟系统",
        "应用于项目：【工具】布料参数读取工具"
      ]
    },
    dreamaker: {
      title: "目录",
      items: [
        "项目本体：【Unity】《游戏造梦师》"
      ]
    },
    self: {
      title: "目录",
      items: [
        "自练内容：【Unity】草渲染——GPU草",
        "自练内容：【Unity】草渲染——面片草",
        "自练内容：【Unity】水渲染——卡通交互水",
        "自练内容：【Unity】特效——爆炸"
      ]
    },
    ai: {
      blocks: [
        {
          title: "目录",
          items: [
            "AI应用：【AI】UE 资产读取工具",
            "AI应用：【AI】视频转文字流水线",
            "AI应用：【AI】飞书知识库共享",
            "AI应用：【AI】知乎原文阅读工具"
          ]
        },
        {
          title: "我常用的 AI 工具&模型",
          items: [
            "Visual Studio Code：主力开发环境，Claude Code 等 AI 工具集成在这里",
            "Claude Code：先部署 CLI，再通过 VS Code 扩展集成进编辑器，主力 AI 开发助理",
            "DeepSeek-V4 Flash：主力模型，经 API 接入，作为 Claude Code 的底层模型，累计消费 500+ CNY",
            "Qwen-VL-Plus：阿里通义千问视觉模型，用于图像理解与 OCR"
          ]
        }
      ]
    }
  };
  var EMPTY_FALLBACK = '<p class="works-empty">作品还在路上，稍后就到</p>';

  /* ---------- DOM ---------- */
  var grid = document.getElementById("worksGrid");
  var filters = document.getElementById("filters");
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var vm = document.getElementById("videoModal");
  var vmVideo = document.getElementById("vmVideo");
  var vmTitle = document.getElementById("vmTitle");
  var vmTag = document.getElementById("vmTag");
  var vmDesc = document.getElementById("vmDesc");

  var currentFilter = "amuse";
  var lbIndex = -1;

  /* ---------- 渲染作品卡片 ---------- */
  function esc(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function formatDesc(w){
    var s = esc(w.desc);
    s = s.replace(/^(背景|流程|收获|目标|结论|方案|原理)[：:]/gm, '<span class="desc-label">$1：</span>');
    // 支持 {{link:前缀:URL}} 带 URL 的占位符（可多个）
    s = s.replace(/\{\{link:([^:}]*):([^}]*)\}\}/g, function(m, prefix, url){
      var href = esc(url || w.link);
      return '<span class="desc-label">'+(prefix||'流程笔记链接：')+'</span><a class="desc-link" href="'+href+'" target="_blank" rel="noopener">'+href+'</a>';
    });
    // {{plainlink:前缀:URL}} —— 前缀当普通文字（不高亮/不加粗），用于不想抢眼的链接
    s = s.replace(/\{\{plainlink:([^:}]*):([^}]*)\}\}/g, function(m, prefix, url){
      return prefix+'<a class="desc-link" href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(url)+'</a>';
    });
    if (w.link) s = s.replace(/\{\{link:([^}]*)\}\}/g, function(m, prefix){
      return '<span class="desc-label">'+(prefix||'流程笔记链接：')+'</span><a class="desc-link" href="'+esc(w.link)+'" target="_blank" rel="noopener">'+esc(w.link)+'</a>';
    });
    s = s.replace(/\{\{link\}\}/g, '<span class="desc-label">流程笔记链接：</span><a class="desc-link" href="'+esc(w.link)+'" target="_blank" rel="noopener">'+esc(w.link)+'</a>');
    s = s.replace(/\n/g,'<br>');
    return s;
  }

  function cardHTML(w, i){
    // project — 项目卡（结构与 index.html 里原 .project-card 完全一致）
    if (w.type === "project"){
      var thumb;
      if (w.multi){
        // 多图轮播缩略图（原 .project-thumb.multi）
        thumb = '<div class="project-thumb multi" style="background:'+w.thumbBg+'" data-full-imgs="'+w.fullImgs+'" data-thumbs="'+w.thumbs+'">'+
          '<img class="project-thumb-img" src="'+w.src+'" alt="'+esc(w.label)+'">'+
          '<span class="project-thumb-icon">'+w.icon+'</span>'+
          '<span class="project-thumb-label">'+esc(w.label)+'</span>'+
          '<span class="thumb-nav thumb-prev">‹</span>'+
          '<span class="thumb-nav thumb-next">›</span>'+
        '</div>';
      } else if (w.src){
        // 单图缩略（图片版 .project-thumb；给 w.multi 留口子，去掉 multi 即可切回单图）
        thumb = '<div class="project-thumb" style="background:'+w.thumbBg+'">'+
          '<img class="project-thumb-img" src="'+w.src+'" alt="'+esc(w.label)+'">'+
          '<span class="project-thumb-icon">'+w.icon+'</span>'+
          '<span class="project-thumb-label">'+esc(w.label)+'</span>'+
        '</div>';
      } else {
        thumb = '<div class="project-thumb" style="background:'+w.thumbBg+'">'+
          '<video class="project-thumb-video" src="'+w.video+'" controls preload="auto"'+(w.poster?' poster="'+w.poster+'"':'')+'></video>'+
          (w.trap?'<div class="fullscreen-trap" title="网页全屏"></div>':'')+
        '</div>';
      }
      return '<article class="project-card">'+thumb+
        '<div class="project-body">'+
          '<div class="project-head">'+
            '<h4>'+esc(w.title)+(w.titleSuffix||"")+'<span class="project-date">'+esc(w.date)+'</span></h4>'+
            '<p class="project-role">'+esc(w.role)+'</p>'+
          '</div>'+
          '<p>'+formatDesc(w)+'</p>'+
        '</div></article>';
    }
    if (w.type === "video"){
      var hasFile = w.file;
      var html = '<article class="work-card work-card-h">'+
        '<span class="work-cat">'+CAT_LABEL[w.cat]+'</span>';
      if (hasFile){
        html += '<div class="work-video-wrap"><video src="'+w.file+'" controls preload="auto" poster="'+w.poster+'"></video><div class="fullscreen-trap" title="网页全屏"></div></div>';
      } else {
        html += '<div class="work-thumb-empty">'+esc(w.emptyText || "视频制作中，稍后上线")+'</div>';
      }
      html += '<div class="work-info"><h3 class="work-title">'+esc(w.title)+'</h3>';
      if (w.desc) html += '<p class="work-desc">'+formatDesc(w)+'</p>';
      html += '</div></article>';
      return html;
    }
    if (w.type === "script"){
      return '<article class="work-card" data-index="'+i+'" data-open="script" tabindex="0" role="button" aria-label="打开剧本 '+esc(w.title)+'">'+
        '<div class="work-thumb script-thumb"><div class="script-inner"><span class="script-doc">DOCX</span>'+
        '<h3 class="script-name">'+esc(w.title)+'</h3><span class="script-open">打开剧本 ↓</span></div></div>'+
        '<span class="work-cat">剧本创作</span>'+
        '<div class="work-info"><h3 class="work-title">'+esc(w.title)+'<span class="tag">'+esc(w.tag)+'</span></h3>'+
        '<p class="work-sub">'+esc(w.desc)+'</p></div></article>';
    }
    // image — 横排大图卡片；portrait 竖图改为贴合图片自身高度，不留左右黑边
    var wrapStyle = w.portrait ? 'background:#000;width:28%' : 'background:#000';
    var imgStyle = w.portrait
      ? 'display:block;width:100%;height:auto;cursor:pointer'
      : 'width:100%;aspect-ratio:16/9;'+(w.contain ? 'object-fit:contain;' : 'object-fit:cover;object-position:top;')+'display:block;cursor:pointer';
    return '<article class="work-card work-card-h" data-open="image">'+
      '<span class="work-cat">'+CAT_LABEL[w.cat]+'</span>'+
      '<div class="work-video-wrap" style="'+wrapStyle+'"><img loading="lazy" src="'+w.src+'" alt="'+esc(w.title)+'" style="'+imgStyle+'"></div>'+
      '<div class="work-info"><h3 class="work-title">'+esc(w.title)+'</h3>'+
      (w.desc ? '<p class="work-desc">'+formatDesc(w)+'</p>' : '<p class="work-desc">点击图片查看大图</p>')+
      '</div></article>';
  }

  function render(){
    var list = WORKS.filter(function(w){ return currentFilter === "all" || w.cat === currentFilter; });
    if (list.length === 0){
      grid.innerHTML = EMPTY_FALLBACK;
      return;
    }
    grid.innerHTML = list.map(cardHTML).join("");
  }

  /* ---------- 栏首说明渲染 ---------- */
  function renderIntro(cat){
    var el = document.getElementById("worksIntro");
    if (!el) return;
    var cfg = CAT_INTRO[cat];
    if (!cfg){ el.hidden = true; el.innerHTML = ""; return; }
    // 兼容单块 {title,items} 与多块 {blocks:[...]}
    var blocks = cfg.blocks || [cfg];
    var html = "";
    blocks.forEach(function(b){
      if (b.title) html += '<p class="intro-title">'+esc(b.title)+'</p>';
      if (b.items && b.items.length){
        html += '<ul class="intro-list">'+b.items.map(function(t){ return "<li>"+esc(t)+"</li>"; }).join("")+"</ul>";
      }
    });
    el.innerHTML = html;
    el.hidden = false;
  }

  /* ---------- 筛选 ---------- */
  if (filters) {
    filters.addEventListener("click", function(e){
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filters.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderIntro(currentFilter);
      render();
      var y = document.getElementById("works").getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({top: y, behavior: "smooth"});
    });
  }

  /* ---------- 卡片点击 ---------- */
  grid.addEventListener("click", function(e){
    var card = e.target.closest(".work-card");
    if (!card) return;
    openCard(card);
  });
  grid.addEventListener("keydown", function(e){
    if (e.key === "Enter" || e.key === " "){
      var card = e.target.closest(".work-card");
      if (card){ e.preventDefault(); openCard(card); }
    }
  });

  function openCard(card){
    var idx = parseInt(card.getAttribute("data-index"), 10);
    var w = WORKS[idx];
    if (!w) return;
    if (w.type === "video") return; // 视频直接嵌入，不弹窗
    if (w.type === "script") window.open(w.file, "_blank");
    else openLightboxAt(w);
  }

  /* ---------- 作品区图片点击 → 灯箱 ---------- */
  grid.addEventListener("click", function(e){
    var img = e.target.closest(".work-card-h[data-open='image'] img");
    if (!img) return;
    document.getElementById("lbPrev").style.display = "none";
    document.getElementById("lbNext").style.display = "none";
    lbImg.src = img.src;
    lbCap.textContent = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  /* ---------- 覆盖层拦截原生全屏 → 网页全屏 ---------- */
  document.addEventListener("click", function(e){
    var trap = e.target.closest(".fullscreen-trap");
    if (!trap) return;
    e.stopPropagation();
    e.preventDefault();
    var container = trap.closest(".work-video-wrap, .project-thumb");
    if (!container) return;
    var video = container.querySelector("video");
    if (!video || !video.src) return;
    var title = "";
    var card = trap.closest(".work-card-h, .project-card");
    if (card) { var t = card.querySelector(".work-title, h4"); if (t) title = t.textContent.trim(); }
    openVideoModal(video.src, title);
  });

  function openVideoModal(src, title){
    vmTitle.textContent = title || "";
    vmTag.textContent = "";
    vmDesc.textContent = "";
    vmVideo.src = src;
    vm.classList.add("open");
    vm.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var p = vmVideo.play();
    if (p && p.catch) p.catch(function(){});
  }

  /* ---------- 视频弹窗 ---------- */
  function openVideo(w){
    vmTitle.textContent = w.title;
    vmTag.textContent = w.tag;
    vmDesc.textContent = w.desc;
    vmVideo.src = w.file;
    vm.classList.add("open");
    vm.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var p = vmVideo.play();
    if (p && p.catch) p.catch(function(){});
  }
  function closeVideo(){
    vm.classList.remove("open");
    vm.setAttribute("aria-hidden", "true");
    vmVideo.pause();
    vmVideo.removeAttribute("src");
    vmVideo.load();
    document.body.style.overflow = "";
  }
  vm.addEventListener("click", function(e){
    if (e.target.hasAttribute("data-close")) closeVideo();
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape"){ if (vm.classList.contains("open")) closeVideo(); if (lightbox.classList.contains("open")) closeLightbox(); }
  });

  /* ---------- 多图缩略图左右箭头切换 ---------- */
  document.addEventListener("click", function(e){
    var nav = e.target.closest(".thumb-nav");
    if (!nav) return;
    e.stopPropagation();
    var thumb = nav.closest(".project-thumb");
    var thumbs = thumb.getAttribute("data-thumbs");
    if (!thumbs) return;
    var list = thumbs.split("|").map(function(s){ return s.trim(); });
    var img = thumb.querySelector(".project-thumb-img");
    var cur = img.getAttribute("src");
    var idx = list.indexOf(cur);
    var next = nav.classList.contains("thumb-next")
      ? (idx + 1) % list.length
      : (idx - 1 + list.length) % list.length;
    img.setAttribute("src", list[next]);
  });

  /* ---------- 项目缩略图/游戏封面 点击查看大图 ---------- */
  var lbGallery = null, lbGalleryIndex = 0;
  document.addEventListener("click", function(e){
    if (e.target.closest(".thumb-nav")) return; // 箭头切换不触发灯箱
    var thumb = e.target.closest(".project-thumb, .game-cover");
    if (!thumb) return;
    e.preventDefault();
    var caption = thumb.classList.contains("game-cover")
      ? (thumb.getAttribute("alt") || "")
      : (thumb.querySelector(".project-thumb-label")?.textContent || "");
    var multi = thumb.getAttribute("data-full-imgs");
    if (multi){
      lbGallery = multi.split("|").map(function(s){ return s.trim(); });
      // 跟随缩略图当前显示的第几张
      lbGalleryIndex = 0;
      var imgEl = thumb.querySelector(".project-thumb-img");
      if (imgEl){
        var curThumb = imgEl.getAttribute("src");
        var thumbs = (thumb.getAttribute("data-thumbs") || "").split("|").map(function(s){ return s.trim(); });
        var ti = thumbs.indexOf(curThumb);
        if (ti >= 0 && ti < lbGallery.length) lbGalleryIndex = ti;
      }
      openLightboxDirect(lbGallery[lbGalleryIndex], caption);
      return;
    }
    var fullSrc = thumb.getAttribute("data-full-img");
    if (!fullSrc) return;
    openLightboxDirect(fullSrc, caption);
  });

  /* ---------- 图片灯箱 ---------- */
  function openLightboxDirect(src, caption){
    lbImg.src = src;
    lbCap.textContent = caption;
    var prevBtn = document.getElementById("lbPrev"), nextBtn = document.getElementById("lbNext");
    var showArrows = lbGallery && lbGallery.length > 1;
    prevBtn.style.display = showArrows ? "" : "none";
    nextBtn.style.display = showArrows ? "" : "none";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbReset();
  }
  function openLightboxAt(w){
    var i = IMAGE_WORKS.indexOf(w);
    if (i < 0) return;
    lbIndex = i;
    showLb();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function showLb(){
    var w = IMAGE_WORKS[lbIndex];
    lbImg.src = w.src;
    lbImg.alt = w.title;
    lbCap.textContent = (lbIndex+1) + " / " + IMAGE_WORKS.length + " · " + w.title;
  }
  function stepLb(d){
    lbIndex = (lbIndex + d + IMAGE_WORKS.length) % IMAGE_WORKS.length;
    showLb();
  }
  function closeLightbox(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.getElementById("lbPrev").style.display = "";
    document.getElementById("lbNext").style.display = "";
    document.body.style.overflow = "";
    lbReset();
    lbGallery = null;
    lbGalleryIndex = 0;
  }

  /* ---------- 灯箱缩放 + 拖拽 ---------- */
  var lbScale = 1, lbTx = 0, lbTy = 0;
  var lbDragging = false, lbDragStartX = 0, lbDragStartY = 0, lbDragOrigTx = 0, lbDragOrigTy = 0;
  function lbApplyTransform(){
    lbImg.style.transform = 'translate('+lbTx+'px,'+lbTy+'px) scale('+lbScale+')';
    lbImg.style.cursor = lbScale > 1 ? 'grab' : 'zoom-in';
  }
  function lbReset(){
    lbScale = 1; lbTx = 0; lbTy = 0;
    lbApplyTransform();
  }
  // 滚轮缩放
  lbImg.addEventListener('wheel', function(e){
    e.preventDefault();
    var delta = e.deltaY > 0 ? -0.15 : 0.15;
    lbScale = Math.max(1, Math.min(5, lbScale + delta));
    if (lbScale === 1){ lbTx = 0; lbTy = 0; }
    lbApplyTransform();
  }, {passive:false});
  // 拖动平移
  lbImg.addEventListener('mousedown', function(e){
    if (lbScale <= 1) return;
    lbDragging = true;
    lbDragStartX = e.clientX; lbDragStartY = e.clientY;
    lbDragOrigTx = lbTx; lbDragOrigTy = lbTy;
    lbImg.style.cursor = 'grabbing';
    e.preventDefault();
  });
  document.addEventListener('mousemove', function(e){
    if (!lbDragging) return;
    lbTx = lbDragOrigTx + (e.clientX - lbDragStartX);
    lbTy = lbDragOrigTy + (e.clientY - lbDragStartY);
    lbApplyTransform();
  });
  document.addEventListener('mouseup', function(){
    if (lbDragging){
      lbDragging = false;
      lbImg.style.cursor = lbScale > 1 ? 'grab' : 'zoom-in';
    }
  });
  // 双击重置
  lbImg.addEventListener('dblclick', function(){ lbReset(); });
  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", function(){
    if (lbGallery && lbGallery.length > 1){
      lbGalleryIndex = (lbGalleryIndex - 1 + lbGallery.length) % lbGallery.length;
      openLightboxDirect(lbGallery[lbGalleryIndex], lbCap.textContent.split(" · ").pop());
    } else {
      stepLb(-1);
    }
  });
  document.getElementById("lbNext").addEventListener("click", function(){
    if (lbGallery && lbGallery.length > 1){
      lbGalleryIndex = (lbGalleryIndex + 1) % lbGallery.length;
      openLightboxDirect(lbGallery[lbGalleryIndex], lbCap.textContent.split(" · ").pop());
    } else {
      stepLb(1);
    }
  });
  lightbox.addEventListener("click", function(e){
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- 回到顶部 ---------- */
  window.addEventListener("scroll", function(){
    var bt = document.getElementById("backTop");
    if (bt) bt.classList.toggle("show", window.pageYOffset > 600);
  }, {passive:true});
  var backTop = document.getElementById("backTop");
  if (backTop) backTop.addEventListener("click", function(){
    window.scrollTo({top:0, behavior:"smooth"});
  });

  /* ---------- 左栏高亮：滚到哪，亮到哪 ---------- */
  var sections = [];
  document.querySelectorAll("section[id]").forEach(function(s){
    sections.push({el:s, id:s.id});
  });
  var sidebarLinks = document.querySelectorAll(".sidebar-link, .sidebar-name, .nav-links a");
  var lastId = null;

  var ticking = false;
  function updateSidebar(){
    var scrollY = window.pageYOffset + 80;
    var current = sections[0];
    sections.forEach(function(s){
      if (s.el.offsetTop <= scrollY) current = s;
    });
    if (current && current.id !== lastId){
      sidebarLinks.forEach(function(l){ l.classList.remove("active"); });
      var link = document.querySelector('.sidebar-link[href="#'+current.id+'"], .nav-links a[href="#'+current.id+'"]');
      if (!link) link = document.querySelector('.sidebar-name[href="#'+current.id+'"]');
      if (link) link.classList.add("active");
      lastId = current.id;
    }
  }
  window.addEventListener("scroll", function(){
    if (!ticking){ requestAnimationFrame(function(){ updateSidebar(); ticking = false; }); ticking = true; }
  }, {passive:true});
  updateSidebar();

  /* ---------- 移动端汉堡菜单 ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinksEl = document.getElementById("navLinks");
  if (navToggle && navLinksEl){
    function closeNav(){
      navLinksEl.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
    navToggle.addEventListener("click", function(){
      var open = navLinksEl.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinksEl.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", closeNav);
    });
  }

  /* ---------- 复制 ---------- */
  window.copyText = function(btn){
    var text = btn.getAttribute("data-copy") || "";
    var done = function(){
      btn.textContent = "已复制";
      btn.classList.add("done");
      setTimeout(function(){
        btn.textContent = "复制";
        btn.classList.remove("done");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){ fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  };
  function fallbackCopy(text, done){
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch(e){}
    document.body.removeChild(ta);
  }

  /* ---------- 滚动显现 ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  /* ---------- 初始化 ---------- */
  renderIntro(currentFilter);
  render();
})();