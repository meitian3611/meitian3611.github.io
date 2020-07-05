---
title: Git版本管理工具
date: 2019-11-01 10:19:30
tags:
	- Git
	- 笔记
	- 工具
categories: 项目相关
---

>  Git是目前世界上最先进的分布式版本控制系统。
>
> GIT为分布式版本控制系统根本没有“中央服务器”，每个人的电脑上都是一个完整的版本库适合分布式开发，强调个体公共服务器压力和数据量都不会太大速度快灵活可以离线工作操作复杂，代码保密性差

## 操作流程

### 一，初始化

命令  `git init`

显示成功后去相应的文件夹中查看是不是多了一个.git隐藏文件

这个文件夹就是你的版本库了，把项目放在文件夹下。

### 二，提交到本地暂存

***提交之前需要记住先刷新原有代码！！**

命令 **git pull**   刷新再提交  这一步很重要！

命令 git add ‘文件名’        

​		 git add -u   提交所有被修改(modified)和被删除(deleted)文件，不包括新文件(new)        

​		 git add .  	提交所有新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件        

​	     git add -A   提交所有变化

### 三，提交到本地仓库

命令  git commit -m '一段注释内容'

### 四，查看仓库状态

命令  git status  用于显示工作目录和暂存区的状态。

**查看修改内容**

命令  git diff 你的文件名

将更改后的东西提交上去，和之前一样。先add 然后再commit

### 五，版本回退

**查看提交日志**

命令  `git log` `git reflog`

**回退版本**

命令   `git reset --hard HEAD^ ` 退回到上个版本 

如果需要退回好多版本就在后面加上 ^ 例： `git reset --hard HEAD^^`退回两个版本。

`git reset --hard 191e0c7`  回退到指定版本然后去查看readme.txt是否成功退回。

### 六，提交远程仓库

命令1. git remote add origin [https: // github.com/你的账号/你的项目](https://github.com/你的账号/你的项目名)[名](https://github.com/你的账号/你的项目名)称   设置远程仓库地址
命令2. git push -u origin master 将本地的库推送到master分支 （就是推送到服务器上）

`git remote -v`  查看远程仓库地址

`git remote rm origin`  删除远程仓库地址

第一次需要这么操作，以后就是直接 **git push**就行

****

## 操作指令总结

> **git init** 								 项目文件初始化
>
> **git pull**  								提交前的刷新操作，新建仓库可以忽略
>
> **git add -A** 							提交到暂存仓库
>
> **git commit -m '**一段注释'  提交到本地仓库
>
> **git status**  							查看仓库状态 
>
> git reflog								查看日志
>
> git reset --hard HEAD^ 	   退回到上个版本 
>
> git remote add origin [https: // github.com/你的账号/你的项目](https://github.com/你的账号/你的项目名)[名](https://github.com/你的账号/你的项目名)称  **第一次创建需要**
>
> git push -u origin master 将本地的库推送到master分支 				 **第一次创建需要**
>
> git remote -v  					查看远程仓库地址
>
> git remote rm origin 		  删除远程仓库地址
>
> **git push**								日常提交指令（master）
>
> git clone https://github.com/账号/项目名称

## 分支操作

> 查看分支：git branch
>
> 创建分支：git branch  name
>
> 切换分支：git checkout name
>
> 创建并切换分支：git checkout -b name
>
> 合并某分支到当前分支：git merge name
>
> 删除分支：git branch -d name
>
> **提交分支**：git push origin name
>
> **拉取远程分支**：git fetch origin name
>
> **更新远程分支**：git pull origin name

**合并分支（工作流程）**

> 1、先建一个分支              	git branch 分支名
>
> 2、切换到新建的分支          git checkout 分支名
>
> 3、提交分支上的代码          git add .    git commit -m “提交注释”
>
> 4、切换至主分支上              git checkout master
>
> 5、然后合并分支             	 git merge 分支名字
>
> 6、合并完以后就push         最好先pull一次  然后 git push

## 忽略文件

新建文件：.gitignore.

```
# .gitignore 忽略文件列表
.DS_Store
node_modules/
```

