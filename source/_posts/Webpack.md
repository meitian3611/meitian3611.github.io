---
title: Webpack
date: 2019-12-17 09:07:13
tags:
	- 构建工具
	- 知识点
	- 项目必备
categories: 项目相关
---

## webpack

> 现代化前端最流行的一款 构建打包工具

### webpack 打包构建原理

> 基于某个入口文件，分析这个文件中的依赖，接着继续向下寻找依赖所属的依赖
>
> 循环往复，直到没有依赖为止，最后进行打包处理

### webpack 核心

1. entry（入口）
2. output（出口）
3. loader（转换器）

>  webpack 将依赖都看成是一个一个的模块。但是默认情况只能识别 js与json 两种格式的模块。如果想要打包图片、样式等资源的话，就需要相应的loader转换器来进行转换操作，转换之后webpack才能识别。

4. plugins（插件）

> 有一些操作转换器也实现不了，这时就可以交给插件来实现。比如说要将某个文件直接复制到出口文件里面等操作。

5. mode（打包模式 4.x 版本之后提供）开发 | 生产

### webpack简易搭建流程

> 新建文件  `mkdir webpack-demo`

> 初始化  `npm init -y`

> 安装开发依赖  `npm install -D webpack webpack-cli`

> 三种运行方式:
>
> - `./node_modules/.bin/webpack`
> - `npx webpack`
> - `npm run build`（ 在 package.json 文件中修改运行命令即可 ）
>
> ```json
> "scripts": {
>  "build": "webpack"
> },
> ```

更多详细操作流程可以查看 [官 网](https://www.webpackjs.com/guides/installation/ )

#### 入口 & 出口

```js
module.exports = {
  // 入口
  entry: "./src/index.js",
  // 出口
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
}
```

------

### 常用插件

#### 自动生成 dist /  index.html

1. 安装插件

```bash
npm install --save-dev html-webpack-plugin
```

2. 配置插件 --- webpack.config.js

```js
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin") // 引入
plugins: [
  new HtmlWebpackPlugin({
    // 可以传递一个template选项，来控制使用哪个模板页面来生成
    template: path.resolve(__dirname, './public/index.html')
  })
]
```

#### 将public文件夹内容全部拷贝至 dist 出口文件夹

1. 安装插件

```bash
npm install --save-dev copy-webpack-plugin
```

2. 配置插件 ---  webpack.config.js

```js
const CopyWebpackPlugin = require("copy-webpack-plugin") // 引入
plugins: [
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, './public')
    }
  ])
]
```

### 常用转换器

#### 引入css样式

> 需要两个转换器：style-loader | css-loader

> css-loader: 将css文件转换成 webpack 能够识别的模块文件

> style-loader: 将css写入到html页面的style标签中

1. 安装转换器

```bash
npm install -D style-loader css-loader
```

2. 配置转换器规则  ---  webpack.config.js

```js
 module: {
    // 填写转换器的配置，规则
    rules: [
      {
        test: /\.css$/,
        // 多个转换器使用时，需要按照倒序的写法
        use: ['style-loader', 'css-loader']
      }
    ]
  },
```

#### 引入scss样式

> 除了上面两个转换器，还需要额外安装两个转换器

1. 安装转换器

```bash
npm install -D sass-loader node-sass
```

2. 配置路由器规则   ---   webpack.config.js

```js
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
```

**引入图片**

> 图片也需要使用模块的方式将其引入

1. 安装转换器

```bash
npm install -D url-loader
```

2. 配置并引入   ---   src/ index.js

```js
import Icon from './assets/1.jpg' // 引入图片
function component() {
  var element = document.createElement("div")
  var myIcon = new Image()
  myIcon.src = Icon
  element.appendChild(myIcon)
  return element
}
document.body.appendChild(component())
```

```js
// -- webpack.config.js
{
    test: /\.(png|jpg|gif)$/,
    use: ["file-loader"]
}
```