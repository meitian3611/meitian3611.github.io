---
title: ES6基本使用
date: 2019-11-04 19:35:22
tags:
	- 语法
	- 知识点
	- es6
categories: web前端
---

## let和const

* let关键字，用来声明变量，它的用法类似于var。

### let不允许重复声明变量

```javascript
var a = 1;
var a = 2;
console.log(a); //2

let b = 1;
let b = 2;
console.log(b); //Error
```

### let声明变量仅在块级作用域内有效

```javascript
for (var i = 0; i < 10; i++) {
    console.log(i);
};
alert(i); //10

for (let v = 0; v < 10; v++) {
    console.log(v);
}
alert(v); //Error
```

### 不能通过let声明和形参相同的变量

```javascript
function test(a) {
    let a = 123;
    console.log(a); //Error
}
test(456);
```

### let声明变量不会提升

```javascript
console.log(a);//undefined
var a = 10;

console.log(a)//Error
let a = 10;
```

### 暂时性死区TDZ

> ES6规定在某个区块中， 一旦用let或const声明一个变量，那么这个区块就变成块级作用域，用let或const声明的变量就“绑定”这个区域，不再受外部的影响。 在该变量声明之前不可以用，在语法上我们叫这种情况为：暂时性死区 (temporal dead zone，简称 TDZ)。

```javascript
let v = 1;
if (true) {
    console.log(v);
    let v = 2; //不能和全局变量声明相同
}
console.log(v);
```

上面代码中，存在全局变量v，但是块级作用域内let又声明了一个局部变量v，导致后者绑定这个块级作用域，所以在let声明变量之前，使用v会报错。

### const关键字，用来声明一个只读的常量

const和let类似，但是，const常量一旦声明，常量将不能重新赋值

使用const来定义常量，为了便于区分，通常会使用大写字母

```javascript
const ABC = 20;
console.log(ABC);
```

```javascript
ABC = 30;
console.log(ABC)//Error
```

**从本质上来说，const并不是值不能被改变，而是指向的那个内存地址不能被改变**

## 箭头函数

```javascript
box.onclick = function(){
    console.log(this)
}

//ES6
box.onclick = () =>{
    console.log(this)
}
```

**使用箭头函数比写原来的的function写法简洁许多（针对匿名函数使用）**

```javascript
var box = function(value){
    return value;
}

//ES6
let box = value => value
```

- **箭头函数和传统函数的区别**

### 1，对this的关联，函数内部的指向

```javascript
var name = 'xh';
var obj = {
    name: 'xm',
    say: () => {
        alert(this.name);
    }
}
obj.say();//xh
```

实际原因是箭头函数没有自己的this，

他的this是继承外面的因此内部的this就是外层代码块的this

### 2，new不可用

```javascript
var test = function(){}
var obj = new test();
console.log(obj);

//es6
var test = () => {}
var obj = new test();//Error
```

### 3，this不可变，this在函数体内整个执行环境为常量，不可改变this的指向

```javascript
var obj1 = {
    name: 'hello',
    age: 33
}
setTimeout(() => {
    console.log(this);
}.bind(obj1),1000); //报错
```

### 4，没有arguments对象

```javascript
function fn(){
    console.log(arguments[0]);
    console.log(arguments[1]);
}
fn(1,2);

//es6
var fn = () => {
    console.log(arguments[0]); //报错
}
fn(3);
```

## 字符串模板

> ES6中字符串模板使用反引号 ` ` 表示，字符串模板中可以解析变量和函数，使用 ${ } 解析

```javascript
var sname = "小明";
function fnAge(){
    return 18;
}
var str = `大家好，我叫${sname},我今年${fnAge()}岁了`;
alert( str );
```

> 字符串模板非常有用，当我们要插入大段的html内容到文档中时，传统的写法非常麻烦

```javascript
var box = document.getElementById('box');
var val1 = 11, val2 = 22, val3 = 33;
box.innerHTML = `
    <ul>
        <li>${val1}</li>
        <li>${val2}</li>
        <li>${val3}</li>
    </ul>
`;
```

## 解构赋值

> ES6允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构赋值。

```javascript
var x = 10 , y = 20 , z = 30;

//es6
var[x,y,z] = [10,20,30];
```

```javascript
var cat = 'ken';
var dog = 'lili';
var zoo = {cat: cat, dog: dog};
console.log(zoo);

//es6
let cat ='ken';
let dog ='xx';
let zoo = {cat,dog}
console.log(zoo)
```

> 解构赋值可以作用在函数的参数上面，让函数的参数值的传递顺序发生改变

```javascript
function fn({sname,age}){
    return `大家好，我叫${sname},我今年${age}了`;
}
console.log(fn({age:20,sname:'mike'}))
```

## Array.from()

> 将含有length属性，以数字为key的对象，类数组转换成真正的数组
>
> Array.from(obj,map函数);

**将lis集合（类数组）转成 数组**

```javascript
var lis = document.getElementsByTagName("li");
lis = Array.from(lis);
console.log( lis )
lis.push('abc');
console.log(lis);
```

**将对象转成 数组**

