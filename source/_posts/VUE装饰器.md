---
title: "VUE装饰器"
date: 2021-05-11 07:41:12
tags:
  - 知识点
  - 笔记
  - 进阶
source: https://meitian3611.github.io/2021/05/11/VUE装饰器/
---

## vue-property-decorator装饰器用法

> 在Vue 中使用 TypeScript，使用vue装饰器来简化代码书写，大大提升开发效率

- @Component
- @Emit
- @Prop
- @PropSync
- @Watch
- @Inject
- @Provide
- @Model
- @Ref
- Mixins

<!-- more -->

### @Component 声明组件

```
import { Vue,Component } from 'vue-property-decorator' // 引入装饰器
import helloWorld from '@/components'
@Component({
    helloWorld // 其他组件声明
})
// @Component
export default class '组件名' extends Vue {
    private valueA: string = '我是ValueA'  // 相当于data里的变量
    private valueB: number[] = [1,2,3]
    private valuec: Array<any> = [1,2,3,'4',true]
    private get valued () {  // 计算属性的写法,相当于getter
        return 1
    }
}
```

> 总结：
>
> 1. 对于`data`里的变量，直接按Ts定义类变量的写法写即可
> 2. 对于vue的计算属性，我们只需要在计算属性名称前缀添加get的函数即可

### @Emit

> 关于`Vue`中的事件的监听与触发,`Vue`提供了两个函数`$emit`和`$on`.那么在`vue-property-decorator`中如何使用呢?  
>  这就需要用到`vue-property-decorator`提供的`@Emit`属性

```
<template>
	<div @click="changeData(str)">子组件:{{ str }}</div>
</template>

<script lang="ts">
import { Component, Emit } from 'vue-property-decorator';
import Vue from 'vue';

@Component({})
export default class childTest extends Vue {
    str:any = '123'
	@Emit() // 默认不传参，那么触发的事件名就是它所修饰的函数名：changeData
	changeData(str: any) {}
}
</script>
```

```
<template>
	<div>
        <!-- 父组件 -->
		<child-test @change-data="changeData"></child-test>
    </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import childTest from '@/components/component-childTest';
import Vue from 'vue';

@Component({
	components: {
		'child-test': childTest // 统一规范为中划线格式组件
	}
})
export default class father extends Vue {
	/** 子组件绑定事件 */
	public changeData(n) {
        console.log(n) // 获取子组件传递的参数 123
	}
}
</script>
```

> 总结：
>
> 1. 在`Vue`中我们是使用`$emit`触发事件,使用`vue-property-decorator`时,可以借助`@Emit`装饰器来实现.`@Emit`修饰的函数所接受的参数会在运行之后触发事件的时候传递过去.
> 2. `@Emit()`不传参数,那么它触发的事件名就是它所修饰的函数名.
> 3. `@Emit(name: string)`,里面传递一个字符串,该字符串为要触发的事件名.

### @Prop

**常规写法**

```
<script>
export default {
  props: {
    propA: {
      type: Number
    },
    propB: {
      default: 'default value'
    },
    propC: {
      type: [String, Boolean]
    },
  }
}
</script>
```

**使用装饰器**

```
<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator';
    @Component({})
    export default class "组件名" extends Vue{
        @Prop(Number) propA!: number;
        @Prop({default: 'default value'}) propB!: string;
        @propC([String, Boolean]) propC: string | boolean;
    }
</script>
```

> 总结：
>
> 1. `@Prop`接受一个参数，可以是类型变量或者对象或者数组.`@Prop`接受的类型比如`Number`是`JavaScript`的类型,之后定义的属性类型number则是`TypeScript`的类型.
> 2. 这里 `!`和可选参数`?`是相反的, `!`告诉`TypeScript`这个参数是必传的，`?`则表示参数是不需要必传的

### @Watch

**常规写法**

```
<script>
export default {
    watch: {
        'child': this.onChangeValue
            // 这种写法默认 `immediate`和`deep`为`false`
        ,
        'person': {
            handler: 'onChangeValue',
            immediate: true,
            deep: true
        }
    },
    methods: {
        onChangeValue(newVal, oldVal){
            // todo...
        }
    }
}
</script>
```

**使用装饰器**

```
<script lang='ts'>
export default class childTest extends Vue {
    // 写法一
	@Watch('str', { immediate: true, deep: true }) // 默认执行一次 && 深度监听
	onChangeVal(newVal: string, oldVal: string) {
		// todo...
	}
    // 写法二
    @Watch('str')
	onChangeVal(newVal: string, oldVal: string) {
		// todo...
	}
}
</script>
```

> 总结：
>
> 1. `@Watch`使用非常简单,接受第一个参数为要监听的属性名 第二个属性为可选对象.`@Watch`所装饰的函数即监听到属性变化之后的操作.

### @Provide提供/@Inject注入

```
<script lang='ts'>
export default class childTest extends Vue {
    @Provide()
	foo = '123456'; // 父组件通过@Provide传递
}
</script>
```

```
<template>
	<div>{{ foo }}</div>
</template>
<script lang='ts'>
export default class childTest extends Vue {
    @Inject()
	foo!: string; // 子组件通过@Inject获取
}
</script>
```

> 总结：
>
> 1. 父组件不便于向子组件传递数据，就把数据通过provide传递下去，然后子组件通过Inject来获取
