---
title: "React 19 核心知识整理（Hooks / Zustand / Router）"
published: 2026-09-03
updated: 2026-09-03
description: "React 19 核心知识梳理：不可变状态更新、副作用与依赖数组、渲染优化、自定义 Hook、Zustand 与 React Router，含 React 16/18/19 特性对比、高频坑位清单与 Vue 迁移对照表。"
tags: [React, Hooks, Zustand]
category: 前端开发
draft: false
---

> 本文面向有 Vue 经验、要上手 React 的人，按「基本概念 → Hooks → 自定义 Hook → Zustand → Router → 版本特性对比 → 坑位」的顺序组织，从上往下读一遍即可。赶时间的话直接看开头速查表和第十章坑位清单，Vue 转过来的拉到最后看对照表

## 速查表

| Hook | 干什么 | 什么时候用 |
| --- | --- | --- |
| `useState` | 声明会驱动界面的状态 | 值变了界面要跟着变 |
| `useEffect` | 声明副作用 | 发请求、订阅、定时器、改 DOM |
| `useRef` | 跨渲染存一个可变值 | 拿 DOM、存不触发渲染的标记 |
| `useMemo` | 缓存计算结果 / 稳定引用 | 重计算，或下游依赖引用相等 |
| `useCallback` | 缓存函数引用 | 配合 `memo` 子组件，或作为 effect 依赖 |
| 自定义 Hook | 复用带状态的逻辑 | 多处用到同一段逻辑 |

`useRef` 和 `useState` 的区分：要显示在界面上的用 state，只是「记住一下」的用 ref。

## 一、五个基本概念

这一章不涉及具体 API，先把 React 的几条规定说清楚。后面各章的写法都能从这里推出来。

### 1. 界面由状态推导出来

React 里没有「当前界面」这样一个可被直接修改的对象，界面是每次渲染时从 state 现算出来的。

```tsx
// 描述的是关系：collapsed 为真时宽 80，否则 240
<Sider collapsed={collapsed} width={collapsed ? 80 : 240} />
```

要改宽度就去改 `collapsed`，不要拿 DOM 节点改 style。好处是界面不会和状态对不上——state 是对的，界面就是对的。

代价是任何影响界面的东西都得进 state，包括 loading、错误提示、弹窗开关这些。

### 2. 数据向下，事件向上

父组件通过 props 把数据传下去，子组件拿到的是只读值。子组件要改，只能调用父组件传下来的函数。

```tsx
<PortalMenu collapsed={collapsed} />                              {/* 只读 */}
<PortalTop collapsed={collapsed} setCollapsed={setCollapsed} />    {/* 读 + 改 */}
```

这条规定有个直接结论：**两个兄弟组件要共享状态，就得把状态提到它们最近的公共父组件**，也就是常说的状态提升。

### 3. 渲染就是重新执行组件函数

`collapsed` 一变，`Portal` 这个函数会整体重新跑一遍，返回新的 JSX，React 再对比新旧结果去更新 DOM。

```tsx
function Portal() {
  const [collapsed, setCollapsed] = useState(false);
  // collapsed 变化时，从这里往下全部重新执行
}
```

由此推出一件重要的事：**函数体里创建的普通变量、函数、对象，每次渲染都是新的**。第五章的 `useMemo` / `useCallback` 全是为了处理这件事。

### 4. 变更要产生新引用

React 判断「状态变了没」用的是引用比较（`Object.is`）。原地修改数组或对象，引用没变，React 就认为没变，不重新渲染。

```ts
tabList.push(newTab);
setTabList(tabList);               // 引用没变，不渲染

setTabList([...tabList, newTab]);  // 新数组，正常渲染
```

### 5. 渲染之外的事要单独声明

发请求、订阅、定时器、直接改 `document` 这些不属于「算界面」的动作，统称副作用。它们必须写在 `useEffect` 里，React 才知道什么时候执行、什么时候清理。

```tsx
useEffect(() => {
  fetchUserInfo();
  return () => { /* 卸载时清理 */ };
}, []);
```

`useEffect` 的定位是逃生舱，用来接外部系统。能由 props 或 state 直接算出来的东西，不要放进 state，更不要用 effect 去同步——那样只会多渲染一次，还容易漏依赖。

## 二、useState：状态与不可变更新

