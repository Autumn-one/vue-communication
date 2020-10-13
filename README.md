## vue-communication
> 一个可观测的vue组件通信方案，有时候我们项目中的某几个组件需要进行通信，这时候用 vuex 并不合适，使用 emit 又不好管理，这个时候可以试一下 vue-communication 这是一个可以用于任意组件关系通信的方式，而且真正的直接通信。

## 安装

```
yarn add vue-communication
// 或者 npm install vue-communication -D
```

## 用法

**引入：**

安装之后直接使用:

```
import "vue-communication"
```

**发送数据：**

该组件暴露两个主要 API 一个是发送者 $sender 一个是接受者 $receiver

假如 A 组件向 B 组件发送数据：

A 组件中直接使用 `this.$sender("data-A-B",{d: "我是数据"})`

B 组件中在任意时刻（哪怕B都还没挂载都行，放心食用）使用`this.$receiver("data-A-B")` 这个函数返回一个 Promise 对象，直接 .then 接收即可

**注意：**

这里面的 `意图修饰符-组件1-组件2` 的格式是强制的，不管你的组件名有多长，你都要完整的给出！下面的修改数据也一样，对应到 data-A-B 这个案例，其整个字符串可以称为一个“意图”，data 叫做意图修饰符，目前只有两个 data 和 modify，A 叫做发送的组件名称，B 叫做接收的组件名称。

**修改数据：**

A 组件中使用 `this.$sender("modify-A-B","name","木瓜太香")` 表示 A 组件要修改 B 组件中的 name 属性把他变为 木瓜太香

B组件中使用 `this.receiver("modify-A-B")` 即可完成修改。

如果你要改 obj 对象下的 name 那么可以写成 `this.$sender("modify-A-B","obj.name","木瓜太香")`

## 视频教程

后续开放