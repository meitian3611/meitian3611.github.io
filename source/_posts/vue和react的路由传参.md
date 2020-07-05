---
title: vue和react的路由传参
date: 2020-02-07 23:13:26
tags:
	- 笔记
	- 知识点
	- 路由
categories: 框架
---
## Vue路由传参

### 编程式导航 ( ?id=xx )

- 使用 $router.push 拼接参数传参

```vue
// home.vue
<template>
  <div class="page-home">
    <h1>首页</h1>
    <button @click="handelClick">
      跳转a页面
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    handelClick() {
      this.$router.push('/a?id=99') // 问号传参方式
    }
  }
}
</script>
```

```vue
// a.vue
<template>
  <div>
    <h1>现在是a路由页面 接收到传递的值是:{{msg}}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ''
    }
  },
  mounted() {
    let id = this.$route.query.id // 使用$route.query直接接收参数即可
    this.msg = id
  }
}
</script>
```

- 使用path来匹配路由，通过query 来传递参数

```vue
// 改为对象的形式传递参数，其它不变   
handelClick() {
      this.$router.push({
        path: '/a',
        query: {
          id: 88
        }
      })
    }
```

### 动态路由传值 ( /a/66 )

```vue
// 1. 在index.js路由配置时完成动态路由设置
    { path: '/a/:id', component: arouter, name: arouter}

// 2. 实际开发中 66 就是动态的值
	<router-link to="/a/66">跳转a页面</router-link>

// 3. a路由页面接收传递的值进行页面渲染即可
  mounted() {
    console.log(this.$route.params.id) // 66
  }
```






## React路由传参

### 1. params

**配置路由：**

```jsx
<Route path='/login/:id' component={Login}></Route>
<Route path='/' component={Home}></Route>
```

**首页:**

```jsx
 <Link to='/login/99'> 跳转login页并传递参数</Link>
```

**Login:**

```jsx
  componentDidMount() {
    const { match } = this.props
    console.log(match.params.id) // 成功获取id
  }
```

### 2. search

**配置路由：**

```jsx
<Route path='/login' component={Login}></Route> // 正常配置即可
<Route path='/' component={Home}></Route>
```

**首页：**

```jsx
 <Link to='login/?id=99'> 跳转login页并传递参数</Link> // 注意这里login前面不需要加斜杠
```

**Login：**

```jsx
  componentDidMount() {
    const { match, location } = this.props
    const id = location.search.split('=')[1]
    console.log(id) // 成功获取id
  }
```

### 3. query

**路由正常配置**

**首页：**

```jsx
  render() {
    var query = {
      pathname: '/login',
      query: '通过query传递一个对象参数'
    }
    return (
      <div>
        <Link to={query}>跳转login并传参数</Link>
      </div>
    )
  }
```

**Login：**

```jsx
 componentDidMount() {
    const { location } = this.props
    console.log(location.query); // 成功获取query的参数
  }
```

### 4. state
**路由正常配置**

**首页：**

```jsx
  render() {
    var state = {
      pathname: '/login',
      state: '通过state传递一个对象参数'
    }
    return (
      <div>
        <Link to={state}>跳转login并传参数</Link>
      </div>
    )
  }
```

**Login：**

```jsx
 componentDidMount() {
    const { location } = this.props
    console.log(location.state); // 成功获取state的参数
  }
```