```tsx
const [collapsed, setCollapsed] = useState(false);
//     ↑ 当前值        ↑ 更新函数        ↑ 初始值（只在首次渲染生效）
```

### 函数式更新

```tsx
// 连续调用两次，结果只加 1
setCount(count + 1);
setCount(count + 1);
// 原因：两次读到的 count 都是本次渲染快照里的同一个值

// 基于最新值计算
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);   // 结果 +2
```

新值依赖旧值时，用函数式更新。

### 不可变更新的几种写法

```ts
// 新增用展开、删除用 filter、修改用 map
setTabList([...tabList, newTab]);
setList(list.filter((i) => i.id !== id));
setList(list.map((i) => (i.id === id ? { ...i, done: true } : i)));

// 对象：展开覆盖
setUser({ ...user, name: "newName" });

// 嵌套对象：逐层展开，层级深了建议上 immer
setState({ ...state, user: { ...state.user, age: 18 } });
```

::::warning[从 Vue 转过来容易踩的坑]
Vue 3 的 `reactive` 允许 `arr.push(x)` 直接响应，React 必须 `setArr([...arr, x])`。写惯了 Vue 会在这里反复出错。
::::

### 状态放哪一层

找「需要读它的所有组件的最近公共祖先」。层级一深、共享方一多，就该换全局状态库，见第七章。

## 三、useEffect：最容易踩坑的一个

### 依赖数组的三种写法

```tsx
useEffect(() => { /* ... */ });          // 无数组：每次渲染后都跑（基本不用）
useEffect(() => { /* ... */ }, []);      // 空数组：挂载时跑一次
useEffect(() => { /* ... */ }, [a, b]);  // a 或 b 变化时跑
```

### 清理函数

```tsx
useEffect(() => {
  const timer = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(timer);   // 卸载前 / 下次 effect 前执行
}, []);

useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(setData);
  return () => controller.abort();     // 组件卸载或 url 变化时取消请求
}, [url]);
```

### 四个高频坑

| 坑 | 症状 | 怎么处理 |
| --- | --- | --- |
| 依赖数组漏项 | 拿到旧值（stale closure） | 补全依赖，或改函数式更新 |
| 依赖里放每次都变的对象 | effect 无限执行 | `useMemo` 稳定它，或依赖原始字段 |
| effect 里 setState 无中止条件 | 死循环渲染 | 加判断条件 / 加闸门标记 |
| 忘记清理 | 内存泄漏、竞态、重复请求 | 返回清理函数 |

::::warning[StrictMode 下 effect 会跑两遍]
开发环境 React 会故意走一遍「挂载 → 卸载 → 再挂载」，用来暴露清理逻辑的缺陷。所以 effect 必须幂等。如果发现请求发了两次，说明缺一个「已请求过」的守卫。生产环境没这个问题。
::::

### 用 useRef 破解双向同步死循环

中后台常见的一道题：菜单、Tab、路由三者要互相同步。URL 变了要激活对应 Tab，点 Tab 又要跳转路由，两边互相影响，稍不注意就死循环。

做法是拿 `useRef` 记一个标记，区分这次变更是谁发起的：

```tsx
const currentUrl = pathname.replace("/page/", "");
const isUserAction = useRef(false);   // 是否由用户操作引起

// ① 路径变化 → 激活匹配 Tab（URL 是权威来源）
useEffect(() => {
  const item = findKeyByUrl(menusItems, currentUrl);
  if (item) addTabList(item);
}, [menusItems, currentUrl, addTabList, findKeyByUrl]);

// ② activeKey 变化 → 仅在用户操作时才导航
useEffect(() => {
  if (!isUserAction.current) return;   // 关键闸门
  isUserAction.current = false;        // 用完即复位
  const url = findUrlByKey(menusItems, activeKey);
  if (url && url !== currentUrl) navigate(`/page/${url}`);
}, [activeKey]);

// ③ 用户点 Tab 时打标记
const onChange = (key: string) => {
  if (key !== activeKey) isUserAction.current = true;
  setActiveKey(key);
};
```

这个模式一般叫意图标记（intent flag）。Vue 里对应的做法是 `watch` 配一个 `isInternalUpdate` 标志位，思路一样。

差别在于 Vue 的 `watch` 自动收集依赖，React 的 `useEffect` 要手工列依赖，漏一个就是 bug。

## 四、useRef：不触发渲染的变量

