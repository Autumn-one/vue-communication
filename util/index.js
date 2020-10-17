import commonUtil from "./commonUtil";
import senderAndReceiverUtil from "./senderAndReceiverUtil";

export default {
    ...commonUtil, // 通用工具函数
    ...senderAndReceiverUtil // 发送者和接受者工具函数
};
