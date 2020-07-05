---
title: state与受控组件
date: 2019-12-25 09:47:00
tags:
	- state
	- 笔记
	- 组件
categories: React
---

## state的一些额外情况

>- 初始化是放在 构造函数的
>- 如果代码支持 public class filed 的实验语法 那么可以直接进行初始化 state
>- 不可以直接对 state 进行修改，要修改一定是使用 setState()函数

```jsx
import React from "react";
import ReactDOM from "react-dom";

class Hello extends React.Component {
  state = {
    msg: "hello",
  };
render() {
	<div>
    <h1>this.state.msg</h1>
      <button onClick={() => {
                
                this.setState({
                    msg: 'world'
                });
                
      //  console.log(this.state.msg)结果为hello 页面文字是world，但是数据未改变 
            }}
          >点击修改msg</button>
    </div>
}
ReactDOM.render(<Hello />, document.getElementById("root"));

```

> setState() 这个函数可能是异步的。会导致视图刷新，但是数据没有更新，如果要立刻得到新的数据可以给 setState 传递第二个参数，立即执行函数

```jsx
// 为了解决上面的数据更新问题 应该将代码进行变动
this.setState(
{
    msg : 'world'
},
    () => {
        console.log(this.setState.msg) // 打印结果为 world 数据成功变化
    }
)
```

> 在一次周期中，多次 setState() 调用会进行合并

```jsx
import React from "react";
import ReactDOM from "react-dom";
class Hello extends React.Component {
  state = {
    count: 1
  };
	render(){
        return(
        <div>
            <h1>{this.state.count}</h1>
            <button onClick={
                        
             	 for (let i = 0; i < 5; i++) {
            	this.setState({
                count: this.state.count + 1  // 合并为一条 只会进行+1操作
                    
       });
    }
   }>点击增加数值 </button>
     </div>)}
ReactDOM.render(<Hello />, document.getElementById("root"));
```

> 倘若想要不合并，serState的第一个参数传递为一个函数对象的形式，然后这个函数就会自动接收两个参数 prevState props

```jsx
            for (let i = 0; i < 5; i++) {
              this.setState(prevState => {
                console.log(this.state.count);
                return {
                  count: prevState.count + 1
                };
              });
            }
```

## 受控组件

> 表单元素的value值如果完全由数据来控制的话，那么这个元素可以叫做受控组件

>  受控组件的值如果要发生变化，需要监听 onChange事件。在事件处理函数去修改数据
>
>  radio 是通过 checked 来控制
>
>  checkbox 也是通过 checked 来控制



## 非受控组件

> 表单元素不是由数据（value）来控制的

> 需要使用 ref 进行取值
>
> ref 有两种写法：1. 字符串 2. 函数，函数会自动接收到这个元素的DOM对象/