```tsx
// 用途①：拿 DOM 节点
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />
inputRef.current?.focus();

// 用途②：存一个「不需要触发渲染」的可变值
const isUserAction = useRef(false);
isUserAction.current = true;   // 改了不会重渲染
```

| | `useRef` | `useState` |
| --- | --- | --- |
| 变化后触发渲染 | 否 | 是 |
| 读取时机 | `.current` 永远是最新值 | 闭包里读到的可能是快照值 |
| 典型用途 | DOM 引用、计时器 id、意图标记 | 影响界面的数据 |

::::tip[React 19 的变化]
`ref` 现在就是普通 prop，不再需要 `forwardRef`：

```tsx
// React 18
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => <input ref={ref} />);

// React 19
function Input({ ref, ...props }: Props) {
  return <input ref={ref} />;
}
```
::::

## 五、useMemo / useCallback / memo：别乱用

组件函数每次渲染整体重跑，函数内的普通变量、函数、对象会全部重建。这三个 API 用来收敛这个成本。

```tsx
function Comp({ items }) {
  const result = useMemo(() => heavyCalc(items), [items]);      // 缓存重计算
  const handler = useCallback(() => save(items), [items]);      // 缓存函数引用
  return <Child data={result} onClick={handler} />;
}

const Child = memo(function Child({ data, onClick }) { /* ... */ });  // props 浅比较
```

### 一个实际例子

```tsx
function useMenuSelection(menusMemo: MenuItemConverted[]) {
  const { pathname } = useLocation();
  const curUrl = pathname.slice(6);

  const keyPath = useMemo(() => findKeyPath(menusMemo, curUrl), [menusMemo, curUrl]);
  const selectedKeys = useMemo(() => [keyPath.at(-1) ?? "IMAS_Index"], [keyPath]);
  const parentKeys = useMemo(() => keyPath.slice(0, -1), [keyPath]);

  return { selectedKeys, parentKeys };
}
```

三个 `useMemo` 的意义并不一样：

- `keyPath` 缓存的是递归遍历整棵菜单树的结果，省的是实打实的计算；
- `selectedKeys` 和 `parentKeys` 本身几乎不花钱，但它们返回的是新数组，缓存的真正作用是**保证引用稳定**——下游要用 `parentKeys !== prevParentKeys` 做引用比较，引用一变语义就错了。

::::tip[useMemo 的另一半用途]
除了省计算，`useMemo` 还常常用来稳引用。后者往往更刚需：引用不稳，下游的引用比较和 `memo` 全部失效。
::::

### 什么时候不该用

```tsx
// 缓存比计算还贵
const name = useMemo(() => user.firstName + user.lastName, [user]);

// 依赖每次都变，缓存永不命中
const data = useMemo(() => process(list), [list]);  // list 是内联字面量
```

加不加看 Profiler，React DevTools 里能看到每个组件的渲染耗时，确实慢了再说。

另外 `memo` 做的是 props 浅比较，必须配 `useCallback` / `useMemo` 使用，否则父组件每次传进来新函数，`memo` 直接失效。

::::note[React Compiler]
官方的 React Compiler 能自动完成这三者的优化，将来手写的这部分可以逐步删掉。现在可以先把 `eslint-plugin-react-hooks@7` 装上（内置 Compiler 规则），把代码风格规范起来。
::::

## 六、自定义 Hook：逻辑复用的正解

React 的逻辑复用走过三代：Mixin（已废弃）→ HOC / Render Props（嵌套地狱）→ 自定义 Hook。

自定义 Hook 就是一个内部用了 Hooks 的普通函数，命名以 `use` 开头。

```tsx
function useMenuSelection(menusMemo: MenuItemConverted[]) {
  const { pathname } = useLocation();      // URL 自己拿，调用方不用管
  const curUrl = pathname.slice(6);
  const keyPath = useMemo(() => findKeyPath(menusMemo, curUrl), [menusMemo, curUrl]);

  return { selectedKeys, parentKeys };     // 用对象返回，方便按需解构
}
```

几条约定：

- 命名 `useXxx`，ESLint 靠这个前缀判断 Hook 规则；
- 纯函数、常量定义在 Hook 外部，避免每次渲染重复创建；
- 返回值用对象，后续扩展方便；
- 想清楚这是派生逻辑（无 state）还是状态容器（有 state，要处理同步）；
- 不要在条件或循环里调用 Hook，Hooks 依赖调用顺序；
- 不要在普通函数里调用 Hook。