```javascript
var obj = {
    "0" : 10 ,
    "1" : 20 ,
    "2" : 30 ,
    "length" : 3
};
var arr = Array.from( obj );
console.log( arr );
```

## 扩展运算符

> 扩展运算符用三个点号表示，其功能是把数组或类数组对象（部署了iterator接口）展开成一系列用逗号隔开的参数序列

```javascript
console.log(...[1, 2, 3]); //123
console.log(1, ...[2, 3, 4], 5);//12345

let arr1 = [1, 2];
let arr2 = [3, 4, 5];       
arr1.push(...arr2)
console.log(arr1); 
```

> rest运算符也是三个点，其功能与扩展运算符恰好相反，把逗号隔开的参数序列组合成一个数组

```javascript
var arr = [1,2,3];
function fn(...args) {// rest运算符 组合数组
console.log(args);
};
fn(...arr);// 扩展运算符 展开数组
console.log(...arr);//123
```

## set函数

> Set 是一个构造函数，用来生成 Set 数据结构，它类似于数组，但是成员的值都是唯一的、没有重复的， 初始化 Set 可以接受一个数组或类数组对象作为参数，也可以创建一个空的 Set

```
var s1 = new Set();
var s2 = new Set([1, 2, 3]);
console.log(s1);
console.log(s2);
```

在 Set 中成员的值是唯一的，重复的值自动被过滤掉

```javascript
var s1 = new Set([1, 2, 2, 3, 1, 4]);
console.log(s1);//1234
```

Set 的一些属性方法：

size：返回成员总数

```javascript
var set = new Set([1,2]);
set.add(3);// 添加成员
console.log(set.size);// 3 成员总数
console.log(set);// Set(3) {1, 2, 3}
```

add(value)：添加某个值，返回Set结构本身

```javascript
set.add([4,5]);// 添加成员
console.log(set.size);// 4 成员总数
console.log(set.has(2));// true 有该成员
console.log(set);// Set(4) {1, 2, 3, [4, 5]}
```

delete(value)：删除某个值，返回一个布尔值，表示删除是否成功

has(value)：返回一个布尔值，表示该值是否为Set的成员

```javascript
set.delete(2);// 删除成员
console.log(set);// Set(3) {1, 3, [4, 5]}
console.log(set.has(2));// false 没有该成员
```

clear()：清除所有成员，没有返回值

```javascript
set.clear();// 清除所有成员
console.log(set);// Set(0) {}
```

**for/of 与 for/in**

```javascript
//for/in：遍历键
var arr = [4,5,6,7];
for (var key in arr) {
    console.log(key);//0 1 2 3
}

var str = 'javascript';
for (var val of str) {
    console.log(val);
}
```

```javascript
//for/of：遍历值
var arr = [4,5,6,7];
for (var val of arr) {
    console.log(val);//4 5 6 7
}
```

## symbol类型

> ES5 的对象属性名都是字符串，这容易造成属性名的冲突。
>
> ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。

**Symbol 是 JavaScript 语言的第七种数据类型。**

```javascript
let s = Symbol('xm');
console.log( s ); // Symbol(xm)
console.log( typeof s );// symbol
```

对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。

```javascript
var xm = Symbol();
var obj = {
    [xm] : "小明" //对象的属性是Symbol类型
}
```

Symbol类型的属性 取值是 必须` obj[xm]` 不能用`obj.xm`

`console.log( obj[xm] );`

```javascript
var s4 = Symbol();
var obj = {
    'name': 'xm',
    [s4]: 'xh',
    [Symbol('age')]: 18
}
console.log(obj); // {name: "xm", Symbol(): "xh", Symbol(age): 18}
console.log(obj.name); // xm
console.log(obj[s4]); // xh 访问对象的Symbol属性的值
console.log(obj[Symbol('age')]); // undefined
```

对象的Symbol属性不会被遍历出来

```javascript
var obj = {
    "sname":"小明",
    "skill" : "web"
}
var age = Symbol();
obj[age] = 18;
console.log( obj );
for( var key in obj ){
    console.log(key + " -> " + obj[key] );
}
```

Object.getOwnPropertySymbols 方法会返回当前对象的所有 Symbol 属性，返回数组

```javascript
let id = Symbol("id");
let obj = {
    [id]: '007',
    [Symbol('name')]: 'xiaocuo'
};
let arr = Object.getOwnPropertySymbols(obj);
console.log(arr); //[Symbol(id),Symbol(name)]
console.log(obj[arr[1]]);  //'xiaocuo'  访问对象的Symbol属性的值
```

虽然这样保证了Symbol的唯一性，但我们不排除希望能够多次使用同一个symbol值的情况。

官方提供了全局注册并登记的方法：

```javascript
let name1 = Symbol.for('name'); //检测到未创建后新建 
let name2 = Symbol.for('name'); //检测到已创建后返回 
console.log(name1 === name2); // true
var obj2 = {
    age: 17,
    [name1]: 'xm'
}
console.log(obj2[name1]);//'xm'
console.log(obj2[name2]);//'xm'
console.log(obj2[Symbol('name')]);//undefined
console.log(obj2[Symbol.for('name')]);//'xm'
```

