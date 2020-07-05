---
title: Vue的组件通信
date: 2020-02-09 16:56:41
tags:
	- 笔记
	- 组件
	- 复习
categories: Vue
---

## 父组件向子组件传递数据

**子组件**

```vue
// TestOne.vue
<template>
  <div>我是{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
      //采用对象的形式接收
    msg: {
        type:String,  //字符串格式
        default:' '   // 默认值
        required:true //是否必须传递
    } 
  }
}
</script>
```

**父组件**

```vue
<template>
  <div class="page-home">
    <h1>首页</h1>
    <One :msg="name"></One> //引入子组件后将数据传递给子组件使用
  </div>
</template>
<script>
import One from '../components/TestOne' // 引入子组件
export default {
  components: {
    One // 注册子组件
  },
  data() {
    return {
      name: '父级传递的数据'
    }
  }
}
</script>
```

**补充一点**：传入一个对象的所有属性

```vue
// 假如父组件需要传入大量的属性，这时候就需要在子组件标签一个个传递，非常麻烦
<One :name='list.name' :age='list.age' :sex='list.sex' :money='list.money' ></One>

// 为了处理这种情况，可以采用 v-bind ,注意并不是冒号而是等于号
<One v-bind='list'></One>

data(){
  return{
	list:{
		name:'张三',
		age:18,
		sex:'男',
		money:99
		}
	}
}
```



**总结**

-  子组件在props中创建一个属性，用以接收父组件传过来的值 
-  父组件中注册子组件 
-  父组件在子组件标签中添加子组件props中创建的属性 
-  父组件把需要传给子组件的值赋给该属性 
-  由于单向数据流，子组件不能去修改父组件传递的值



## 子组件向父组件传递数据

**子组件**

```vue
<template>
  <div>
      {{ message }}
    <button @click="handelClick">修改父组件</button>
  </div>
</template>

<script>
export default {
  data(){
    return{
     message:'我是子组件'
    }
 }
  methods:{
    handelClick(){
     this.$emit('child','子组件修改父组件') // 第一个参数为自定义事件，第二个参数是传递给父组件的值
    }
  }
}
</script>
```

**父组件**

```vue
<template>
  <div class="page-home">
    <h1>首页 {{ title }}</h1> 
    <One @child="father"></One> // 使用自定义事件绑定一个事件函数
  </div>
</template>
<script>
import One from '../components/TestOne'
export default {
  components: {
    One
  },
  data() {
    return {
      title: '我是父组件' // 修改为 value 的值
    }
  },
  methods: {
    father(value) {
      this.title = value // 将接收到的数据传递给自身
    }
  }
}
</script>
```

**总结**

- 子组件绑定点击事件，在事件函数中调用 $emit()
- $emit 中传递两个参数，自定义事件和需要传递的数据
- 父组件中使用设定好的自定义事件，接收并绑定在一个函数中
- 将绑定的函数中携带的 $event 赋值给data的属性

