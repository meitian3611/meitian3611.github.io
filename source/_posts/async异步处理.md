---
title: "async异步处理"
date: 2021-04-09 06:12:42
tags:
  - 知识点
  - 笔记
  - 异步
source: https://meitian3611.github.io/2021/04/09/async异步处理/
---

## vue中异步函数async和await的用法

### 什么场景需要使用

> 很多时候有很多需求，需要依次调用多个后台接口，并且后一个接口需要依赖前一个接口的响应结果，如果上一个接口挂了，后一个接口也就不需要调用了。

### 举例说明

需求：获取用户信息，由于数据涉及用户隐私，信息分为三个接口： userOne，userTwo，userThree

> 第一层：通过入参id获取 userOne 接口中的 姓名，性别， 年龄， 以及 user\_id
>
> 第二层：根据第一层的 user\_id 请求 userTwo 接口中的 手机号，生日，微信号，QQ号，以及 user\_id
>
> 第三层：根据第二层的 user\_id 请求 userThree 接口中的 身份证号码，家庭详细地址，银行卡号

<!-- more -->

### 普通写法

```js
methods: {
    getUserOne(id) {
 // 获取第一层用户信息
 return this.$axios.get("userOne", id);
    },
    getUserTwo(user_id) {
 // 获取第二层用户信息
 return this.$axios.get("userTwo", user_id);
    },
    getUserThree(user_id) {
 // 获取第三层用户信息
 return this.$axios.get("userThree", user_id);
    },
 // 通过链式调用，实现三层嵌套逻辑
    getUserData(id) {
 this.getUserOne(id)
        .then((res) => {
 if (res.data.success && res.status == 200) {
 // 第一层数据成功获取,请求第二层数据
 this.getUserTwo(res.data.data.user_id).then((res) => {
 // 第二层数据成功获取,请求第三层数据
 this.getUserThree(res.data.data.user_id).then((res) => {
 // 成功获取用户第三层数据
              });
            });
          }
        })
        .catch((err) => {
 console.log(err);
        });
    },
}
```

> 通过这种链式调用方法，确实可以实现需求，但是从代码冗余程度，项目可维护性来看，明显十分麻烦，容易造成回调地狱。

### async await 写法

```js
methods: {    
 	getUserOne(id) {
 // 获取第一层用户信息
 return this.$axios.get("userOne", id);
    },
    getUserTwo(user_id) {
 // 获取第二层用户信息
 return this.$axios.get("userTwo", user_id);
    },
    getUserThree(user_id) {
 // 获取第三层用户信息
 return this.$axios.get("userThree", user_id);
    },
 // async await 使用
 async getUserData(id) {
 try {
 let userDataOne = await this.getUserOne(id); // 第一层
 let userDataTwo = await this.getUserTwo(userDataOne.user_id); // 第二层
 let userDataThree = await this.getUserTwo(userDataTwo.user_id); // 第三层
 console.log(userDataOne, userDataTwo, userDataThree); // 成功获取用户所有数据
 
   } catch(err) {
 console.log(err);
   }
}
}
```

- 语法特性

通过 async await 在实际项目的使用，可以得知，在调用 getUserData 函数时，它里面遇到了await, await 表示等一下，代码就暂停到这里，不再向下执行了，它等什么呢？等 await 后面的接口执行完毕，然后拿到接口返回的值并进行传递，返回值拿到之后，它继续向下执行。具体到 我们的代码, 遇到await 之后，代码就暂停执行了， 等待 getUserOne 函数执行完毕，

### 回调地狱解决

```js
methods:{
 async test() {
 // 解决回调地狱 异步处理同步化
 let one = await this.demo(10); // 20  1s
 let two = await this.demo(20); // 40  1s 等待 one 执行完毕
 let three = await this.demo(10); // 20 1s 等待 two 执行完毕
 console.log(one + two + three);  // 3s后，结果打印：80
    },
    demo(num) {
 return new Promise((resole, rej) => {
        setTimeout(() => {
          resole(2 * num);
        }, 1000);
      });
    },
}
```
