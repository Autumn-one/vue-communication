import queue from "./queue";
import { vm } from "./index";

const sender = {
    // * 处理发送者的 dataOnce 意图
    dataOnceHandle (intent, data) {
        let p = sender.monitorReceipt(intent);
        let intentWrap = {
            intent,
            data
        };
        if (queue.dataOnceList.indexOf(intent) !== -1) {
            vm.$emit(intent, intentWrap);
        } else {
            sender.addIntentToOfflineList(queue.dataOnceOfflineList, intentWrap);
        }
        return p;
    },
    // * 处理发送者的 data 意图
    dataHandle (intent, data) {
        let intentWrap = {
            intent,
            data
        };
        if (queue.dataList.indexOf(intent) !== -1) {
            vm.$emit(intent, intentWrap);
        } else {
            queue.dataOfflineList.push(intentWrap);
        }
    },
    // * 处理发送者的 modifyOnce 意图
    modifyOnceHandle (intent, dataPathStr, data) {
        let p = sender.monitorReceipt(intent);
        let intentWrap = {
            intent,
            dataPathStr,
            data
        };
        if (queue.modifyOnceList.indexOf(intent) !== -1) {
            vm.$emit(intent, intentWrap);
        } else {
            sender.addIntentToOfflineList(queue.modifyOnceOfflineList, intentWrap);
        }
        return p;
    },
    // * 处理发送者的 modify 意图
    modifyHandle (intent, dataPathStr, data) {
        let intentWrap = {
            intent,
            dataPathStr,
            data
        };
        console.log(queue.modifyList);
        if (queue.modifyList.indexOf(intent) !== -1) {
            vm.$emit(intent, intentWrap);
        } else {
            queue.modifyOfflineList.push(intentWrap);
        }

    },
    // * 处理发送者的 watch 意图
    watchHandle (intent, dataPathStr, callback) {
        vm.$on(intent, function (intentWrap) {
            console.log(intentWrap);
            console.log(dataPathStr);
            let { nv, ov } = intentWrap;
            if (dataPathStr === intentWrap.dataPathStr) {
                callback(nv, ov);
            } else if (intentWrap.dataPathStr === undefined) {
                throw new Error("接受者未设置修改许可，在意图中为 $receiver 设置第二个参数是必须的！");
            } else {
                throw new Error("接受者的许可字段与预期不一致！请检查接受者 $receiver 的第二个参数！");

            }
        });
    },
    // * 添加意图到离线列表
    addIntentToOfflineList (offlineList, intentWrap) {
        let { intent } = intentWrap;
        let isThisIntentEmptyInOffline = true;
        offlineList.forEach(i => i.intent === intent && (isThisIntentEmptyInOffline = false));
        if (isThisIntentEmptyInOffline) {
            offlineList.push(intentWrap);
        } else {
            console.warn(`意图：${intent}被多次发送但是没有对应数量的接受者来处理它！！！`);
        }
    },
    // * 发送者监听回执事件
    monitorReceipt (intent) {
        return new Promise(resolve => {
            vm.$once(`receipt-${intent}`, function (status) {
                resolve(status);
            });
        });
    }

};

export default sender;
