---
title: Promise
date: 2019-10-24 21:43:01
tags:
	- 笔记
	- 知识点
categories: web前端
---

## Promise

> Promise 是ES6对异步编程的一种解决方案，比传统的解决方案（回调函数和事件）更合理更强大。
>
> Promise 简单说就是一个容器，里面保存着一个尚未完成且预计在未来完成的异步操作。
>
> Promise 是一个构造函数，用来创建一个Promise对象。
>
> 有了Promise对象，就可以将**异步操作以同步操作的流程表达出来**，避免了层层嵌套的回调函数。



### Promise对象代表一个异步操作，有三种状态：

- pending（进行中）
- fulfilled（已成功）
- rejected（已失败）

### Promise 对象的状态改变有两种：

从 pending 变为 fulfilled

从 pending 变为 rejected

----

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。

resolve 和 reject 是两个函数，由 JavaScript 引擎提供，不用自己部署。

```javascript
var p = new Promise(function(resolve, reject) {
  // do something ...
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

**resolve** 函数的作用是，将Promise对象的状态从“进行中”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。

**reject** 函数的作用是，将Promise对象的状态从“进行中”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

****

### then和catch

```javascript
p1.then(function(value){
    //成功执行的函数（resolve）
    console.log(value)
    
},function(rej){
    //失败执行的函数（reject）
    console.log(rej)
    
}).catch(function(err){
    console.log(err)
    //捕获报错信息
})
```

**then**有两个参数，一个是成功后的回调函数，另一个是失败后的回调函数

**catch**是一个用于指定发生错误的回调函数，将报错信息捕获

### 使用Promise解决定时器嵌套问题

```javascript
//封装一个Promise的定时器函数 
function getPromise(msg, time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(msg);
                resolve();
            }, time)
        });
    }
//利用getPromise函数同步执行
//结果为： 一 二 三 完成
    getPromise('第一个任务', 1000)
        .then(function () {
            return getPromise('第二个任务', 2000)
        })
        .then(function () {
            return getPromise('第三个任务', 3000)
        })
        .then(function () {
            return getPromise('完成', 4000)
        })

```

