---
title: Express框架
date: 2019-11-19 19:06:13
tags:
	- node
	- 框架
	- 知识点
categories: nodeJS
---

## nodejs express框架

>  基于 Node.js 平台，快速、开放、极简的 Web 开发框架 。 

### 快速搭建express框架环境

1. 创建一个项目
2. 初始化 生成package.json    `npm init -y`
3. 下载安装这个项目的依赖模块  `npm install --save express`
4. 创建一个js文件，开始写代码

```js
// 1. 引入 express
const express = require('express')

// 2. 生成 express 的实例
const server = express()

// 3. 处理路由等等 (路由的概念，就是不同的url地址需要有不同的响应)

// http://localhost:8080    -> hello express
server.get('/', (req, res) => {
  res.send('hello express')
})

// http://localhost:8080/login  -> 登录
server.get('/login', (req, res) => {
  res.send('登录页面')
})

// 4. 监听端口
server.listen(8080)

```

### Request

-  **req.query**：获取URL的查询参数串 
-  **req.body**: 获取请求主体（post数据，需要设置中间件函数 json与urlencode） 

```js
//让代码支持 req.body 需要下面两行代码
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
```

-  **req.cookies**：获取Cookies (需要使用 cookie-parser 中间件) 

```js
//引入
const express = require('express')
const server = express()
const cookieParser = require('cookie-parser')//引入第三方中间件
//让代码支持req.cookie属性 需要使用cookie-parser 中间件
//1. 安装 cookie-parser 中间件
// 当前文件 npm install --save cookie-parser
//2. 在当前文件引入
//3. 使用express 实例的 use方法使用它
server.use(cookieParser())
```

-  **req.params**：获取路由的动态参数

```js
// http://localhost:8080/hello/张三
// http://localhost:8080/hello/李四
server.get('/hello/:name', (req, res) => {
    console.log(req.params)
    res.send(`欢迎 - ${req.params.name}`)
})
```

-  req.path：获取请求路径
-  req.hostname / req.ip：获取主机名和IP地址  
-  req.protocol：获取协议类型 
-  req.get()：获取指定的HTTP请求头 



### Response

-  res.set()：设置HTTP头，传入object可以一次设置多个头 
-  res.status()：设置HTTP状态码 
-  res.send()：传送HTTP响应 
-  res.redirect()：设置响应的Location HTTP头，并且设置状态码302 
-  res.json()：传送JSON响应 
-  res.cookie(name，value [，option])：设置Cookie 
-  res.clearCookie()：清除Cookie 
-  res.download()：传送指定路径的文件 
-  res.sendFile(path [，options] [，fn])：传送指定路径的文件 -会自动根据文件extension设定Content-Type 

```js
//__dirname 获取当前文件路径
server.get('/hello.html', (req, res) => {
    res.sendFile(path.resolve(__dirname,'./hello.html')) //必须是绝对路径
 })
```



-  res.render(view [, locals] [, callback]) 渲染一个view 



### EJS模板引擎

> 模板引擎的作用，就是将静态html页面给弄活。访问一个url地址，浏览器渲染出来的是html的内容。但是不是直接输出一个静态的html页面。而是后端在输出之前会将一个静态的html页面模板与数据先拼接。然后再输出。

1. 新建项目

2. 项目初始化 npm init  -y

3. 安装项目依赖

   1. express

   2. ejs

npm install --save express ejs

4. 开始写代码

   1. 需要通过 express 的实例的 set('view engine', 'xxx') 来设置当前项目使用哪种模板引擎

      ```js
      server.set('view engine', 'ejs')
      ```

   2. 需要通过 express 的实例的 set('views', 'xxx') 来设置当前项目中模板页面的存放路径

      ```js
      server.set('views', path.resolve(__dirname, './views'))
      ```

   3. 后续需要渲染模板页面的地方，就可以使用 res.render() 来操作

      ```js
      server.get('/hello/:name', (req, res) => {
          //res.render('模板页面文字'，'需要传递到这个页面的数据')
          res.render('welcome', {
              name: req.params.name,
              isLogin: false,//是否登录
              frusts: [
                  { name: 'xiaozhang' },
                  { name: 'xiaowang' },
                  { name: 'xiaohong' }
              ]
          })
      })
      ```

### EJS模板引擎常用标签

1.  <% %> 流程控制标签 
2.  **<%= %>** 输出标签 (会对 HTML 代码转义) 
3.  **<%- %>** 输出标签 (不对 HTML 代码转义) 
4.  <%# %> 注释标签 

创建一个.ejs文件使用以下语法

```html
<body>
    <h1>欢迎，<%= name %> </h1>
  <% if (isLogin) { %>
  <button>退出登录</button>
  <% } else { %>
  <button>登录</button>
  <% } %>
  <ul>
    <% for (var i = 0; i < frusts.length; i++) { %>
    <li><%= frusts[i].name %></li>
    <% } %>
  </ul>
  <!-- include() 引入公用模板 -->
  <%- include('./common/footer.ejs') %>
</body>  
```