---
title: "Vue 装饰器（vue-property-decorator）"
published: 2021-05-11
updated: 2026-08-28
description: "vue-property-decorator 装饰器用法速查"
tags: [Vue, TypeScript]
category: 前端开发
---

`vue-property-decorator` 是 Vue 2 + TypeScript 场景下的常用装饰器库，基于 `vue-class-component` 封装，用类组件语法替代冗长的 options 写法，提升代码可读性与类型安全。

## 装饰器一览

| 装饰器 | 作用 |
| --- | --- |
| `@Component` | 声明类组件 |
| `@Prop` / `@PropSync` | 声明 props / 双向同步父子 props |
| `@Emit` | 触发事件 |
| `@Watch` | 监听数据变化 |
| `@Provide` / `@Inject` | 跨层级传值 |
| `@Model` | 自定义 `v-model` |
| `@Ref` | 获取元素或子组件引用 |
| `Mixins` | 混入复用逻辑 |

## @Component 声明组件

`@Component` 标记类组件，`components`、`mixins` 等配置写在参数对象中：

```ts
import { Vue, Component } from "vue-property-decorator";

@Component({
    components: { HelloWorld },
})
export default class MyComponent extends Vue {
    // data：直接声明为类属性
    private message: string = "Hello";

    // computed：以 getter 形式书写
    private get reversedMessage(): string {
        return this.message.split("").reverse().join("");
    }
}
```

## @Prop 接收 props

```ts
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class MyComponent extends Vue {
    @Prop(Number) propA!: number;
    @Prop({ default: "default value" }) propB!: string;
    @Prop([String, Boolean]) propC!: string | boolean;
}
```

要点：

- `@Prop` 的参数是**运行时类型**（`Number`、`String`、数组等），属性注解是 **TS 类型**（`number`、`string`），两者含义不同；
- `!` 表示必传（非空断言），`?` 表示可选；
- 需要默认值或类型校验时传入对象形式：`@Prop({ default: ... })`。

## @Emit 触发事件

子组件中触发事件，父组件通过 `@change-data` 监听：

```ts
// 子组件
@Component({})
export default class Child extends Vue {
    str: string = "123";

    @Emit()
    changeData(str: string) {} // 事件名：change-data
}
```

```vue
<!-- 父组件 -->
<Child @change-data="handleChange" />
```

要点：

- `@Emit()` 不传参数时，事件名默认为函数名的 **kebab-case** 形式（`changeData` → `change-data`）；
- 可显式指定事件名：`@Emit("reset")`；
- 函数有返回值时，返回值作为事件**第一个**参数，函数入参依次排在后面。

## @Watch 监听数据

```ts
@Component({})
export default class MyComponent extends Vue {
    // 深度监听 + 立即执行一次
    @Watch("person", { deep: true, immediate: true })
    onChangePerson(newVal: string, oldVal: string) {
        // todo...
    }
}
```

> 第一个参数为要监听的属性名（支持 `"a.b"` 点路径），第二个参数对应 options 的 `immediate` / `deep` 配置。

## @Provide / @Inject 跨层级传值

适用于深层组件传值，免去逐层传递 `props`：

```ts
// 祖先组件：提供数据
@Component({})
export default class Parent extends Vue {
    @Provide() foo: string = "123456";
}
```

```ts
// 后代组件：注入数据
@Component({})
export default class Child extends Vue {
    @Inject() foo!: string;
}
```

> 需要自定义 key 时使用 `@Provide("key")` / `@Inject("key")` 成对指定。

## @PropSync 双向同步 props

生成一个以 `Sync` 结尾的本地属性，修改时自动触发 `update:propName` 事件，配合父组件 `:xxx.sync` 使用：

```ts
@Component({})
export default class Child extends Vue {
    @PropSync("visible") syncedVisible!: boolean;
}
```

```vue
<!-- 父组件 -->
<Child :visible.sync="dialogVisible" />
```

> 本地属性名必须为 `prop名 + Sync`（如 `visible` → `syncedVisible`）；子组件内直接赋值 `this.syncedVisible` 即可同步给父组件，无需手动 `$emit`。

## @Model 自定义 v-model

指定组件 `v-model` 绑定的 prop 与事件名：

```ts
@Component({})
export default class MyCheckbox extends Vue {
    @Model("change", { type: Boolean }) checked!: boolean;
}
```

> 等价于 `model: { prop: "checked", event: "change" }`。

## @Ref 获取引用

获取模板中的元素或子组件引用，等价于 `this.$refs.xxx`：

```ts
@Component({})
export default class MyComponent extends Vue {
    @Ref("inputRef") readonly inputEl!: HTMLInputElement;
    @Ref() readonly child!: ChildComponent; // 不传参数时使用属性名作为 ref 名
}
```

## Mixins 混入

```ts
import { Mixins } from "vue-property-decorator";

class BaseMixin extends Vue {
    public sayHello(): void {
        console.log("hello");
    }
}

@Component({})
export default class MyComponent extends Mixins(BaseMixin) {}
```

> 多个混入依次传入：`Mixins(MixinA, MixinB)`；也可用 `@Component({ mixins: [...] })` 等价声明。

## 总结

- `@Prop` 的参数是运行时类型，属性注解是 TS 类型，不要混用；
- 事件名默认 kebab-case，需要自定义时用 `@Emit("name")`；
- `!` 表示必传，`?` 表示可选；
- 装饰器写法最终编译为 options API，配合 TS 可享受更严格的类型检查，适合中大型 Vue 2 项目。
