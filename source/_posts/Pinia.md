---
title: "Pinia"
date: 2022-03-04 07:59:41
tags:
  - 知识点
  - 笔记
  - 常用
source: https://meitian3611.github.io/2022/03/04/Pinia/
---

> Pinia是Vue生态里Vuex的代替者，一个全新Vue的状态管理库。在Vue3成为正式版以后，尤雨溪强势推荐的项目就是Pinia。那先来看看Pinia比Vuex好的地方，也就是Pinia的五大优势。

<!-- more -->

## pinia五大优势

1. 可以对Vue2和Vue3做到很好的支持，也就是老项目也可以使用Pinia。
2. 抛弃了Mutations的操作，只有state、getters和actions.极大的简化了状态管理库的使用，让代码编写更加容易直观。
3. 不需要嵌套模块，符合Vue3的Composition api ，让代码更加扁平化。
4. 完整的TypeScript支持。Vue3版本的一大优势就是对TypeScript的支持，所以Pinia也做到了完整的支持。如果你对Vuex很熟悉的化，一定知道Vuex对TS的语法支持不是完整的（经常被吐槽）。
5. 代码更加简洁，可以实现很好的代码自动分割。Vue2的时代，写代码需要来回翻滚屏幕屏幕找变量，非常的麻烦，Vue3的Composition api完美了解决这个问题。 可以实现代码自动分割，pinia也同样继承了这个优点。

如果你说这五点有点太多了，记不住。可以简单总结Pinia的优势就是，更加简洁的语法，完美支持Vue3的Composition api 和 对TypesCcript的完美支持。这些优势和尤雨溪的强烈推荐，个人觉得很快Pinia就会完全取代Vuex，成为最适合Vue3的状态管理库。

另外说一点，其实pinia的开发团队，就是Vuex的开发团队。

> **pinia的安装**

安装好Vue3的开发环境后，就可以安装Pinia状态管理库了。安装的方法依然是使用`npm` 来安装。

```powershell
npm install pinia
# or with yarn
yarn add pinia
```

## 用Pinia的方式创建一个Store

> **在main.js中引入Pinia**

安装好Pinia后，需要作的第一件事就是在`/src/main.ts`里引入`pinia`。 这里我们直接使用`import`引入。

引入后，通过`createPinia( )`方法，得到pinia的实例和挂载到Vue根实例上。

```js
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

// 创建pinia 实例
const pinia = createPinia();
const app = createApp(App);
// 挂载到 Vue 根实例上
app.use(pinia);
app.mount("#app");
```

这样我们就在项目中引入了`Pinia`,也就是说我们可以在项目中使用它进行编程了。

> **创建store状态管理库**

引入Pinia后，就可以创建状态管理库了，也就是常说的`Store`。直接在`/src`目录下，新建一个`store`文件夹。有了文件夹之后，再创建一个`index.ts`文件。

这个文件里的代码，我们一般只做三件事。

1. 定义状态容器(仓库)
2. 修改容器(仓库)中的 state
3. 仓库中的 action 的使用

明确了这四件事以后，我们来编写代码。先来定义容器,这个写法是固定的，你甚至可以在VSCode中定义一个代码片段，以后用到的时候，直接可以生成这样的代码

```js
// src/store/index.ts
import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {};
  },
  getters: {},
  actions: {},
});
```

写完这段代码，你会感觉这个很像一个Vue的小组件，这也算是Pinia的一个优点。

- `defineStore( )`方法的第一个参数：相当于为容器起一个名字。`注意：这里的名字必须唯一，不能重复`。这个是官方特别说明的一个事情。
- `defineStore( )`方法的第二个参数：可以简单理解为一个配置对象，里边是对容器仓库的配置说明。当然这种说明是以对象的形式。
- state 属性：用来存储全局的状态的，这里边定义的，就可以是为SPA里全局的状态了。
- getters属性：用来监视或者说是计算状态的变化的，有缓存的功能。
- actions属性：对state里数据变化的业务逻辑，需求不同，编写逻辑不同。说白了就是修改state全局状态数据的。

我们在Store里定义一个State，我们这里就写`Hello`。

```js
state:()=>{
 return {
      hello:'Hello Pinia'
    }
  },
```

这时候这个`hello`就是全局的状态数据，是每个页面和组件都可以通过Pinia方法读取到的。

> **在vue组件里 读取 Store数据**

在`\src\components`里，新建一个`test.vue`的组件。

```js
<template>
  <h2 class="">{{ store.hello }}</h2>
</template>

<script lang="ts" setup>
import { mainStore } from "../store/index";
const store = mainStore();
</script>

<style lang="scss" scoped></style>
```

先引入`mainStore`,然后通过`mainStore`得到`store`实例，就可以在组件里调用store里的`state`定义的状态数据了。

写好这个组件后，到`App.vue`里引入，就可以使用了。

```js
<script setup lang="ts">
import test from "./components/test.vue";
</script>

<template>
  <test></test>
</template>

<style>

</style>
```

## Pinia修改状态数据的四种方式

首先在`\store\index.ts`的state属性中，增加一个状态数据`count : 0`.

```js
state:()=>{
 return {
    hello:'Hello Pinia',
    count:0
  }
},
```

添加一个状态数据后，在任意的组件中，可以对其进行修改操作

> 1. **直接对状态数据进行修改**

