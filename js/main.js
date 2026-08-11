/* =========================================================
   陈冠聪 · TA 作品集 — 交互逻辑（基于 zqd12345/portfolio）
   ========================================================= */
(function(){
  "use strict";

  /* ---------- 作品数据 ---------- */
  var WORKS = [
    {id:"c1", type:"video", cat:"char",
     title:"【Unity】角色渲染——千早爱音", tag:"NPR · 卡通",
     file:"assets/videos/unity-anon-char-render.mp4", poster:"assets/images/poster-anon.webp",
     size:"约33MB · 1080P",
     desc:"暂无描述信息"},
  ];

  var CAT_LABEL = {char:"角色渲染", grass:"草渲染", render:"渲染作品", shader:"Shader", tool:"工具/管线"};
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

  var currentFilter = "all";
  var lbIndex = -1;

  /* ---------- 渲染作品卡片 ---------- */
  function esc(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function cardHTML(w, i){
    if (w.type === "video"){
      var hasFile = w.file && w.poster;
      var html = '<article class="work-card work-card-h">'+
        '<span class="work-cat">'+CAT_LABEL[w.cat]+'</span>';
      if (hasFile){
        html += '<div class="work-video-wrap"><video src="'+w.file+'" controls preload="metadata" poster="'+w.poster+'"></video></div>';
      } else {
        html += '<div class="work-thumb-empty">视频制作中，稍后上线</div>';
      }
      html += '<div class="work-info"><h3 class="work-title">'+esc(w.title)+'</h3>';
      if (w.desc) html += '<p class="work-desc">'+esc(w.desc)+'</p>';
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
    // image
    var label = (w.cat === "design") ? "视觉设计" : "概念资产";
    return '<article class="work-card" data-index="'+i+'" data-open="image" tabindex="0" role="button" aria-label="查看图片 '+esc(w.title)+'">'+
      '<div class="work-thumb"><img loading="lazy" src="'+w.src+'" alt="'+esc(w.title)+'"></div>'+
      '<span class="work-cat">'+label+'</span>'+
      '<div class="work-info"><h3 class="work-title">'+esc(w.title)+'</h3>'+
      '<p class="work-sub">点击查看大图</p></div></article>';
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

  /* ---------- 原生全屏按钮 → 网页全屏（模态层盖住闪烁） ---------- */
  document.addEventListener("fullscreenchange", function(){
    var el = document.fullscreenElement;
    if (!el || el.tagName !== "VIDEO") return;
    // 立刻弹出模态层盖住浏览器全屏
    vm.classList.add("open");
    vm.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // 设置视频
    vmVideo.src = el.src;
    var title = "";
    var card = el.closest(".work-card-h, .project-card");
    if (card) { var t = card.querySelector(".work-title, h4"); if (t) title = t.textContent.trim(); }
    vmTitle.textContent = title;
    // 退出浏览器全屏（用户看到的是模态层，无闪烁）
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
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

  /* ---------- 项目缩略图点击查看大图 ---------- */
  document.addEventListener("click", function(e){
    var thumb = e.target.closest(".project-thumb");
    if (!thumb) return;
    var fullSrc = thumb.getAttribute("data-full-img");
    if (!fullSrc) return;
    e.preventDefault();
    openLightboxDirect(fullSrc, thumb.querySelector(".project-thumb-label")?.textContent || "");
  });

  /* ---------- 图片灯箱 ---------- */
  function openLightboxDirect(src, caption){
    lbImg.src = src;
    lbCap.textContent = caption;
    document.getElementById("lbPrev").style.display = "none";
    document.getElementById("lbNext").style.display = "none";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
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
  }
  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", function(){ stepLb(-1); });
  document.getElementById("lbNext").addEventListener("click", function(){ stepLb(1); });
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
  var sidebarLinks = document.querySelectorAll(".sidebar-link, .sidebar-name");
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
      var link = document.querySelector('.sidebar-link[href="#'+current.id+'"]');
      if (!link) link = document.querySelector('.sidebar-name[href="#'+current.id+'"]');
      if (link) link.classList.add("active");
      lastId = current.id;
    }
  }
  window.addEventListener("scroll", function(){
    if (!ticking){ requestAnimationFrame(function(){ updateSidebar(); ticking = false; }); ticking = true; }
  }, {passive:true});
  updateSidebar();

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