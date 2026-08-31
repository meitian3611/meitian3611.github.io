---
title: Fuwari 使用指南
published: 2026-08-28
description: "如何使用这个博客模板。"
image: "./cover.jpeg"
tags: ["Fuwari", "博客", "教程"]
category: Examples
draft: false
---

> 封面图来源：[来源](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

这个博客模板基于 [Astro](https://astro.build/) 构建。本指南未涉及的内容，可以在 [Astro 官方文档](https://docs.astro.build/) 中找到答案。

## Frontmatter（文章头信息）

每篇文章开头用 `---` 包裹一段 YAML 配置。可用字段：

| 字段 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | 是 | — | 文章标题 |
| `published` | 是 | — | 发布日期，格式 `YYYY-MM-DD` |
| `updated` | 否 | — | 更新日期 |
| `description` | 否 | `""` | 摘要，用于卡片和 SEO |
| `image` | 否 | `""` | 文章封面图路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：使用 `public` 目录中的图片<br/>3. 无以上前缀：相对于 markdown 文件 | |
| `tags` | 否 | `[]` | 标签列表，如 `[Vue, Pinia]` |
| `category` | 否 | `""` | 分类 |
| `lang` | 否 | `""` | 语言 |
| `draft` | 否 | `false` | 设为 `true` 时生产构建不发布 |

```yaml
---
title: 我的第一篇博客
published: 2023-09-09
description: 这是我的新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [Foo, Bar]
category: 前端
draft: false
---

```

## 本站扩展语法

### 告示块（Admonition）

支持 `note` `tip` `important` `warning` `caution` 五种类型。写法是**四个冒号** + 类型名，用 `::::` 闭合：

::::note
一般提示：读者了解即可。
::::

::::tip
小技巧：能让文章更易读。
::::

::::important
关键信息：写作时容易踩坑的地方。
::::

::::warning
警告：需要注意的风险。
::::

::::caution
严重警告：可能带来负面后果。
::::

源码写法：

```markdown
::::note
一般提示：读者了解即可。
::::

::::tip
小技巧：能让文章更易读。
::::
```

**自定义标题**：把标题写在类型名后面的方括号里。

::::note[自定义标题]
这是带自定义标题的提示块。
::::

```markdown
::::note[自定义标题]
这是带自定义标题的提示块。
::::
```

**GitHub 风格也兼容**（`> [!类型]`）：

> [!NOTE]
> 这是 GitHub 风格的提示。

```markdown
> [!NOTE]
> 这是 GitHub 风格的提示。

> [!TIP]
> GitHub 风格的技巧提示。
```

### GitHub 仓库卡片

下面这张卡片会从 GitHub API 拉取仓库信息：


::github{repo="meitian3611/meitian3611.github.io"}

写法是**两个冒号** + `github` + `repo` 属性：

```markdown
::github{repo="owner/repo"}
```

### 剧透（Spoiler）

用 `:spoiler[内容]` 隐藏文字，悬停才显示，内部支持 Markdown：

这句话里有一个 :spoiler[隐藏的**彩蛋**]！

```markdown
这句话里有一个 :spoiler[隐藏的**彩蛋**]！
```


### 指令（Directive）冒号数量一览

本站的扩展语法本质都是"指令"，冒号数量决定类型：

| 写法 | 类型 | 本站用途 |
| --- | --- | --- |
| `:spoiler[...]` | 单冒号 · 行内指令 | 剧透 |
| `::github{...}` | 双冒号 · 叶指令 | GitHub 卡片 |
| `::::note ... ::::` | 四冒号 · 容器指令 | 告示块 |

## 其他实用特性

### 首段自动摘要

**文章的第一段会被自动提取为摘要**（`remark-excerpt`），显示在首页和归档的文章卡片上。如果 frontmatter 里写了 `description`，则优先显示 `description`。

所以写作时注意：

- 第一段尽量是一句完整、有信息量的话，别写"你好，这是一篇……"之类的水话；
- 想让卡片展示指定文案，就在 frontmatter 里写 `description`。

### 标题锚点（页面内跳转）

每个标题都会自动生成 `id` 并附带一个 `#` 锚点图标（悬停可见）。可以用普通链接做页面内跳转：

```markdown
[跳转到"其他实用特性"](#其他实用特性)
```

> 锚点规则：中文标题保留中文，空格转成连字符。直接复制浏览器地址栏里标题旁边的 `#xxx` 最稳妥。

### 原始 HTML

Markdown 中可以直接嵌入 HTML 标签，适合标准语法表达不了的需求，例如：

```html
<kbd>Ctrl</kbd> + <kbd>C</kbd>

<details>
<summary>点击展开</summary>
隐藏的细节内容。
</details>
```
<kbd>Ctrl</kbd> + <kbd>C</kbd>

<details>
<summary>点击展开</summary>
隐藏的细节内容。
</details>

也可以给链接加 `target="_blank"`（见上文"让链接新窗口打开"）。

## 写作小贴士

- 标题层级从 `##` 开始，避免和文章大标题冲突。
- 代码块记得写语言标识（`js`、`ts`、`vue`、`bash` 等）。
- 多用 `::::tip` 和 `::::warning` 提升阅读体验。
- 写完运行 `pnpm astro check` 检查类型，`pnpm dev` 本地预览。


## 在文章中嵌入视频

从 YouTube、哔哩哔哩等平台复制视频的嵌入代码，直接粘贴到 markdown 文件中即可。

```yaml
---
title: 在文章中嵌入视频
published: 2023-10-19
// ...
---

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
```

### YouTube

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### 哔哩哔哩

<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>


