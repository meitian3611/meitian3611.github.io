---
title: "Vue国际化"
date: 2021-03-27 06:54:30
tags:
  - 插件
  - 实用
source: https://meitian3611.github.io/2021/03/27/vue国际化/
---

## vue-i18n

> vue-i18n是一款针对Vue.js 的国际化插件

### 安装&配置

- npm install vue-i18n
- main.js 文件

```js
import VueI18n from 'vue-i18n' // 引入VueI18n 

import { cn } from './static/lang/cn' // 引入lang文件
import { en } from './static/lang/en'

const i18n = new VueI18n({
  locale: 'en',   // 设置语言
  messages: {
    cn: { ...cn },
    en: { ...en }
  }
})

Vue.use(VueI18n)     // 使用VueI18n

new Vue({
  router,
  store,
  i18n,     // 挂载
  render: h => h(App)
}).$mount('#app')
```

<!-- more -->

- 在主目录 scr 下增加 lang 文件夹，例如 zh-CN.json , en-US.josn

```json
// src/lang/zh-CN.json
{
 "content":{
 "text":"你好"
    }
}

// src/lang/en-US.json
{
 "content":{
 "text":"hello"
    }
}
```

### 使用

- 配置文件创建完成后，就可以在任意一个组件下格式化数据

```js
<div>{{$t('content.text')}}</div>
```

- 后续可以通过下拉选择框来进行语言切换

```js
changeLang () {
 const temp = this.$i18n.locale
 if (temp === 'cn') {
 this.$i18n.locale = 'en'
      } else {
 this.$i18n.locale = 'cn'
      }
    }
```

### vsCode 实用插件

> 综上所诉，可以简单的处理一系列国际化需求，但是随着项目体积的增大，后期维护工作量会逐渐增大，
>
> 这时可以使用 vsCode 相关插件来代替手动配置语言包，并且加入了相关的文案提示功能

#### vue i18n

- 配置

  安装完成后： 首先打开命令面板或者ctrl+shift+p输入 vue-i18n配置语言包路径 src/lang 即可
- 使用

  选中需要国际化的文字： 使用快捷键 ctrl + > 触发插件，一键生成语言包配置，输入对应的中英文即可。

[查看插件详情](https://marketplace.visualstudio.com/items?itemName=think2011.vue-i18n)
