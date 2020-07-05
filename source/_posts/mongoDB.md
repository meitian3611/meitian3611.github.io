---
title: mongoDB
date: 2019-11-20 21:18:35
tags:
	- 框架
	- 数据库
categories: 后端
---

## mongoDB

>  MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。 

## MongoDB - 集合

-  集合就是MongoDB的文档集合。类型于关系型数据库中的**表格**。 
-  集合存在于数据库中，集合没有固定的结构，这意味着你在对集合可以插入不同格式和类型的数据，但通常情况下我们插入集合的数据都会有一定的关联性。 

示例：

```js
{"genres": ["犯罪", "剧情"], "title": "肖申克的救赎"}
{"genres": ["搞笑", "无聊"], "title": "李茶的姑妈"}
{"genres": ["好看"], "title": "无双", "stars": 9}
```

## MongoDB - 数据库常用命令

- 创建/切换数据库

```powershell
use [数据库名]
```

- 显示所有数据库

```powershell
show dbs
```

- 查看当前所在数据库

```shell
db
```

- 显示当前DB状态

```shell
db.stats()
```

- 查看当前DB版本

```powershell
db.version
```

- 删除当前数据库

```shell
db.dropDatabase
```

## MongoDB - 集合常用命令 - 添加

-  save 
-  insertOne 
-  insertMany 

```shell
db.users.save({name: '张三', age: 16});

db.users.insertOne({name: '张三', age: 18});

db.users.insertMany([{name: '李四', age: 19}, {name: '王五', age: 20}]);
```

## MongoDB - 集合常用命令 - 修改

-  save 传入 _id 时，可作为更新操作。 
-  update 

-  updateOne 
-  updateMany 

```shell
db.users.update({age: 25}, {$set: {name: 'changeName'}});
// update users set name = 'changeName' where age = 25;
db.users.update({name: 'lisi'}, {$inc: {age: 50}});
// update users set age = age + 50  where name = 'lisi';
db.users.update({name: 'lisi'}, {$inc: {age: 50}, $set: {name: 'hoho'}});
// update users set age = age + 50, name = 'hoho' where name = 'lisi';
```

## MongoDB - 集合常用命令 - 删除

-  remove 
-  deleteOne 
-  deleteMany 

## MongoDB - 集合常用命令 - 查询

- 查询所有记录

```js
db.users.find()
// select * from users
```

- 查询筛选

```js
db.users.find({'age': 22});					查询 age = 22 的记录 

db.users.find({'age': {$gt: 22}});			查询 age > 22 的记录 

db.users.find({'age': {$lt: 22}});			查询 age < 22 的记录 

db.users.find({'age': {$gte: 22}});			查询 age >= 22 的记录 

db.users.find({'age': {$lte: 22}});			查询 age <= 22 的记录 

db.users.find({'age': {$ne: 22}});			查询 age != 22 的记录 

db.users.find({'age': {$gte: 23, $lte: 26}});查询 age >= 23 并且 age <= 26 

db.users.find({$or: [{age: {$gte: 23}}, {name: '张三'}]);查询 age >= 23 或者 name == '张三' 
```

-  查询 name 中包含 mongo 的数据 

```shell
db.users.find({'name': /mongo/});
// select * from users where name like %mongo%;
```

-  查询 name 中已 mongo 开头的数据 

```shell
db.users.find({'name': /^mongo/});
// select * from users where name like 'mongo%';
```

-  查询 name 中已 mongo 结尾的数据 

```shell
db.users.find({'name': /mongo$/});
// select * from users where name like 'mongo%';
```

- 查询 指定列 name 、age 的数据

```shell
db.users.find({}, {name: 1, age: 1});
// select name, age from users;
```

-  查询 指定列 name 、age 并且 age > 25 

```shell
db.users.find({age: {$gt: 25}}, {name: 1, age: 1});
// select name, age from users where age > 25;
```

-  升序 

```shell
db.users.find().sort({age: 1});
```

-  倒序 

```shell
db.users.find().sort({age: -1});
```

-  查询 name = zhangsan , age = 20 的数据 

```shell
db.users.find({name: '张三', age: 20});
// select * from users where name='zhangsan' and age='20';
```

-  查询 前5条数据 

```shell
db.users.find().limit(5);
// select top 5 * from users;
```

-  查询 10条以后的数据 

```shell
db.users.find().skip(10);
```

-  查询 在 5 - 10 之间的数据 

```shell
db.usres.find().skip(5).limit(5)
```

-  查询 第一条数据 

```shell
db.users.findOne();
```

## nodejs 操作 mongodb

1.  安装**mongodb**依赖 

```shell
npm install --save mongodb
```

2. 引入

```shell
const Mongodb = require('mongodb')
```

3.  构建 mongodb 的连接地址 

```shell
const url = 'mongodb://127.0.0.1:27017';
```

4. 连接

```shell
Mongodb.connect(url, function(err, client) {
    // 4.1 选择数据库
    const db = client.db('数据库名称');

    // 4.2 选择集合并操作
    db.collection('集合名称').find();
    ...
db
    // 4.3 记得关闭连接
    client.close();
});
```

**查询**

```js
查询全部
.find()

查询特定的数据
.find(whereObj)

排序
.find().soft(softObj)

查询指定条数
.find().limit(count)

跳过的条数
.find().skip(count)
```



## mongoose

>  nodejs环境下对 mongodb 进行便捷操作的对象模型工具 

安装

```shell
npm install mongoose --save
```

建立连接

```js
// config/db.js   创建一个config文件夹下面的db.js文件
const mongoose = require('mongoose');
// 定义连接的地址，mz 是数据库的名字
const url = 'mongodb://localhost:27017/mz';

/**
 * 调用 connect 方法进行连接。
 * 1. 回调函数的方式
 * 2. promise 方式
 */

// mongoose.connect(url, { useNewUrlParser: true }, function(err) {
//   if (err) {
//     console.log('连接失败！', err.message);
//   } else {
//     console.log('连接成功~');
//   }
// })

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('连接成功~');
  })
  .catch(err => {
    console.log('连接失败!', err.message);
  })

// 最后将 mongoose 暴露出去
module.exports = mongoose;
```

### schema

>  schema 是一种描述 mongodb 中 collection(集合) 结构的一种东西。 

```js
// models/banner.js 创建一个models文件夹下面的banner.js
// 引入 db.js 
const db = require('../config/db.js');

// 定义 schema
const schema = new db.Schema({
  name: String,   // banner 名字
  imgUrl: String, // banner 图片地址
  startTime: {    // banner 显示的开始时间
    type: Number,
    default() {
      return new Date().getTime()
    }
  },
  endTime: {      // banner 显示的结束时间
    type: Number,
    default() {
      return new Date().getTime() + 1 * 24 * 60 * 60 * 1000; // 当前时间加 1 天
    }
  }
});

// 基于 schema 创建 model, 并暴露出去。
module.exports = db.model('Banner', schema);
```

### model

>  基于 Schema 编译来的构造函数。model 的实例代表着可以从数据库保存和读取的 documents。从数据库创建和读取 document 的所有操作都是 通过 model 进行的。 

 上面 **models/banner.js** 文件最后暴露出去的就是 model 