### render 期 setState

下面这段看着违反规则，在 render 期间调了 setState：

```tsx
function useMenuOpenKeys(menusMemo, parentKeys = []) {
  const [stateOpenKeys, setStateOpenKeys] = useState(parentKeys);
  const [prevParentKeys, setPrevParentKeys] = useState(parentKeys);

  if (parentKeys !== prevParentKeys) {
    setPrevParentKeys(parentKeys);
    setStateOpenKeys((prev) => [...new Set([...prev, ...parentKeys])]);
  }
  // ...
}
```

这是官方认可的「根据 props 变化调整 state」写法，有三个前提：必须条件执行，否则无限渲染；只能改本组件自己的 state；React 会丢弃本次渲染结果重新跑，不会把中间态刷到屏幕上。

不用 `useEffect` 的原因：effect 方案的流程是「渲染旧值 → 提交到 DOM（用户看到菜单没展开）→ 跑 effect → 再渲染」，中间态会闪一下。render 期 setState 在提交到屏幕之前就纠正了。

::::warning[这里有隐式契约]
这个写法强依赖 `parentKeys` 的引用稳定性，由上游 `useMemo` 保证。谁把那个 `useMemo` 删了，`parentKeys` 每次都是新数组，引用比较永远为真，直接无限渲染。用这种写法记得加注释说明。
::::

## 七、Zustand：现在的主流状态管理

| 方案 | 样板代码 | 适用 |
| --- | --- | --- |
| `useState` + props 透传 | 少 | 层级浅（≤2 层） |
| Context + `useReducer` | 中 | 低频更新（主题、语言） |
| Redux Toolkit | 多 | 大型团队、需要时间旅行调试 |
| Zustand | 极少 | 中后台绝大多数场景 |

用起来不需要 Provider 包裹，store 本身就是一个 Hook。

### 基本用法

```ts
import { create } from "zustand";   // v5 只有具名导出，没有 default

const useStore = create<Store>()((set) => ({
  activeKey: "IMAS_Index",
  tabList: [],

  // 同步：set 返回的对象会自动浅合并，不用自己展开 ...state
  addTabList: (item) =>
    set((state) => {
      const exist = state.tabList.some((t) => t.key === item.key);
      if (exist) return { activeKey: item.key };
      return { tabList: [...state.tabList, item], activeKey: item.key };
    }),

  // 异步：直接 async/await
  fetchMenus: async () => {
    const data = await getMenus();
    set({ menusItems: toMenuItems(data) });
  },
}));
```

`set` 里 `return {}` 表示什么都不改，不会通知订阅者。异步不需要 middleware，也不用作 `pending/fulfilled/rejected` 三件套，await 完直接 set。

### selector 决定订阅粒度

```tsx
// 独立 selector：只订阅用到的字段
const tabList = useStore((state) => state.tabList);
const addTabList = useStore((state) => state.addTabList);

// 订阅整个 store：任何字段变化都会重渲染本组件
const { tabList, activeKey } = useStore();
```

Zustand 会比较 selector 的返回值是否变化（默认 `Object.is`），没变就不重渲染。

一次要取多个值时用 `useShallow`：

```tsx
import { useShallow } from "zustand/react/shallow";

// useShallow 做浅比较
const { tabList, activeKey } = useStore(
  useShallow((state) => ({ tabList: state.tabList, activeKey: state.activeKey })),
);

// 直接返回对象字面量：每次都是新对象，引用永远不等，等于每次都重渲染
```

### 组件外使用

```ts
useStore.getState().addTabList(item);   // 工具函数、路由守卫里直接操作
useStore.setState({ activeKey: "x" });
useStore.subscribe((state) => console.log(state.activeKey));
```