```js
<template>
  <div><button @click="handleClick">点击增加,对状态数据进行修改</button></div>
</template>

<script lang="ts" setup>
import { mainStore } from "../store/index";
const store = mainStore();

const handleClick = () => {
  store.count++; // 最简单的一种修改方式
};
</script>

<style lang="scss" scoped></style>
```

我们先写了一个按钮，点击后直接执行`handleClick`方法。你会发现，这种改变状态数据的方法是非常方便的，要比`Vuex`简洁太多了。

- 这种修改方式虽然简单直接，但是修改的状态数据如果存在多条，就需要逐条修改，稍微繁琐了一些

> 2. **使用 $patch 修改多条数据**

```javascript
const handleClick = () => {
  store.$patch({
    count: store.count + 2,
    hello: store.hello + "1234",
  });
};
```

- 简单来讲，修改单条数据就直接使用第一种，多条数据就使用 `$patch`
- 其实第一种也可以实现 `$patch` 的功能，无非是繁琐一点点，为什么更推荐 `$patch`呢？

因为Pinia 的官方网站，已经明确表示`$patch`的方式是经过优化的，会加快修改速度，对程序的性能有很大的好处。所以如果你是多条数据同时更新状态数据，推荐使用`$patch`方式更新。

> 3. **$patch 加函数的形式修改数据**

上面的`$patch`方法，我们的参数使用的是一个对象。还有一种方式是传递函数，这种方法适合复杂数据的修改，比如数组、对象的修改。

```js
const handleClickMethod = () => {
  store.$patch((state) => {
    state.count++;
    state.hello = state.hello + "1234";
  });
};
```

> 4. **在actions中写好逻辑，其它组件再调用actions**

如果你有一个修改的过程非常复杂，你可以先在`store`里，定义好`actions`中的函数，然后在组件里再调用函数。

我们先到`\src\store\index.ts`文件里，在`actions`的地方编写一个`changeState( )`方法，用来改变数据状态。代码如下：

```js
actions:{
    changeState(){
 this.count++
 this.hello='hello actios'
    }
  }
```

有了这个`changeState( )`函数后，就可以在组件中调用这个函数来修改状态数据了。

```js
const handleClickActions = () => {
  store.changeState();
};
```

- 注意：在用`actions`的时候，不能使用箭头函数，因为箭头函数绑定是外部的this。

## Pinia 的解构取值问题

> 在引入 store 的时候，我们只需要其中两个状态怎么办，当然可以采用解构的方式获取

```js
<script lang="ts" setup>
import { mainStore } from "../store/index";
const store = mainStore();
const { hello, count } = store;
</script>
```

这样看似简单，但通过解构的数据，只有一次作用，不是响应式数据（容易踩坑）。也就是说当你改变数据状态时，解构的状态数据不会发生变化。

于是官方文档提供了`storeToRefs( )`方法。这个方法在`Pinia`中，所以我们先用`import`引入。

```js
<script lang="ts" setup>
import { mainStore } from "../store/index";
import { storeToRefs } from "pinia"; // 引入 storeToRefs

const store = mainStore();
const { hello, count } = storeToRefs(store); // 使用 storeToRefs() 使得解构出的数据变为响应式数据
</script>
```

## Pinia 中 Getters 使用

> Pinia中的Getter和Vue中的计算属性几乎一样，就是在获取State的值时作一些处理。

```js
state:()=>{
 return {
    hello:'Hello',
    count:0,
    str:'Pinia'
  }
},
```

假设现在需要将 `hello`和`str两个状态数据拼接起来`，可以在 getters 中编写一个方法

```js
getters:{
    strJoin(state){
 return state.hello + state.str
    }
  },
```

然后其他组件中可以直接使用这个方法：

```js
<template>
  <h2>{{ hello }}</h2>
  <h2>{{ str }}</h2>
  <h2>{{ strJoin }}</h2>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore();
const { hello, str, strJoin } = storeToRefs(store); // 解构
</script>

<style lang="scss" scoped></style>
```

> Getters 的缓存特性

同一个组件中，即使调用了 `strJoin`多次，Getters 也只会执行一次

## Pinia 中 Store 的互相调用

上面举的例子一直只使用了一个`Store`仓库，在真实项目中我们往往是有多个`Store`的。有多个`Stroe`时，就会涉及Store内部的互相调用问题。

在`\src\store`下新建一个`test.ts`文件。然后下入下面的代码。

```js
import { defineStore } from "pinia";

export const testStore = defineStore("test", {
  state: () => {
    return {
      list: ["小红", "小美", "小明"],
    };
  },
});
```

这是一个非常简单的仓库，只有`state`（状态数据），需要注意的是`ID`要是唯一的。有了这个仓库后，就可以回到`index.ts`这个仓库中调用了

```js
import { defineStore } from "pinia";
import { testStore } from "./test";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      helloWorld: "Hello Pinia",
      count: 0,
    };
  },
  getters: {},
  actions: {
    getList() {
      console.log(testStore().list); // 这里就已经获取到了 testStore 仓库的数据
    },
  },
});
```

这就实现了多个仓库之间的互相调用，其它组件中直接调用 actions 即可

```js
const getList = () => {
  store.getList();
};
```

文章摘录：[点击进入原文地址](https://jspang.com/detailed?id=82)
