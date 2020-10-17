import Vue from "vue";
import util from "./util";
import sender from "./sender";
import receiver from "./receiver";

export const vm = new Vue();

/**
 * @fnName $sender 一个发送者
 * @param intent 一个意图，一般是一个字符串表示意图 dataOnce-组件1-组件2 modifyOnce-组件1-组件2
 * @param dataOrPath 如果用于 dataOnce- 类型意图，则表示数据；如果用于 modifyOnce- 类型意图，则表示一个数据路径字符串
 * @param data 目前只有在 modifyOnce 类型的意图中会用到，作为真实路径
 */
export function $sender (intent, dataOrPath, data) {
    util.checkIntentName(intent);
    let intentStartWith = util.startsWith.bind(this, intent);
    if (intentStartWith("dataOnce-")) {
        return sender.dataOnceHandle(intent, dataOrPath);
    } else if (intentStartWith("modifyOnce-")) {
        return sender.modifyOnceHandle(intent, dataOrPath, data);
    } else if (intentStartWith("data-")) {
        return sender.dataHandle(intent, dataOrPath);
    } else if (intentStartWith("modify-")) {
        return sender.modifyHandle(intent, dataOrPath, data);
    } else if (intentStartWith("watch-")) {
        let callback = data;
        return sender.watchHandle.call(this, intent, dataOrPath, callback);
    }

}

/**
 * @fnName $receiver 接受者 用于接收意图
 * @param intent 一个意图参考 $sender
 * @param allowStr 目前只在 modifyOnce 意图的时候生效，用于标识，允许发送者修改的字段
 */
export function $receiver (intent, allowOrCallback) {
    util.checkIntentName(intent);
    let intentStartWith = util.startsWith.bind(this, intent);
    if (intentStartWith("dataOnce-")) {
        return receiver.dataOnceHandle.call(this, intent);
    } else if (intentStartWith("modifyOnce-")) {
        return receiver.modifyOnceHandle.call(this, intent, allowOrCallback);
    } else if (intentStartWith("data-")) {
        return receiver.dataHandle.call(this, intent, allowOrCallback);
    } else if (intentStartWith("modify-")) {
        return receiver.modifyHandle.call(this, intent, allowOrCallback);
    } else if (intentStartWith("watch-")) {
        return receiver.watchHandle.call(this, intent, allowOrCallback);
    }
}