## 八、React Router：Outlet 与懒加载

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Portal />,        // 父路由 = 布局
    children: [
      { path: "", element: <Navigate to="/page/index" /> },           // 默认重定向
      { path: "/page/index", element: lazyLoad(() => import("@/pages/Home")) },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
```

| 概念 | 作用 | Vue 对应 |
| --- | --- | --- |
| `<Outlet />` | 子路由渲染占位符 | `<router-view>` |
| `<Navigate to>` | 重定向 | `redirect` |
| `useNavigate()` | 编程式导航 | `router.push()` |
| `useLocation()` | 当前 location | `route` |
| `useParams()` | 动态路由参数 | `route.params` |
| `lazy` + `Suspense` | 组件级代码分割 | `defineAsyncComponent` |

父路由渲染 Layout，子路由渲染进 `<Outlet />` 所在的位置，嵌套路由就是这么撑起整个布局的。

```tsx
const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Skeleton active />}>   {/* fallback 留空会白屏一瞬 */}
      <Component />
    </Suspense>
  );
};
```

::::tip[React Router 7 支持路由级 lazy]
```tsx
{ path: "/page/index", lazy: async () => ({ Component: (await import("@/pages/Home")).default }) }
```
连 `Suspense` 都不用手写，loader 还能和组件并行预加载。
::::

## 九、React 16 / 18 / 19 特性对比

三个大版本各解决一个问题：16 把渲染架构换成 Fiber，并在 16.8 引入 Hooks；18 把并发渲染正式开放；19 补上异步表单这块，同时开始用编译器自动做优化。17 属于过渡版，只改了 JSX 转换和事件委托，没有新增 API。

| 维度 | React 16（2017） | React 18（2022） | React 19（2024） |
| --- | --- | --- | --- |
| 主线 | Fiber 重写，Hooks（16.8） | 并发渲染落地 | 异步与表单、编译器自动优化 |
| 渲染架构 | Fiber，渲染可中断 | Concurrent 正式可用 | 并发默认，React Compiler 自动加 memo |
| 逻辑复用 | **Hooks**：useState / useEffect / useMemo 等 | — | — |
| 并发控制 | 无 | `useTransition`、`useDeferredValue`、`startTransition` | 沿用，`useDeferredValue` 支持初始值 |
| 批量更新 | 只有事件回调里批处理 | 自动批处理，含 Promise、setTimeout | 沿用，await 之后也批处理 |
| 表单与异步 | 手写 loading + try/catch | 同左 | **Actions**：`useActionState`、`useFormStatus`、`useOptimistic` |
| 读取异步数据 | 无 | 无 | **`use()`**，且允许条件调用 |
| ref | `forwardRef` | `forwardRef` | **ref 作为普通 prop**，不再需要 forwardRef，且支持清理函数 |
| Context | 新 Context API（16.3） | `useContext` | 可直接写 `<Context value={...}>` |
| 文档元数据 | 手写或第三方（react-helmet） | 同左 | 原生支持 `<title>` / `<meta>` / `<link>`，自动提到 head |
| 挂载 API | `ReactDOM.render` | `createRoot` | `createRoot`（render / hydrate 已移除） |
| SSR | `ReactDOM.hydrate` | `hydrateRoot` + 流式 SSR | Server Components、Server Actions |
| 错误边界 | `componentDidCatch`（16.0） | 沿用 | 沿用，hydration 报错改成 diff 展示 |

### React 19 新增的 API

| 特性 | 说明 |
| --- | --- |
| Actions | `<form action={fn}>` + `useActionState` + `useFormStatus` |
| `useOptimistic` | 乐观更新，请求没回来先渲染预期结果 |
| `use()` | 渲染中读取 Promise / Context，允许条件调用 |
| `ref` 作为 prop | 不再需要 `forwardRef` |
| ref 清理函数 | ref 回调可返回清理函数 |
| `<Context value>` | 可代替 `<Context.Provider>` |
| 文档元数据 | 组件里直接写 `<title>` / `<meta>` |
| 资源预加载 | `preload` / `preinit` / `preconnect` / `prefetchDNS` |
| `useDeferredValue` | 新增 `initialValue` 参数 |
| React Compiler | 自动完成 memo / useMemo / useCallback |

### 从 16 / 18 升到 19 要注意

19 删掉了一批 18 就已标废弃的 API，升级前先把控制台警告清干净：

- 函数组件的 `defaultProps` 移除，改用参数默认值；`propTypes` 直接无效
- 字符串 ref、legacy Context（`contextTypes` / `getChildContext`）移除
- `ReactDOM.render`、`ReactDOM.hydrate`、`unmountComponentAtNode`、`findDOMNode` 移除
- `element.ref` 不再可读

另外 `ref` 的语义变了，之前靠 `forwardRef` 转发的组件要改成从 props 里取 `ref`。antd 6 已经适配，从 antd 5 升上来时不用再加 `@ant-design/v5-patch-for-react-19`。

### Actions

中后台表单多，Actions 把提交中 / 错误 / 成功三个状态内建了：

```tsx
function UpdateForm() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const res = await updateUser(formData);
      return res.ok ? { ok: true } : { error: res.message };
    },
    { ok: false },
  );

  return (
    <form action={submitAction}>
      <input name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? "提交中..." : "提交"}
      </button>
      {state.error && <span>{state.error}</span>}
    </form>
  );
}
```

对比手写 loading state 加 `try/catch/finally`，样板代码少一半。

## 十、高频坑位清单

| # | 坑 | 怎么处理 |
| --- | --- | --- |
| 1 | 用数组下标当 `key` | 用稳定唯一 id。下标会让插入/删除时全部错位，导致重建和表单状态错乱 |
| 2 | 依赖数组漏项 | 补全依赖，或改函数式更新 |
| 3 | `arr.push()` 后 setState | 必须产生新引用：`[...arr, x]` |
| 4 | effect 里 setState 无中止条件 | 加判断 / 加 ref 闸门 |
| 5 | 忘记返回清理函数 | 定时器、订阅、请求都要清 |
| 6 | 到处加 `useMemo` | 看 Profiler，缓存本身也有开销 |
| 7 | `memo` 配内联箭头函数 | 必须配 `useCallback`，否则 `memo` 失效 |
| 8 | 用 `useEffect` 做数据转换 | render 期间直接算，或 `useMemo` |
| 9 | 全量订阅 store | 用独立 selector 或 `useShallow` |
| 10 | `Suspense fallback` 留空 | 用 `Skeleton` / `Spin` |

## 附：Vue → React 对照表

| Vue 3 | React 19 | 差异 |
| --- | --- | --- |
| `ref()` / `reactive()` | `useState()` | React 要显式 setState |
| `computed()` | `useMemo()` | Vue 自动收集依赖，React 手工列 |
| `watch()` / `watchEffect()` | `useEffect()` | 同上，这是转过来最大的障碍 |
| `onMounted()` | `useEffect(fn, [])` | |
| `onUnmounted()` | `useEffect(() => () => {}, [])` | React 用返回清理函数 |
| `defineProps()` | 函数参数 + TS interface | |
| `defineEmits()` | 父传回调函数 prop | |
| `<slot />` | `children` / render props | |
| Pinia store | Zustand store | 概念接近 |
| `v-if` | `{cond && <X />}` | |
| `v-for` | `{list.map(...)}` | React 必须带 key |
| `v-model` | `value` + `onChange` | React 没有双向绑定语法糖 |
| `class` / `:style` | `className` / `style={{marginTop: 8}}` | React 数值自动加 px |
| `<router-view>` | `<Outlet />` | |
| `defineAsyncComponent` | `lazy()` + `Suspense` | |
| Composable `useXxx` | 自定义 Hook `useXxx` | 概念基本一样 |
| `<Teleport>` | `createPortal()` | |
| `<KeepAlive>` | 需第三方（react-activation） | React 官方未提供 |
| `nextTick()` | `useLayoutEffect` / `flushSync` | |

### 几个要转过来的习惯

1. **依赖要自己列**。Vue 的依赖收集是自动的，React 的依赖数组是手工的。写 `useEffect` 时得问自己：这个函数用到了哪些会变的东西。
2. **变更要产生新引用**。Vue 3 允许 `arr.push(x)`，React 必须 `setArr([...arr, x])`。
3. **更新是重算加对比**。Vue 改一个字段只更新依赖它的组件，React 默认重跑整棵子树。所以控制渲染边界（`memo`、selector、状态放置位置）是 React 的常规技能。

## 学习顺序

- **阶段一（能写）**：组件、JSX、props / state、事件与受控表单、条件与列表渲染。产出：手写一个 Tab 切换组件
- **阶段二（写对）**：`useEffect` 的依赖与清理、`useRef`、状态提升、自定义 Hook
- **阶段三（写好）**：Zustand selector 粒度、性能 Hook 取舍、路由嵌套与懒加载、请求层封装、TS 类型套路。产出：一个完整 CRUD 模块
- **阶段四（原理）**：Fiber 与并发渲染、协调算法与 key、React 19 Actions、Profiler 性能剖析
