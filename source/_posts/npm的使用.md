---
title: npm的使用
date: 2019-10-30 19:04:26
tags:
	- npm
	- 笔记
	- 操作指令
categories: 项目相关
---

**NPM是随同NodeJS一起安装的包管理工具，包的结构使您能够轻松跟踪依赖项和版本。**

> NPM能解决NodeJS代码部署上的很多问题，常见的使用场景有以下几种：
>
> 允许用户从NPM服务器下载别人编写的第三方包到本地使用。
>
> 允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用。
>
> 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

**项目初始化：** package.json 配置文件

`$ npm init -y  跳过所有提问`

**安装包**

本地安装 `$ npm install 包名`

全局安装`$ npm install 包名 -global`

缩写形式`$ npm i 包名 -g`

**项目依赖**

 `$ npm install 包名 -save`

项目上线需要用到的包，缩写` $ npm install 包名 -S (大写)`

**开发依赖**

`$ npm install 包名 --save-dev`

开发测试需要用到的包，缩写 `$ npm install 包名 -D (大写)`

**移除依赖模块**

`$ npm uninstall 包名 -save`

`$ npm uninstall 包名 --save-dev`

**清除缓存数据**

`npm cache verify`