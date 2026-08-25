/* =========================================================
   陈冠聪 · TA 作品集 — 交互逻辑（基于 zqd12345/portfolio）
   ========================================================= */
(function(){
  "use strict";

  /* ---------- 作品数据 ---------- */
  var WORKS = [
    {id:"c1", type:"video", cat:"char",
     title:"【Unity】角色渲染——千早爱音", tag:"NPR · 卡通",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/char/unity-anon-char-render.mp4", poster:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/char/poster-anon.webp",
     size:"约33MB · 1080P",
     desc:"背景：在学习了星见雅和其他一些角色的渲染方式后，为了体会自己独立落地的过程，从零开始制作角色。\n流程：Blender建模、蒙皮、K动画，SP画纹理和画遮罩，Unity实现渲染和人物移动。\n收获：网上的教程往往伴随着素材，这次的遮罩等素材自己画，提高了我的动手能力，比如通过琢磨油管教程，成功总结了怎么画面部SDF。通过改渲染逻辑，也让我对角色渲染有了更深的了解，比如为了解决头发自阴影的问题，尝试用遮罩把后发的阴影固定住。\n{{link:面部SDF画法：}}", link:"https://my.feishu.cn/wiki/Xly1wKjVViIqt3kfLt5c8YlLn8o?from=from_copylink"},
    {id:"c2", type:"image", cat:"char",
     title:"【UE】角色渲染——克雷斯蒂娜", src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/char/ue-char-christina.webp?v=2", contain:true,
     desc:"背景：学习UE的角色渲染流程。\n流程：从网上获取模型fbx和基础贴图，导入UE进行渲染学习。\n收获：对UE材质节点和UE角色渲染有了更深的了解。"},
    {id:"g1", type:"video", cat:"grass",
     title:"【Unity】草渲染——GPU草", tag:"几何着色器 · 曲面细分",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/grass/unity-grass-render.mp4", poster:"",
     size:"约24MB · 1080P",
     desc:"背景：想了解 GPU 草渲染，学习用几何着色器和曲面细分从顶点实时生成草叶。\n流程：曲面细分加密地面顶点，几何着色器从每个顶点长出一片草（7 个顶点拼成叶片），用随机函数控制每片草的高度、宽度、弯曲；风场图驱动摆动，再写脚本把角色位置传给 shader，实现草被角色推开压弯的交互。\n收获：了解了 GPU 渲染管线里曲面细分和几何着色器这两个阶段，以及从顶点实时生成几何体的思路。"},
    {id:"g2", type:"image", cat:"grass",
     title:"【Unity】草渲染——面片草", src:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/grass/grass-quad.png",
     desc:"背景：了解草渲染的更多方案是如何实现的。\n流程：顶点色红通道当摆动权重（根部固定、顶部摆），法线统一朝上让明暗更平滑，再拿噪声图采样做风吹的顶点动画。LOD 没用减面，而是直接切 shader——远处草砍掉动画和阴影，只留颜色。\n收获：了解了面片草的大致流程。\n{{link}}",
     link:"https://zhuanlan.zhihu.com/p/1982165167371473318"},
    {id:"w1", type:"video", cat:"water",
     title:"【Unity】水渲染——卡通交互水", tag:"Shader · 交互",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/water/unity-water-render.mp4", poster:"",
     size:"约35MB · 1080P",
     desc:"背景：想了解卡通风格的水渲染，以及水面交互的做法。\n流程：用深度图做深浅水渐变，岸边用噪声图和深度判断出泡沫；折射用 GrabPass 抓屏幕、法线贴图偏移采样；交互拿一个正交相机跟随角色，把角色渲染到 RenderTexture，水面 shader 采样它，在角色周围产生涟漪。\n收获：了解了卡通水的基本做法，以及用 RenderTexture 和正交相机做水面交互的思路。"},
    {id:"v1", type:"video", cat:"vfx",
     title:"【Unity】特效——爆炸", tag:"VFX · Shader",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/vfx/unity-vfx-explosion.mp4", poster:"",
     size:"约2.4MB · 1080P",
     desc:"背景：想了解 Unity 的 VFX 特效制作，跟着教程做一个完整的爆炸效果。\n流程：用粒子系统搭出火花、烟雾球、烟圈多层结构；烟雾球和烟圈在 Blender 里建模、Krita 画无缝贴图，再用噪声图加 custom 值做 clip 溶解，让烟雾按黑灰白顺序消散；粒子颜色走顶点色传给 shader 实现烟雾变黑，材质用 HDR 让火花和橙环发光。\n收获：了解了特效从 DCC 建模、画贴图到引擎粒子系统和溶解 shader 的完整流程，也学会了用 custom 数据让粒子系统和 shader 联动。"},
    {id:"t1", type:"video", cat:"tool",
     title:"Blender 资产规范化工具", tag:"工具 · Python",
     file:"https://cgc-portfolio-1466904848.cos.ap-guangzhou.myqcloud.com/works/tool/blender-asset-tool.mp4", poster:"",
     size:"约9.9MB · 1080P",
     desc:"背景：游戏项目里只有我一个 3D 美术，需要处理大量 3D 模型，经常要检查法线对不对、修改器有没有应用、名字有没有规范命名、原点在不在模型底部等等，耗精力且容易忘记检查而出错，于是想到用 CodeBuddy 生成一个规范化的工具。\n流程：边 vibe coding 边测试功能，同时应用于实际的游戏开发场景，不断更新迭代，实现了快速命名、检查 UV 是否拉伸严重、原点归零等操作一键处理、检查法线是否正确、快捷导出模型（内部配置了正确的导出设置）。同时考虑了上手难度，专门设置了顺序步骤，美术只需跟着步骤点击，简单易上手。\n收获：切实感受到自动化工具的好处，也为后续开发一系列 skill 和工具打下了基础。"},
  ];

  var CAT_LABEL = {char:"角色渲染", grass:"草渲染", water:"水渲染", vfx:"特效", render:"渲染作品", shader:"Shader", tool:"工具/管线"};
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

  var currentFilter = "char";
  var lbIndex = -1;

  /* ---------- 渲染作品卡片 ---------- */
  function esc(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function formatDesc(w){
    var s = esc(w.desc);
    s = s.replace(/^(背景|流程|收获|目标|结论|方案|原理)[：:]/gm, '<span class="desc-label">$1：</span>');
    if (w.link) s = s.replace(/\{\{link:([^}]*)\}\}/g, function(m, prefix){
      return '<span class="desc-label">'+(prefix||'流程笔记链接：')+'</span><a class="desc-link" href="'+esc(w.link)+'" target="_blank" rel="noopener">'+esc(w.link)+'</a>';
    });
    s = s.replace(/\{\{link\}\}/g, '<span class="desc-label">流程笔记链接：</span><a class="desc-link" href="'+esc(w.link)+'" target="_blank" rel="noopener">'+esc(w.link)+'</a>');
    s = s.replace(/\n/g,'<br>');
    return s;
  }

  function cardHTML(w, i){
    if (w.type === "video"){
      var hasFile = w.file;
      var html = '<article class="work-card work-card-h">'+
        '<span class="work-cat">'+CAT_LABEL[w.cat]+'</span>';
      if (hasFile){
        html += '<div class="work-video-wrap"><video src="'+w.file+'" controls preload="auto" poster="'+w.poster+'"></video><div class="fullscreen-trap" title="网页全屏"></div></div>';
      } else {
        html += '<div class="work-thumb-empty">视频制作中，稍后上线</div>';
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
    // image — 跟视频一样的横排大图卡片
    return '<article class="work-card work-card-h" data-open="image">'+
      '<span class="work-cat">'+CAT_LABEL[w.cat]+'</span>'+
      '<div class="work-video-wrap" style="background:#000"><img loading="lazy" src="'+w.src+'" alt="'+esc(w.title)+'" style="width:100%;aspect-ratio:16/9;'+(w.contain ? 'object-fit:contain;' : 'object-fit:cover;object-position:top;')+'display:block;cursor:pointer"></div>'+
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

  /* ---------- 筛选 ---------- */
  if (filters) {
    filters.addEventListener("click", function(e){
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filters.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
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
  render();
})();