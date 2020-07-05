---
title: Yarn操作命令
date: 2019-12-18 20:39:19
tags:
	- yarn
	- 知识点
categories: web前端
---

# Yarn

> 一款包资源管理器

## 安装

> npm install yarn -g

## 与npm的对比

| 描述                     | npm                                                          | yarn                                                         |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 项目初始化               | npm init -y                                                  | yarn init -y                                                 |
| 安装资源 - 开发环境      | npm install --save-dev xxx                                   | yarn add xxx -D                                              |
| 安装资源                 | npm install --save xxxx                                      | yarn add xxx                                                 |
| 根据package.json主动安装 | npm install                                                  | yarn                                                         |
| 全局安装                 | npm install -g xxx                                           | yarn global add xxx                                          |
| 删除模块                 | npm uninstall --save-dev xxx <br>npm uninstall --save xxx<br>npm uninstall -g xxx | yarn remove xxx<br>yarn remove xxx -D<br>yarn global remove xxx |
| 运行脚本                 | npm start<br>npm run 脚本名                                  | yarn start<br>yarn run 脚本名\| yarn 脚本名                  |
| 获取当前源               | npm config get registry                                      | yarn config get registry                                     |
| 换源                     | npm config set registry xxx                                  | yarn config set registry xxx                                 |
| 资源锁文件               | package-lock.json                                            | yarn.lock                                                    |

