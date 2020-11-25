import queue from "./queue.js";
import { vm } from "./index.js";

export default function (intent) {
    vm.$off(intent);
    // 截取意图修饰符删除对应队列的所有意图
    let arr = intent.split("-");
    let intentStr = arr[0];
    queue[`${intentStr}List`] = queue[`${intentStr}List`].filter(item => item !== intent);
    queue[`${intentStr}OfflineList`] = queue[`${intentStr}OfflineList`].filter(item => item.intent !== intent);
}
