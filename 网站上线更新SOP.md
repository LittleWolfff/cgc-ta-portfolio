# 网站上线更新 SOP

> 目的：**给面试官看之前**的最后检查清单，避免现场翻车（打不开 / 要登录 / 点一下就下载 / 空白页）。
> 适用：`https://littlewolfff.github.io/cgc-ta-portfolio/` 每次更新内容后上线前，按顺序过一遍。
> 执行人：小辞（AI）用 agent-browser 无登录态浏览器验证 + 阿聪人工抽查。
> 版本：2026-08-26 首次建立（已按下方「二、2.1」的成熟方案完整执行过一次，全部通过）。

---

## 一、Git 推送确认（最先做）

```bash
cd "D:/Conley/ClaudeCodeWorkspace/W_项目/260810_求职/portfolio-site"
git status -s          # 必须干净（无未提交/未推送）
git log --oneline -3   # 最近提交存在
git push origin master # 推送到 GitHub
```

**验证方法**：
- 有未提交文件 → 先 `git add` + `git commit` 再 push
- **丢测试链接给阿聪**：`https://littlewolfff.github.io/cgc-ta-portfolio/`
- ⚠️ GitHub Pages 部署有延迟（1-2 分钟），push 后别立刻以为没更新

---

## 二、链接全测（核心，重点）

### 2.1 飞书云文档（游客身份验证）★ 成熟方案

> **唯一正确方法：agent-browser 无登录态真实浏览器**。页面必须有「登录/注册」按钮（= 未登录），但正文能读到。
> ⚠️ **绝对不要用 curl 验证飞书**——飞书对脚本/非浏览器请求强制跳登录页，curl 测全是「跳登录」假警报，会误判所有文档不可读。（2026-08-26 实战教训）

```bash
# 逐个链接执行（ID 换成对应 wiki 节点 token）
agent-browser close --all >/dev/null 2>&1
agent-browser open "https://my.feishu.cn/wiki/<ID>"
sleep 5
agent-browser get title                      # ✅ 应为「文档名 - 飞书云文档」（不是跳登录页）
agent-browser snapshot 2>&1 | grep -c "登录/注册"    # ✅ 应 ≥1（有登录按钮 = 确认是未登录状态）
agent-browser snapshot 2>&1 | grep -cE "StaticText" # ✅ 应 >0（正文文本可见）
agent-browser snapshot 2>&1 | grep -ciE "无权限|无法访问|需要权限|拒绝" # ✅ 应为 0
```

**判定标准**：标题对 + 登录按钮≥1 + 正文段>0 + 权限提示=0 → 游客可读，通过。
**出现「跳登录」「无权限」** → 去飞书该文档的「分享」里开「互联网上获得链接的人可阅读」。

飞书链接清单（网站当前引用 11 个）：
- 作品卡：草/水/特效技术文档、千早爱音角色文档、面部SDF画法、UE角色流程文档
- 项目经历：打光笔记（上/下）、浮沉录渲染管线、浮沉录布料、自娱自乐美术技术文档

### 2.2 站内链接

```bash
agent-browser open "https://littlewolfff.github.io/cgc-ta-portfolio/"
agent-browser snapshot -i -u | grep -oE "https://[^#]+#[a-z]+"
```
**验证方法**：8 个锚点齐全：`#top #about #works #projects #experience #skills #games #contact`。逐个点击能跳到对应 section。

### 2.3 COS 资源（重点：不能「点一下就跳转下载」）

```bash
# 提取网站所有 COS 资源，批量查 HTTP 状态码
grep -ohE "https://cgc-portfolio[^\"'\\) ]+" index.html js/main.js | sort -u \
  | while read u; do curl -s -o /dev/null -w "%{http_code} $u\n" --max-time 8 "$u"; done
```
**验证方法**：
- 状态码必须全 200
- **下载检查**：抽查视频/图片的响应头，**不能有 `Content-Disposition: attachment`**（有 = 点击会下载）
  ```bash
  curl -sI "https://cgc-portfolio-.../xxx.mp4" | grep -iE "content-type|content-disposition"
  # 视频应 video/mp4，图片应 image/webp，均无 attachment
  ```
- ⚠️ 坑：grep 会把 `data-full-imgs="url1|url2"` 的竖线 `|` 带进 URL 造成**假 404**，核对时看实际引用路径。

### 2.4 外部链接
- B站 / 知乎 / 小红书 个人主页 → 浏览器打开能正常访问
- 简历 PDF：`curl -sI "…/assets/简历.pdf"` → `200` + `application/pdf` + 无 attachment（浏览器内预览，不是下载）

---

## 三、内容展示检查

- [ ] 7 大模块齐全：关于个人 / 作品展示 / 项目经历 / 工作经历 / 专业技能 / 游戏经历 / 联系方式
  ```bash
  agent-browser snapshot | grep -oE "(关于个人|作品展示|项目经历|工作经历|专业技能|游戏经历|联系方式)" | sort -u
  ```
- [ ] Hero 有「名字 · 27届」+ 一句话介绍
- [ ] 作品卡 hover / 点击正常，视频有 poster 封面
- [ ] 简历 PDF 点击后**浏览器内预览**，不是下载
- [ ] **无 `{{link}}` 占位符残留**（formatDesc 没渲染成功会显示原文）
  ```bash
  agent-browser snapshot | grep -iE "\{\{link|undefined|NaN|404|Uncaught"
  ```
- [ ] 无占位图/裂图（灰块），封面图全配齐
- [ ] 无错别字、无「（待补）」「xxx」草稿痕迹

---

## 四、部署与缓存

- [ ] GitHub Pages 部署完成（push 后 1-2 分钟）
- [ ] COS 图片覆盖同名后浏览器会缓存旧图 → URL 加 `?v=2` 绕缓存
- [ ] 网页强刷（Ctrl+F5）确认看到最新版

---

## 五、面试官视角抽查

- [ ] 打开速度可接受
- [ ] 首屏看到「名字 + 27届 + 一句话」，不用滚动
- [ ] 最有分量的内容（作品视频、技术文档）1-2 次点击内可达
- [ ] 联系方式明显（复制按钮可用）

---

## 检查记录

| 日期 | 检查项 | 结果 | 修复 |
|------|--------|------|------|
| 2026-08-26 | 一、Git 推送 | ✅ a1ce3eb 已推送，工作区干净 | 无 |
| 2026-08-26 | 二.1 飞书 11 链接游客可读 | ✅ 全部标题+正文可读，无权限墙 | 无 |
| 2026-08-26 | 二.2 站内 8 锚点 | ✅ 齐全 | 无 |
| 2026-08-26 | 二.3 COS 资源 | ✅ 视频8+图片46 全 200，无 attachment 下载头 | 无 |
| 2026-08-26 | 二.4 外部链接 + 简历PDF | ✅ B站/知乎/小红书可访问；PDF 200+application/pdf 预览 | 无 |
| 2026-08-26 | 三、内容展示 | ✅ 7模块+27届+无{{link}}残留+无裂图 | 无 |
