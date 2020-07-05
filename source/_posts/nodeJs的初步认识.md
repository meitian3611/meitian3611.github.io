---
title: Node.js的初步认识
date: 2019-10-29 20:48:23
tags: 
	- 笔记
	- node
	- 知识点
categories: nodeJS
---

## Node.js简介

> Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
>
> Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。
>
> 简单的说 Node.js 就是运行在服务端的 JavaScript
>
> Node.js是一个让JavaScript运行在服务器端的开发平台，它让JavaScript的触角伸到了服务器端，可以与PHP、JSP、Python、Ruby平起平坐。

**node.js三大特点：**

**1.单线程**

> Node.js不为每个客户连接创建一个新的线程，而仅仅使用一个线程。当有用户连接了，就触发一个内部事件，通过非阻塞I/O、事件驱动机制，让Node.js程序宏观上也是并行的。使用Node.js，一个8GB内存的服务器，可以同时处理超过4万用户的连接。

**2.非阻塞I/O(异步)**

> 阻塞模式下，一个线程只能处理一项任务，要想提高吞吐量必须通过多线程。而非阻塞模式下，一个线程永远在执行计算操作，这个线程的CPU核心利用率永远是100%。
>
> 这是一种特别有哲理的解决方案：**与其人多，但是好多人闲着；还不如一个人玩命，往死里干活儿。**

**3.事件驱动**

> 在Node中，客户端请求建立连接，提交数据等行为，会触发相应的事件。在Node中，在一个时刻，只能执行一个事件回调函数，但是在执行一个事件回调函数的中途，可以转而处理其他事件（比如，又有新用户连接了），然后返回继续执行原事件的回调函数，这种处理机制，称为“事件循环”机制。
>
> 用事件驱动来完成服务器的任务调度，用一个线程，担负起了处理非常多的任务的使命。

## 搭建web服务器

**总共分为四个步骤**

1. 加载http模块    

2. 创建http服务    
3. 服务端对象监听request 请求事件，用于监听客户端的请求    
4. 启动http服务，监听端口

**参考代码：**

```javascript
var http = require('http');		 //加载http模块

var server = http.createServer();//创建http服务

server.on('request',function (req, res) { //服务对象监听request 请求事件，用于监听客户端的请求
  //req-请求对象 , res-响应对象
  //处理客户端请求逻辑
  console.log('收到请求: '+ req.url); //用户请求地址
  res.setHeader("Content-type","text/plain;charset=utf-8"); //设置文件类型
  res.end(); //必须结束响应，否则浏览器会被挂起
});

server.listen(3000, function () { //启动http服务，开始监听3000端口
  console.log('服务已经启动，请访问： http://localhost:3000 或 http://127.0.0.1:3000');
});
```

**注意点：**

1. 在监听request事件中，最后一定要res.end()结束响应。
2. 浏览器显示中文可能是乱码，需设置响应头告诉浏览器显示时所使用的编码，要在res.end()之前设置

```javascript
res.setHeader("Content-type","text/plain;charset=utf-8"); // 响应为纯文本
res.setHeader("Content-type","text/html;charset=utf-8");  //响应为html文本
```

3. **node.js没有根目录、没有web容器的概念！**



## node.js读写文件

**读文件**

`fs.readFile(file[, options], callback)`

* 参数1：要读取的文件路径，必填。   
* 参数2：读取文件时的选项，比如：文件编码utf8。选填。 
* 参数3：文件读取完毕后的回调函数，必填。

**注意点：**

* 该操作采用异步执行    
*  回调函数有两个参数，分别是err和data    
* 如果读取文件时没有指定编码，返回的是二进制数据，如指定编码utf8，会返回指定的编码数据。    
* 只要异步操作，回调函数第一个都是错误对象err优先

**示例：**

```javascript
//加载http包(nodeJS内置包)
let http = require("http");
//创建服务器  
let server = http.createServer()
let fs = require('fs'); //引入内部模块
//监听服务器的请求状态(用户发送请求触发)
server.on('request', function (req, res) {
    console.log('用户发送了请求');
    if (req.url == '/heihei') {//地址可以自定义
        fs.readFile('./home.html', 'utf-8', function (err, data) {
            if (!err) {
                res.setHeader('Content-type', 'text/html;charset=utf-8');
                res.end(data);
            }
        })
    }else {
        res.writeHead(404, { 'Content-type': 'text/plain;charset=utf-8' });
        res.end('404,页面丢失了！！！');
    }
})
//启动服务，监听端口 ip地址 回调函数
server.listen("3000", "10.36.147.180", function () {
    console.log('服务已启动，请访问：10.36.147.180:3000');
})
```

**写文件**

`fs.writeFile(file, data[, options], callback);`

- 参数1：要写入的文件路径，必填
- 参数2：要写入的数据，必填
- 参数3：写入文件时的选项，比如：文件编码
- 参数4：文件写入完毕后的回调函数，必填

**注意点：**

* 该操作采用异步执行    
*  如果文件存在则替换原内容    
*  默认写入的文件编码为utf8    
*  回调函数有1个参数：err，表示在写入文件的操作过程中是否出错了。    
*  如果出错了err != null，成功时 err === null    
*  写入文件（文件不存在则自动创建）

writeFile写入文件是先把文件内容清空再写入，如果要追加写入的话可以使用appendFile函数

**示例：**

```javascript
//加载http包(nodeJS内置包)
var http = require("http");
var fs = require('fs'); //引入内部模块
 
var server = http.createServer(function(req,res){
    //给用户生成一个id
    var userid = parseInt(Math.radom()*89999)+10000;
    console.log('用户'+userid);
    res.writeHead(200,{"Content-Type":"text/html;charset=UTF8"});
    var str = '新修改的文字';
    //参数一是当前文件路径 参数二是写入数据
    //参数三是文件编码	  参数四是回调函数
    fs.writeFile("./test.txt",str,'utf8',function(err){
       if(err){
           throw err;
       } 
        console.log('文件写入完成');
        res.end();
    })
})
server.listen("3002", "10.36.147.180", function () {
    console.log('服务已启动，请访问：10.36.147.180:3002');
})
```

