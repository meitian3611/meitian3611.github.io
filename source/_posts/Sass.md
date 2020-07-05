---
title: Sass
date: 2019-10-31 16:49:15
tags:
	- sass
	- css扩展
	- 知识点
categories: 进阶提升
---

## Sass是什么

> * SASS是一种动态的CSS（CSS预处理器），它扩展了 CSS 语法，
>
> * 定义了一套新的语法规则和函数，以加强和提升CSS。
>
> * 浏览器不认识sass，都需要编译成css文件！！
>
> * 你仍然可以在Sass中写普通的CSS语句！

Sass 扩展了 css 的特性：

变量嵌套规则

@import导入样式

@mixin 混合器及传参

@extend 继承

@if、@for、@function 等

### 软件方式编译

使用Koala编译sass

koala是一个国产免费前端预处理器语言图形编译工具，支持Less、Sass、Compass、CoffeeScript，帮助web开发者更高效地使用它们进行开发。跨平台运行，完美兼容windows、linux、mac。

koala：[http://koala-app.com/index-zh.html](http://koala-app.com/index-zh.html)

**注：以下均为scss语法**

### 变量

> sass使用$符号来标识变量

```scss
$nav-color: #F90;
$width: 100px;
nav {
    width: $width;
    color: $nav-color;
}
//编译后
nav {
    width: 100px;
    color: #F90;
}
```

### 嵌套

> 在Sass中，你可以像俄罗斯套娃那样在规则块中嵌套规则块。
>
> Sass允许将一套 CSS 样式嵌套进另一套样式中，内层的样式将它外层的选择器作为父选择器。

```scss
#box{
    width:100px;
    height:100px;
    h1{//通过缩进用于嵌套
        text-align:center;
    }
    span{
        font-size:16px;
        a{
            color:blue
        }
    }
}
//编译后
#box {
    width: 100px;
    height: 100px;
}
#box h1 {
    text-align: center;
}
#box span {
    font-size: 16px;
}
#box span a {
    color: blue;
}
```

父选择器的标识符 **&**

```scss
a {
    background-color:red;
    &:hover{
        font-size:60px;
    }
}
//编译后
a {
    background-color: red;
}
a:hover {
    font-size: 60px;
}
```

### @import导入样式

> css有一个特别不常用的特性，即@import url()规则，它允许在一个css文件中导入其他css文件。 页面打开时，link引用的css文件被加载。而@import引用的CSS等页面加载完(DOM)之后再加载。

> sass也有一个@import规则，但不同的是，sass的@import规则在生成css文件时就把相关文件导入进来。@import "b";这条命令将把 b.scss文件中所有样式添加到当前样式表中

```scss
// a.scss
$width : 100px;
.before {
    width: $width;
}
@import "b";
.after {
    width: $width;
}
.container {
    width: $width;
    height: $height;
    border: 1px solid;
}
// b.scss
$width : 200px;
$height : 200px
```

**编译后**

```scss
// a.css
.before {
    width: 100px;
}
.after {
    width: 200px;
}
.container {
    width: 200px;
    height: 200px;
    border: 1px solid;
}
```

### 混合器 @mixin

> 你可以通过sass的混合器实现大段样式的重用。

```scss
@mixin no-bullets {
    list-style: none;
    li {
        list-style-image: none;
        list-style-type: none;
        margin-left: 0px;
    }
}
ul.plain {
    color: #444;
    @include no-bullets;
}
// 编译后：
ul.plain {
    color: #444;
    list-style: none;
}
ul.plain li {
    list-style-image: none;
    list-style-type: none;
    margin-left: 0px;
}
```

**还可以给混合器传参**

```scss
@mixin link-colors($normal, $hover, $visited) {
    color: $normal;
    &:hover {
        color: $hover;
    }
    &:visited {
        color: $visited;
    }
}
a {
    @include link-colors(blue, red, green);
}
// 编译后：
a {
    color: blue;
}
a:hover {
    color: red;
}
a:visited {
    color: green;
}
```

###  继承@extend

```scss
.error {
    border: 1px solid red;
    background-color: #fdd;
}
.seriousError {
    @extend .error; //继承所有样式
    border-width: 3px;
}
// 编译后：
.error {
    border: 1px solid red;
    background-color: #fdd;
}
.seriousError {
    border: 1px solid red;
    background-color: #fdd;
    border-width: 3px;
}
```

### 颜色函数

```scss
$color要改变的颜色，$amount取值范围是0~100%
lighten($color, $amount) //颜色变浅函数；
darken($color, $amount) //颜色变深函数；

saturate($color, $amount) //增加颜色的饱和度；
desaturate($color, $amount) //减少颜色的饱和度；
grayscale($color) //将该颜色转换为相对应的灰度颜色；
complement($color) //获取该颜色值旋转180度后相对应的颜色；
```

