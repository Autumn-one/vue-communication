import queue from "./queue";
import util from "./util";
import { vm } from "./index";

const receiver = {
    dataHandle (intent, callback) {
        // 检测离线列表中是否有东西，如果有直接执行
        let tempArr = [];// 用来装没有被用到的离线 intentWrap
        queue.dataOfflineList.forEach(intentWrap => {
            if (intentWrap.intent === intent) {
                callback(intentWrap.data);
            } else {
                tempArr.push(intentWrap);
            }
        });
        queue.dataOfflineList = tempArr;

        queue.dataList.push(intent);
        vm.$on(intent, function (intentWrap) {
            callback(intentWrap.data);
        });
    },
    modifyHandle (intent, allowStr) {
        // 检测离线列表
        let tempArr = [];
        queue.modifyOfflineList.forEach(intentWrap => {
            if (intentWrap.intent === intent) {
                receiver.modifyResponseData(this, intentWrap, allowStr);
            } else {
                tempArr.push(intentWrap);
            }
        });

        queue.modifyOfflineList = tempArr;


        vm.$on(intent, intentWrap => {
            receiver.modifyResponseData(this, intentWrap, allowStr);
        });
        queue.modifyList.push(intent);

    },
    // - 接受者 dataOnce 意图处理函数
    dataOnceHandle (intent) {
        // 在离线列表中找 intent 如果有直接触发在删掉，没有正常绑定
        let { index, item: intentWrap } = util.findItem(queue.dataOnceOfflineList, function (item) {
            return item.intent === intent;
        });

        return new Promise(resolve => {
            if (index !== -1) {
                resolve(intentWrap.data);
                vm.$emit(`receipt-${intent}`, true);
                queue.dataOnceOfflineList.splice(index, 1);
            } else {
                queue.dataOnceList.push(intent);
                vm.$once(intent, function (intentWrap2) {
                    let index = queue.dataOnceList.indexOf(intent);
                    queue.dataOnceList.splice(index, 1);
                    resolve(intentWrap2.data);
                    vm.$emit(`receipt-${intent}`, true);
                });
            }

        });
    },
    // - 接受者的 modifyOnce 意图处理函数
    modifyOnceHandle (intent, allowStr) {
        // 离线列表查找 intent
        let { index, item: intentWrap } = util.findItem(queue.modifyOnceOfflineList, function (item) {
            return item.intent === intent;
        });

        return new Promise((resolve, reject) => {

            if (index !== -1) {
                receiver.modifyResponseData(this, intentWrap, allowStr);
                resolve(true);
                vm.$emit(`receipt-${intent}`, true);
                queue.modifyOnceOfflineList.splice(index, 1);
            } else {
                queue.modifyOnceList.push(intent);
                vm.$once(intent, intentWrap2 => {
                    receiver.modifyResponseData(this, intentWrap2, allowStr);
                    resolve(true);
                    // 执行之后删除 intent
                    let i = queue.modifyOnceList.indexOf(intent);
                    queue.modifyOnceList.splice(i, 1);
                    vm.$emit(`receipt-${intent}`, true);
                });
            }


        });
    },
    watchHandle (intent, dataPathStr) {
        this.$watch(dataPathStr, function (nv, ov) {
            vm.$emit(intent, {
                intent,
                dataPathStr,
                nv,
                ov
            });
        }, {
            deep: true
        });
    },
    // - 修改组件的响应数据
    modifyResponseData (comp, { dataPathStr, data }, allowStr) {
        if (dataPathStr === allowStr) {
            let responseData = comp.$data;
            let pathArr = dataPathStr.split(".");
            for (let i = 0; i < pathArr.length - 1; i++) {
                responseData = responseData[pathArr[i]];
            }

            let lastKey = pathArr[pathArr.length - 1];
            // 根据 data 的类型来决定怎么修改响应式数据，对于对象采用增量修改，其他值则是直接修改
            if (util.isObject(data)) {
                Object.keys(data).forEach(k => {
                    responseData[lastKey][k] = data[k];
                });
            } else {
                responseData[lastKey] = data;
            }
        } else if (allowStr === undefined) {
            throw new Error("接受者未设置修改许可，在意图中为 $receiver 设置第二个参数是必须的！");
        } else {
            throw new Error("接受者的许可字段与预期不一致！请检查接受者 $receiver 的第二个参数！");
        }

    }
};

export default receiver;
