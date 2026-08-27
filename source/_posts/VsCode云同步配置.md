---
title: "VsCode云同步配置"
date: 2021-04-14 09:34:26
tags:
  - 工具
  - 插件
  - 实用
source: https://meitian3611.github.io/2021/04/14/VsCode云同步配置/
---

## VsCode setting sync配置及使用

### 安装

1. 点击VSCode的插件栏搜索Settings Sync然后安装

   ![001.png](https://i.loli.net/2021/04/14/amZWDo2RFGPNMtv.png)
2. 安装完之后会弹出一个登陆界面,这里点击login with github

   <!-- more -->

   ![002.png](https://i.loli.net/2021/04/14/VOmHdyLlsgIxW9j.png)
3. 点击后会自动弹出一个登陆页面,授权登录你的GitHub账户即可

![003.png](https://i.loli.net/2021/04/14/dYImqKpJyAwc75g.png)

### 使用

1. 在vscode任意界面按 Alt + Shift + U即可上传当前配置，并生成一个gits id.此时终端会打印上传成功的日志信息
2. .保存好gits id，在需要导入远程配置的电脑上安装好该插件，使用组合键 Alt + Shift + D 即可下载配置。
