---
title: "Vuex"
date: 2021-03-31 10:25:15
tags:
  - 知识点
  - 笔记
  - 复习
source: https://meitian3611.github.io/2021/03/31/Vuex/
---

## Vuex 简述

> Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态。
>
> **例如：**A，B，C三个组件同时需要使用一个数据，并且其中一个组件对数据进行了更改操作，另外2个组件需要同时进行更新。按照传统方式来，可能需要使用父子传值，兄弟传值，可随着项目体积的增大，需要管理的数据也相应增加，就会导致代码十分繁琐，难以维护等一系列问题。
>
> 将此数据放在 vuex 的 state 中进行管理，对任意组件共享，能够有效的解决问题。

<!-- more -->

## 核心概念

### State

> State 用于提供唯一的公共数据源，所有共享的数据都要统一放到 Store 的 state 中进行存储

```js
export default new Vuex.Store({
 // 创建 store 数据源
    state:{
        count:0 // 共享数据
    }
})
```

1. 组件访问 state 中数据的第一种方式

```js
// 模板中引用
<div> {{ $store.state.count }} </div> 
// script中引用
this.$store.state.count
```

2. 组件访问 state 中数据的第二种方式

```js
<div> {{ count }} </div> 
<script>
import { mapState } from 'vuex' //在组件中从 Vuex 中按需导入 mapState 函数
export default {
  computed: {
    ...mapState(['count']), // 在计算属性中映射出state的全局共享数据
  },
}
</script>
```

### Mutations

> Mutations 用于变更 state 中的数据。
>
> 注意：修改 store 中 state的数据，只有通过 mutations 来修改，不可以在其他组件随意修改。
>
> 错误示范： ~~`this.$store.state.count` = 99~~
>
> 只有 mutations 有权利修改 state 的数据，但是不能在 mutations 中执行异步操作，难以调试。

```js
export default new Vuex.Store({
    state:{
        count:0
    },
 // 定义 mutations
    mutations: {
      add(state, val) { // val：组件传递过来的参数
      	state.count += val
    },
      sub(state, val) {
      	state.count -= val
    }
  },
})
```

1. 组件触发 mutations 的第一种方式

```js
methods:{
    click(val){ // val:需要传递的参数
 this.$store.commit('add'，val) // 调用 store 的事件修改 state的数据
    }
}
```

2. 组件触发 mutations 的第二种方式

```js
<script>
import { mapState, mapMutations } from 'vuex' // 引入 mapMutations
export default {
  computed: {
    ...mapState(['count']),
  },
  methods: {
    ...mapMutations(['add']), // 在 methods 中映射出方法名
     click(val){
 this.add(val) // val：需要传递的参数
     }
  },
}
</script>
```

### Actions

> Actions 用于处理异步任务，不能直接修改 state 的数据，只能提交 mutations 方法。
>
> 例如 调用后台接口API 的时候。

```js
export default new Vuex.Store({
    state:{
        count:0
    },
    mutations: {
      add(state, val) { 
      	state.count += val
    },
      sub(state, val) {
      	state.count -= val
    }
  },
 // 定义 actions
    actions: {
      addAsync(context, val) { // val：组件传递过来的参数
        setTimeout(() => {
          context.commit('add', val) // 提交mutations
      }, 1000)
    }
  }
})
```

1. 组件触发 actions的第一种方式

```js
methods:{
    click(val){ // val:需要传递的参数
 this.$store.dispatch('addAsync'，val) // 调用 store 的事件修改 state的数据
    }
}
```

2. 组件触发 actions的第二种方式

```js
<script>
import { mapState, mapMutations, mapActions } from 'vuex' // 引入mapActions 函数
export default {
  computed: {
    ...mapState(['count']),
  },
  methods: {
    ...mapMutations(['add']),
    ...mapActions(['addAsync']), // 映射方法名
    addBtn(val) {
 this.addAsync(val) // 第二种方式触发
    },
  },
}
</script>
```

### Getters

> Getters 用于对 state 数据进行加工处理形成新的数据，类似 vue 的计算属性。
>
> 1. getters 不会修改 state 的数据，在原有的数据基础上加工，形成新的数据。
> 2. state的数据发生改变，getters 的数据也会发生变化。

```js
export default new Vuex.Store({
    state:{
        count:0
    },
    getters:{
        showNum(state){
 let num = state.count + 1
 return '当前count的数量是：' + num
        }
    }
})
```

1. 组件使用 getters 中数据的第一种方式

```js
// 模板中引用
<div> {{ $store.getters.showNum }} </div> 
// script中引用
this.$store.getters.showNum
```

2. 组件使用 getters 中数据的第二种方式

```js
<div> {{ showNum }} </div> 
<script>
import { mapState,mapGetters } from 'vuex' //导入 mapGetters 函数
export default {
  computed: {
    ...mapGetters(['showNum']),// 在计算属性中映射出getters的全局共享数据
    ...mapState(['count']), 
  },
}
</script>
```

### Modules

> Modules 模块化 用于项目体系较大，一个store的共享仓库代码也相对冗余，此时可以将 store 拆分
>
> 成若干个store仓库，创建多个文件夹，在主文件 store/index.js 引入即可

```
store 文件夹
 - modules 模块化文件夹
   -- store01.js // 仓库01
   -- store02.js
   -- store03.js
 - index.js  主文件
```

- 主文件引入拆分后的 store 仓库

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import store01 from './modules/store01'
export default new Vuex.Store({
 // 模块化
  modules: {
    store01
  }
})
```

- 拆分后的仓库 store01.js

```js
export default {
  state: {
      count:10
  },
  getters: {},
  mutations: {},
  actions: {}
}
```

- 有一点需要注意，模块化的仓库，…mapState 函数的映射方法是有区别的

```js
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      count: (state) => state.store01.count, // 使用对象来指定 count 是来自哪个模块的数据
    }),
  },
}
</script>
```
