---
title: Vue生命周期
date: 2019-12-03 17:41:48
tags:
	- 框架
	- 知识点
	- 笔记
categories: Vue
---

## Vue生命周期

> 一个vue的实例在它创建到销毁的一系列过程，就叫做生命周期

## 钩子函数

> 在vue实例的生命周期中，某个特定的时刻会自动触发的函数，就叫做生命周期的钩子函数

**注意**：

> Ajax请求并不是要在特定的钩子函数才能请求，因为异步原因，在任意挂载阶段请求都可以
>
> Ajax最后都会在挂载阶段完成后请求成功   放在created钩子函数中可以更加的便于逻辑理解 
>
> 更新阶段在页面数据进行变化，钩子函数才会执行

## 分为三个阶段

#### 挂载阶段

1. beforeCreate
2. created
3. beforeMount
4. mounted

#### 更新阶段

5. beforeUpdate
6. updated

####  销毁阶段

7. beforeDestroy
8. destroyed

---



1. **beforeCreate**---------实例创建之前														

	- 拿不到数据与方法

	- 拿不到真实的dom对象：this.$el

```vue
<template> <div>   <h1 id="box">{{ msg }}</h1>   </div>   </template>
<script>
    export default {
    data() {
      return {msg: "Hello"};
    },   
	beforeCreate() {
      	console.log("实例创建之前------------");
      	console.log(this.msg); //数据 undefined
      	console.log(this.$el); //DOM对象 undefined
    }
```

2. **created**--------------实例创建完成

	- 拿不到真实的dom对象：this.$el

	- 可以拿到数据和方法（Ajax请求）

	- 调用方法，发送异步请求等等

```js
 created() {
      console.log("实例创建完成------------");
      console.log(this.msg); // hello   可以获取数据和方法（发送ajax请求效率最高）
      console.log(this.$el); // undefined
    }
```

3. **beforeMount**----------实例挂载之前

   - 拿不到真实的dom对象：this.$el

   ```js
    beforeMount() {
         console.log("实例挂载之前------------");
         console.log(this.msg); // hello
         console.log(this.$el); //undefined
       }
   ```

4. **mounted**-------------实例挂载完成

   - 可以拿到真实的dom对象：this.$el  

   - 调用方法，发送异步请求等等

   ```js
     mounted() {
         console.log("实例挂载完成------------");
         console.log(this.msg);
         console.log(this.$el); //<div>...</div> 可以获取dom对象
       }
   ```

5. **beforeUpdate**-----------实例更新之前

   - 获取当前数据的时候是旧数据

6. **updated**------------------实例更新完成

   - 数据更新完成，真实dom也更新完成

7. **beforeDestroy**-------------实例销毁之前

   - 清除定时器
   - 清除全局绑定的滚动条事件
	
8. **destroyed**---------------实例销毁完成