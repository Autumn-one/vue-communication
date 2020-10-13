import Vue from 'vue';
import communication from "./communication";

let { $sender, $receiver } = communication;

Vue.prototype.$sender = $sender;
Vue.prototype.$receiver = $receiver;
