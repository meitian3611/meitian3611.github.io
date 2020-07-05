---
title: gulp
date: 2019-10-30 19:20:26
tags:
	- gulp
	- 笔记
	- 知识点
categories: 项目相关
---

## 什么是Gulp

> Gulp是基于Node.js流的前端自动化构建工具
>
> Gulp自动化构建工具可以增强你的工作流程！易于使用、易于学习、构建快速、插件高质！
>
> 在日常开发中，可以借助Gulp的一些插件完成很多的前端任务。
>
> 如：代码的编译（sass、less）、压缩css，js、图片、合并js，css、es6转es5、自动刷新页面等。

## 使用Gulp

第一步先确保根目录存在 `package.json` 文件，执行 `npm init -y` 生成

**1. 全局安装gulp-cli脚手架**

`npm install gulp-cli --global`

**2. 安装项目开发依赖**

`npm install gulp --save-dev`

**3.在项目根目录下创建一个名为 gulpfile.js 的配置文件：**

此文件是项目主文件，运行gulp命令时，默认运行此文件

**4.命令行运行 gulp：**

gulp + 任务名

****

## Gulp常用的API

> task()、src()、dest()、watch()、series()、parallel()

**gulp.task 方法用来注册任务**

> gulp.task(taskName, taskFunction)
>
> taskName 为任务名
>
> taskFunction 为任务函数，我们把任务要执行的代码都写在里面。

```javascript
var gulp = require('gulp');
gulp.task('task1', function () { //注册任务task1
    console.log('执行task1');
});
```

**新版本Gulp@4.0书写方式**

```javascript
var gulp = require('gulp');
function myTask(done){
    console.log('执行task2');
    done(); //异步任务完成
}
exports.task2 = myTask; //注册任务task2
```

**gulp.dest 创建一个流，用于从文件系统读取元数据对象**（用来读取文件）

> gulp.src('./js/a.js'); // 读取一个文件
>
> gulp.src('./js/*.js'); // 读取js目录下的所有js文件
>
> gulp.src(['./js/a.js','./js/b.js']); // 读取两个文件

**gulp.dest 创建一个流，用于将元数据对象写入到文件系统**（设置生成文件的路径）

```javascript
var gulp = require('gulp');
gulp.task('mytask', function() {
    gulp.src("./js/a.js")
    .pipe(gulp.dest("./dist"));
});
```

读取文件流（gulp.src），通过管道（pipe），把文件流写入（gulp.dest）当前目录下的 dist 文件夹中

**gulp.watch  监听 globs 并在发生更改时运行任务**

```javascript
gulp.task('watchs',function(){//监听任务
    //当匹配任务变化时执行相应任务
    gulp.watch('./js/*.js',gulp.series('concat'));
    gulp.watch('./css/*.css',gulp.series('task1'));
});
```

**gulp.series() 将任务函数或组合操作组合成更大的操作（按顺序执行，同步）**

**gulp.parallel() 将任务函数或组合操作组合成更大的操作（同时进行，异步）**

----

## 常用插件

常见问题解决方案：清理残留缓存`npm cache clean --force`

**文件合并**

安装：`npm install --save-dev gulp-concat`

```javascript
var gulp = require('gulp');
var concat = require('gulp-concat'); //引入插件
gulp.task('concat', function () {
    return gulp.src('./js/*.js') 	//要合并的文件
    .pipe(concat('main.js')) 		//合并匹配到的js文件并命名为 "main.js"
    .pipe(gulp.dest('./dist/js'));	//写入dist/js文件夹下
});
```

**js文件压缩**

安装：`npm install --save-dev gulp-uglify`

```javascript
var gulp = require('gulp');
var uglify = require('gulp-uglify'); //引入插件
gulp.task('uglifyJS', function () {
    return gulp.src('./dist/main.js') // 要压缩的js文件
    .pipe(uglify()) 				//使用uglify进行压缩
    .pipe(gulp.dest('./dist/js'));	//写入js文件夹
});
```

