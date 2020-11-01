## vue-communication介绍

* 他是一个可观测可调试的vue组件通信方案
* 任意关系组件可直接通信
* 支持跨组件监听数据变化
* 支持发送离线数据

## 兼容 IE

由于该组件未生成dist，所以如果你的浏览器有兼容IE的需求，请在 `vue.config.js` 中添加如下配置：`transpileDependencies:["vue-communication"]`

## 安装

```powershell
yarn add vue-communication
// 或者 npm install vue-communication -D
```

## 引入

```javascript
import { $sender, $receiver } "vue-communication";
Vue.prototype.$sender = $sender;
Vue.prototype.$receiver = $receiver;
```

## 视频教程

[视频地址](https://www.bilibili.com/video/BV1sD4y1d7mD/)

## 用法

**基本概念：**

该组件暴露两个主要 API 一个是发送者 `$sender` 一个是接受者 `$receiver`，所有的通信都通过这两个方法来实现，这里希望大家将 `$sender` 理解成发送意图的发送者，他发送的是意图，意图就是希望做一件什么事情。

意图类型： `dataOnce` `modifyOnce` `data` `modify` `watch`

目前只有以上5种意图分别涵盖了：发送数据的一次和多次，修改数据的一次和多次，跨组件监听数据变化

**发送数据：**

假如 A 组件只向 B 组件发送`一次`数据：

A 组件中直接使用 `this.$sender("dataOnce-A-B",{d: "我是数据"})`

B 组件中在任意时刻（哪怕B都还没挂载都行，放心食用）使用`this.$receiver("dataOnce-A-B")` 这个函数返回一个 Promise 对象，直接 .then 接收即可

发送多次就用 `this.$sender("data-A-B","我是数据")` ，该方法调用多次，对应组件就会多次接收该数据

接收会有变化，由于会多次接收所以无法使用 Promise 来实现，请在参数追加回调`this.$receiver("data-A-B",function(data){ // data就是数据 })`

**注意：**

这里面的 `意图修饰符-组件1-组件2` 的格式是强制的，不管你的组件名有多长，你都要完整的给出！下面的修改数据也一样，对应到 data-A-B 这个案例，其整个字符串可以称为一个“意图”，data 叫做意图修饰符。

**接收回执：**

我相信大家都明白一个道理，如果委托 A 给 B 送东西，在 A 送到之后不应该默不吭声的就完了，而是应该告诉你一声，嘿！你让我送的东西我已经送到了哦！这就是回执。

需要注意的是回执目前只有在一次性操作中才会有，例如 `dataOnce` `modifyOnce`

他们通过 `$sender`返回的 Promise 对象给出，让发送者可以知道，我发送的数据什么时候被接收了

```javascript
this.$sender("dataOnce-A-B","木瓜太香")
.then(flag => {
    console.log("接受者已经接受到数据了！")
})
```



**修改数据：**

A 组件中使用 `this.$sender("modifyOnce-A-B","name","木瓜太香")` 表示 A 组件要修改 B 组件中的 name 属性把他变为 木瓜太香

B组件中使用 `this.$receiver("modifyOnce-A-B","name")` 即可完成修改，`注意第二个参数必须传，这是一个许可，表示你认可 A 组件修改当前组件的 name 属性，如果你写错了或者没传那么许可不成立，这是一个让数据变动可预测也强迫开发者需要更清楚自己在做什么的一个实现。`

如果你要改 obj 对象下的 name 那么可以写成 `this.$sender("modifyOnce-A-B","obj.name","木瓜太香")`

如果你要修改多次可以参照 data 意图的示例，使用 modify 意图修饰符即可，注意，目前修改是没有回调的，如果你想知道数据什么时候被修改，可以自己在组件内部监听。

**跨组件监听数据：**

假如 A 组件要监听 B 组件中的 name 数据变动：

A 组件使用 `this.$sender("watch-A-B","person.name",function(nv,ov){ // nv 表示新值 ov 表示旧值 })`

B 组件只需要给出一次许可即可： `this.$receiver("watch-A-B","person.name")`