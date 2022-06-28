## Vue3 + ElementPlus基础模板

### 在线预览地址

<a target="_blank" href="https://libwiki.github.io/vue3-elementPlus-template/">https://libwiki.github.io/vue3-elementPlus-template/ </a>

### 主要依赖

* [Vue3文档](https://v3.cn.vuejs.org/)
* [ElementPlus组件库文档](https://element-plus.gitee.io/zh-CN/)
* [VueRouter4路由文档](https://router.vuejs.org/zh/)
* [Tailwindcss原子css库文档](https://www.tailwindcss.cn/)
* [Pinia状态管理器参考文档](https://pinia.web3doc.top//)

### 开发启动

```shell
# 依赖安装
npm install

# 复制一份开发环境的env配置
copy .env.development.back .env.development

# 开发环境启动
npm run dev

# 打包编译
npm run build

```

### 推荐启动的IDE与插件

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### 路由```meta```页面配置说明


```js
const meta = {
    title: "首页", // 标题 在```src/layouts/Main.vue```文件中使用
    // noToken: true, // 无需登录验证的界面 （路由拦截中使用）
}
```

### 基础配置文件与导航菜单配置

* 1、```src/config/Config.js```为项目全局基础配置，项目中将直接引用该文件。配置的上游数据来源于项目根目录下的```.env.*```

### axios网络请求库的两次封装

* 1、```src/utils/net.js```文件主要为```axios```的实例创建以及前置、后置处理
* 2、```src/api/Http.js```文件为```axios```实例的易用性封装（实际进行网络请求会直接使用该模块）
* 3、网络库的具体使用案例请参考：```src/api/modules/User.js````

### 用户登录功能hooks参考

* 1、用户登录等相关功能均在```src/hooks/user/useUserLogin.js```文件中处理了（该文件仅是一个hooks使用案例，抛砖引玉，可移除。如果需要使用请完善内部的登录、退出、请求用户信息函数的功能）

### 关于Tailwindcss原子css库的配置说明

* 项目中的配置请查看：```tailwind.config.js```文件
* 项目中使用的```spacing```与```tailwindcss```的官方有所区别，使用了```0~96px```的数值。（需要改动可自行配置即可）
* 注：项目中页面如果发现```Tailwindcss```无效问题，只需要在```style```区块中提供任意的css即可，例：```.t{}```

### 关于全局less的使用

* 项目在使用```Tailwindcss```的同时依然支持```less```,```vite.config.js css.preprocessorOptions```中自动引入了```src/styles/index.less```
  文件（该css文件是优先于其它css文件引入的，故此如果希望设置某个全局样式，并且希望优先级低于```Tailwindcss```时可参考```src/styles/base.less```）
* 故如果需要设置任何全局样式，或者使用```less 变量```，在上述文件中设置 即可。页面中可直接使用
* 关于```src/styles/layouts.vars.less```配置全局菜单样式的说明
    * 使用了```vite-plugin-css-export```库进行css变量共享，可在```vite.config.js```中进行配置
    * 默认的配置参考下表（引用的位置于：```src/layouts/Main.vue```中）
  ```less
  @headerHeight: 50px; // 顶部栏高度
  @headerBgColor: #f8f8f8; // 顶部栏背景色
  @asideMinWidth: 0px; // 菜单栏最小宽度
  @asideMaxWidth: 200px; // 菜单栏最大宽度
  @asideBgColor: #545c64; // 菜单栏背景色
  @asideTextColor: #ffffff; // 菜单栏字体色
  @asideActiveTextColor: #ffd04b; // 菜单栏选中字体色
  ```

### 内置的指令说明

* ```v-copy```点击复制指令，依赖于```clipboard```库，生成逻辑：```src/directives/clipboard.js```
  文件。实际使用可参考：```src/views/order/Orders.vue```中的联系方式的点击复制功能

### 内置的hooks说明```src/hooks/```

* ```usePageMeta```分页参数处理
* ```useFormMeta```表单数据处理
* ```useRouterToMenu```路由文件转换为菜单栏（在此可自定义菜单，比如将服务端返回的配置设置为菜单） 


