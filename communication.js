import Vue from "vue";

export default (function () {
    let vm = new Vue();
    let _eventList = [];
    let _offlineList = [];
    

    let findItem = function (arr, fn) {
        for (let i = 0; i < arr.length; i++) {
            if (fn.call(this, arr[i], i, arr)) {
                return {
                    index: i,
                    item: arr[i]
                };
            }
        }
        return {
            index: -1,
            item: null
        };
    };


    let startsWith = (fullStr, startStr) => {
        return fullStr.indexOf(startStr) === 0;
    };
    

    let checkIntent = intent => {
        let arr = intent.split("-");
        if (!(arr[0] === "data" || arr[0] === "modify" || arr.length === 3)) {
            throw new Error(`意图：${intent}的格式错误！请使用 data-组件1-组件2 或 modify-组件1-组件2 格式为 intent 命名！`);
        }
    };

    
    let addIntentToOfflineList = (intent, intentWrap) => {
        let isThisIntentEmptyInOffline = true;
        _offlineList.forEach(iw => iw.intent === intent && (isThisIntentEmptyInOffline = false));
        if (isThisIntentEmptyInOffline) {
            _offlineList.push(intentWrap);
        } else {
            console.warn(`意图：${intent}被多次触发但是没有对应数量的接受者来处理它！！！`);
        }
    };

    function _senderDataHandle (intent, data) {
        if (_eventList.indexOf(intent) !== -1) {
            vm.$emit(intent, data);
        } else {
            addIntentToOfflineList(intent, {
                intent,
                data
            });
        }
    }

    function _senderModifyHandle (intent, dataPathStr, data) {
        if (_eventList.indexOf(intent) !== -1) {
            vm.$emit(intent, {
                dataPathStr,
                data
            });
        } else {
            addIntentToOfflineList(intent, {
                intent,
                dataPathStr,
                data
            });
        }
    }

    

    
    function _receiverDataHandle (intent) {
        _eventList.push(intent);

        let { index, item: intentWrap } = findItem(_offlineList, function (item) {
            return item.intent === intent;
        });

        return new Promise(resolve => {
            if (index !== -1) {
                resolve(intentWrap.data);
                _offlineList.splice(index, 1);
            } else {
                vm.$once(intent, function (data) {
                    let index = _eventList.indexOf(intent);
                    _eventList.splice(index, 1);
                    resolve(data);
                });
            }

        });
    }


    let isObject = o => Object.prototype.toString.call(o) === "[object Object]";

    function _modifyResponseData (comp, { dataPathStr, data }) {
        console.log(comp);
        let responseData = comp.$data;
        let pathArr = dataPathStr.split(".");
        for (let i = 0; i < pathArr.length - 1; i++) {
            responseData = responseData[pathArr[i]];
        }

        if (isObject(data)) {
            Object.keys(data).forEach(k => {
                responseData[k] = data[k];
            });
        } else {
            responseData[pathArr[0]] = data;
        }
    }

    function _receiverModifyHandle (intent) {
        _eventList.push(intent);

        let { index, item: intentWrap } = findItem(_offlineList, function (item) {
            return item.intent === intent;
        });

        return new Promise(resolve => {
            if (index !== -1) {
                _modifyResponseData(this, intentWrap);
                resolve(intentWrap.data);
            } else {
                vm.$once(intent, intentWrap => {
                    _modifyResponseData(this, intentWrap);
                    resolve(intentWrap.data);
                });
            }
        });
    }

    

    
    function $sender (intent, dataOrPath, data) {
        checkIntent(intent);

        let argsLen = arguments.length;
        if (startsWith(intent, "data-")) {
            _senderDataHandle(intent, dataOrPath);
        } else if (startsWith(intent, "modify-")) {
            _senderModifyHandle(intent, dataOrPath, data);
        }

    }

    
    function $receiver (intent) {

        checkIntent(intent);
        if (startsWith(intent, "data-")) {
            return _receiverDataHandle.call(this, intent);
        } else if (startsWith(intent, "modify-")) {
            return _receiverModifyHandle.call(this, intent);
        }

    }

    return {
        $sender,
        $receiver
    };
})();
