export default {
    checkIntentName (intent) {
        let arr = intent.split("-");
        if (!(arr[0] === "data" || arr[0] === "modifyOnce" || arr.length === 3)) {
            throw new Error(`意图：${intent}的格式错误！请使用 dataOnce-组件1-组件2 或 modifyOnce-组件1-组件2 ！`);
        }
    },
    clearQueue (list) {
        list.length = 0;
    }
};