**css文件压缩**

安装：`npm install --save-dev gulp-minify-css`

```javascript
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');//引入插件
gulp.task('minifyCss', function () {
    return gulp.src('./dist/main.css') // 要压缩的css文件
    .pipe(minifyCss()) 				//压缩css
    .pipe(gulp.dest('./dist/css'));	//写入dist文件夹
});
```

**css/js文件合并压缩**

```javascript
var gulp = require('gulp');
var uglify = require('gulp-uglify'); //引入js压缩插件
var concat = require('gulp-concat'); //引入合并插件

//js文件的合并压缩
gulp.task('concatJs', function () {
    return gulp.src(['./js/*.js', '!./js/j*.js']) //要合并的文件
        .pipe(concat('main.js')) 		//合并匹配到的js文件并命名为 "main.js"
        .pipe(uglify())					//将合并后的js文件进行压缩
        .pipe(gulp.dest('./dist/js'))//写入dist/js文件夹
        .pipe(connect.reload())
});
```

**html文件压缩**

安装：`npm install --save-dev gulp-minify-html`

```javascript
var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');//引入插件
gulp.task('minifyHtml', function () {
    return gulp.src('./test.html') //要压缩的html文件
    .pipe(minifyHtml()) 			//压缩html
    .pipe(gulp.dest('./dist/'));	//写入dist文件夹
});
```

**重命名**

安装：`npm install --save-dev gulp-rename`

```javascript
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');//引入插件
gulp.task('rename', function () {
    return gulp.src('./js/jquery-1.8.3.js') //读取文件
    .pipe(uglify()) 						//压缩
    .pipe(rename('jquery-1.8.3.min.js'))	//重命名
    .pipe(gulp.dest('./dist/js'));			//写入js文件夹
});
```



**ES6转ES5**

安装：`npm install --save-dev gulp-babel @babel/core @babel/preset-env`

```javascript
var gulp = require('gulp');
var babel = require('gulp-babel');
gulp.task('es6Toes5', function () {
    return gulp.src('./js/class.js')
    .pipe(babel({ presets: ['@babel/preset-env']}))
    .pipe(gulp.dest('./dist/js'))
});
```

**sass编译**

安装：`npm install --save-dev gulp-sass`

```javascript
const gulp = require('gulp');
const sass = require("gulp-sass");
gulp.task('sass',function () {
    return gulp.src('./test.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'));
});

gulp.task('compileSass',function () {
    gulp.watch('./test.scss',gulp.series('sass'));
});
```



***自动刷新**

安装：`npm install --save-dev gulp-connect`

```javascript
const gulp = require('gulp');//gulp包
const minifyHtml = require('gulp-minify-html');//压缩html
const connect = require('gulp-connect');//浏览器刷新插件

gulp.task('reload', function (done) {
    connect.server({
        livereload: true,
    });
    done();
});

gulp.task('minifyHtml', function () {
    return gulp.src('./test.html')  //要压缩的html文件
    .pipe(minifyHtml()) 			//压缩html
    .pipe(gulp.dest('./dist'))		//写入dist文件夹
    .pipe(connect.reload())//自动刷新的关键，css合并压缩和js合并压缩都要加上这一句，就不一一举例了
});

//监视文件的状态并同步更新
gulp.task('watchs', function () {
    gulp.watch('./css/*.css', gulp.series('concatCss'))  //监视 并同步css  压缩代码
    gulp.watch('./js/*.js', gulp.series('concatJs'))     //监视 并同步js   压缩代码   
    gulp.watch('./*.html', gulp.series('minifyHtml'))    //监视 并同步html 压缩代码   
});

gulp.task('run', gulp.series('reload', 'watchs'));
```

***一键打包**

```javascript
gulp.task('bulid', gulp.parallel( //一键打包生成
    gulp.series('concatCss'),
    gulp.series('concatJs'),
    gulp.series('rename'),
    gulp.series('minifyHtml')
));
```

