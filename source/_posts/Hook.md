---
title: Hook
date: 2019-12-24 10:10:56
tags:
	- 框架
	- 笔记
	- 新增
categories: React
---

>  Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性 

## useState

> 返回一个自己指定的属性，以及更新原数据的函数

```jsx
  const [name, setName] = useState("张三")
```

使用示例

```jsx
const App = () => {
    const [name, setName] = useState("张三")
    return (
    	<div>
        	<p>{ name }</p>
            <button onClick={ () => {
                setName('李四')
             }}>修改name</button>
        </div>
    )}
```

## useEffect

> 默认情况下，effect 会在每轮组件渲染完成后执行。这样的话，一旦 effect 的依赖发生变化，它就会被重新创建。 

 给 effect 函数里面再返回一个函数，返回的函数会在组件销毁之前执行

```jsx
  useEffect(() => {
    let timer = setInterval(() => {
      console.log(1)
    }, 1000)
    return () => {
      console.log('这个函数在组件销毁之前执行，componentWillUnmount')
      clearInterval(timer)
    }
  })
```

给 useEffect 传递第二个参数，是一个数组，数组中写上需要监听的数据

```jsx
 const [name, setName] = useState('张三') 

  useEffect(() => {
    console.log('监听 name 数据的变化')
  }, [name])
```

将 useEffect 第二个参数，设置为空数组只会默认执行一次就结束

```jsx
  useEffect(() => {
    console.log('默认执行一次')
  }, [])
```

##  useContext

> 接收一个 context 对象，实现供应商与消费者之间的关系

```jsx
const MyCtx = React.createContext()
const Provider = MyCtx.Provider

const App3 = () => {
  const [color, setColor] = useState("blue")
  return (
    <Provider value={color}>
      <div>
        <h2>App3</h2>
        <button
          onClick={() => {
            setColor("#f40")}}>
            改变颜色</button>
        <One></One>
      </div>
    </Provider>
  )}
```

```jsx
const One = () => {
const value = useContext(MyCtx) // 接收供应商传递的数据信息
  return (
    <div>
      <h2 style={{ color: value }}>One</h2> // 此时颜色应该为 blue
    </div>
  )
}
```