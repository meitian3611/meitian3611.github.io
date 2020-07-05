---
title: Hexo搭建博客
date: 2019-10-19 16:43:25
tags:
	- hexo
	- 语法
	- 博客
categories: 技术文档
---

> 使用Hexo快速搭建一个自己的专属博客
>
> 搭建要求：node.js，git bash, github仓库
>
> 很多命令既可以用Windows的cmd来完成，也可以使用git bash来完成，但是部分命令会有一些问题，为避免不必要的问题，建议全部使用git bash来执行；

**安装之前的准备**

> - 有一个github账号，这是必要的
>
> - 安装了node.js  npm  并且了解基本终端指令
> - 最好有一个git bash



**开始安装hexo**

```bash
$ npm install -g hexo
```

**初始化**

在电脑任意地方新建一个文件夹，用于存放博客文件

找到当前文件夹的地址进行初始化

```bash
$ hexo init
```

**生成文件**

```bash
$ hexo new "新文档"
```

**生成静态文件**

```bash
$ hexo generate
```

**发送到本地端口服务器**

```bash
$ hexo server
```

此时已经生成了本地端口号，默认都是localhost:4000

输入端口，成功后会出现一个默认的博客页面

**部署网站**

将博客部署到github上面，以后就可以通过github域名查看博客

```bash
$ hexo deploy
```

**清除缓存和已生成的静态文件**

```bash
$ hexo clean
```

**ERROR Deployer not found: git 解决方法**

```bash
npm install --save hexo-deployer-git
```

