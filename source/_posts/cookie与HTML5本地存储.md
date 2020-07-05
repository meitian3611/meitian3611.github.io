---
title: cookie与HTML5本地存储
date: 2019-10-23 20:26:59
tags: 
	- 笔记
	- 知识点
categories: web前端
---

##  cookie是什么

> cookie是浏览器提供的一种机制，可以由JavaScript对其进行操作(设置、读取、删除)cookie是一种会话跟踪技术，是存储于访问者计算机中的一小块数据
>
> 会话：用户进入网站，开始浏览信息到关闭浏览器的过程，就称之为是一次会话会话跟踪技术：浏览器和服务器之间在进行多次请求间共享数据的过程，就称为会话跟踪技术



**cookie的特性**（服务端运行）

> - cookie可以实现跨页面全局变量
>- cookie可以跨越同域名下的多个网页，但不能跨域使用
> - cookie会随着HTTP请求发送给服务器
>- cookie会存储于访问者的计算机中
> - 同一个网站中所有页面共享一套cookie
>- 可以设置有效期限
> - 存储空间为4KB左右
>- **cookie过期会自动消失**



**cookie的应用场景**

>* 会话状态管理（如用户登录状态、购物车等）
>* 个性化设置（保存用户设置的样式等）
>* 浏览器行为跟踪（如跟踪分析用户行为等）



**cookie的缺点**

>1. cookie可能被禁用
>2. cookie与浏览器相关，不能互相访问
>3. cookie可能被用户删除
>4. cookie安全性不够高
>5. cookie会随着HTTP请求发送给服务器
>6. cookie存储空间很小(只有4KB左右)
>7. cookie操作麻烦，没有方便的API

---

**操作cookie**

设置cookie:

如果要改变值，则需要重新赋值

```javascript
document.cookie = "user=zhangsan";
document.cookie = "pass=123456";
```

设置有效期

```
var d = new Date();
d.setDate(d.getDate()+3); //按天数设置
document.cookie="user3=xd; expires="+d;
```

读取cookie

```
var cookies = document.cookie;
```

删除cookie:

可以将有效期设为一个已经过去的时间

```
var d=new Date();
d.setDate(d.getDate()-1);
document.cookie="user1=xh; expires="+d;
```



## HTML5本地存储

> H5本地存储有 localStorage 与 sessionStorage 两种

**优点：**

- 更大的存储空间，有5MB左右
- 不会随HTTP请求发送给服务器
- 有方便的API操作
- 移动端普及高

**操作：**

 **保存或设置数据**

`localStorage.setItem(key , value)` 

如果key已经存在，则覆盖key对应的value

如果不存在则添加key与value



  **获取key对应的value**

`localStorage.getItem(key)`



  **获取指定下标位置的key**

`localStorage.key(index)`



**获取数据条数（长度）**

`localStorage.length`



----

```
localStorage.clear() 将同域名下的所有数据都清空

localStorage.removeItem('key') 删除某个键值对

sessionStorage 为临时性保存数据，当页面关闭就会消失
sessionStorage 不能跨页面访问，只局限在当前的标签页
sessionStorage 各种操作与 localStorage 一样
```



## JSON转换

> 目前 JavaScript 使用非常多的 json 格式
>
> 可以使用 JSON.stringify() 将 json对象 转为 json字符串
>
> 然后把 json字符串 存储在 cookie 或 localStorage 里面
>
> 读取出来以后使用 JSON.parse() 将 json字符串 转为 json对象

```javascript
var jsonObj = {"name1":"jack","name2":"lily"};
localStorage.setItem("user",JSON.stringify(jsonObj)); // 存储

var jsonObj = JSON.parse(localStorage.getItem("user")); // 读取
```

