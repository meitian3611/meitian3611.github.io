---
title: React生命周期
date: 2019-12-19 21:23:54
tags:
	- 笔记
	- 常用
	- 框架
categories: React
---

## 生命周期的三个阶段

### 1. 挂载阶段

#### constructor 构造函数
	1. 一次生命周期中，只会触发一次
	2. 一般是用来 state 的初始化
	3. 使用它来做提前的 事件处理函数 this 绑定问题
#### render 函数
	1. 一次生命周期中，可以触发多次
	2. 主要是用来返回 组件的模板内容
	3. 只要 state，prop 发生变化，那么这个函数默认情况下一定会重新执行
	4. 如果调用了 forceUpdate() 那么 render一定会重新执行
	5. 不能在这发生Ajax|Axios请求
#### componentWillMount 挂载之前（过期）
#### static getDerivedStateFromProps(props, state)替代挂载之前   派生state数据
	1. 触发在 render函数之前，挂载与更新阶段都会触发
	2. 必须返回对象或者null。返回的如果是对象的话，会和state对象合并一份新的state。如果是null的话就不做处理
#### componentDidMount 挂载完成
	1. 可以进行Ajax数据请求
	2. 可以得到真实的DOM对象
### 2. 更新阶段（五个步骤）

#### 01 --- static getDerivedStateFromProps(props, state) 派生state数据

#### 02 --- shouldComponentUpdate(nextProps, nextState)  判断是否应该更新
	1. 比较重要，是实现性能优化的一个点
	2. 必须提供返回值，返回一个布尔类型的值，为true，继续流程，为 false，流程结束
#### 03 ---  render函数

#### componentWillUpdate() 更新之前（过期）

#### 04 --- getSnapshotBeforeUpdate(prevProps, prevState) 替代更新之前
	1. 更新之前
	2. 必须有返回值或者null 返回值的内容会给到componentDidUpdate 的第三个参数
#### 05 --- componentDidUpdate(prevProps, prevState, snapshot) 更新完成

	更新完成，并且真实DOM也更新完成

### 3. 销毁阶段

#### componentWillUnmount 销毁之前
	1. 做一些清理工作



![TIM截图20191219174707.png](https://i.loli.net/2019/12/19/wUjPnxB8DZfWcSY.png)
   [原图链接](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)