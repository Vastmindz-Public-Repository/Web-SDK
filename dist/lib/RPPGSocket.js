"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./consts/api");
/**
 * Class RPPGSocketInterface
 * @example
 * const rppgSocketInstance = new RPPGSocket()
 */
var RPPGSocket = /** @class */ (function () {
    /**
     * @param {RPPGSocketConfig} config Config passed to RPPGSocket
     */
    function RPPGSocket(config) {
        this.config = config;
    }
    /**
     * Init RPPG Socket instance
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG()
     *   await this.rppgInstance.initSocket({
     *     url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
     *     authToken: 'token',
     *     onConnect: () => console.log('Socket connection established'),
     *     onClose: (event) => console.log('Socket connection closed', event),
     *     onError: (event) => console.log('Socket connection error', event),
     *   })
     * ```
     *
     * @returns {Promise<Event>}
     */
    RPPGSocket.prototype.init = function () {
        var url = (this.config.url || api_1.SOCKET_URL) + "?authToken=" + this.config.authToken;
        var socket = new WebSocket(url);
        this.socket = socket;
        var _a = this.config, onConnect = _a.onConnect, onClose = _a.onClose, onMessage = _a.onMessage, onEvent = _a.onEvent, onError = _a.onError;
        return new Promise(function (resolve, reject) {
            socket.onopen = function (event) {
                if (typeof onConnect === 'function') {
                    onConnect(event);
                }
                resolve(event);
            };
            socket.onclose = function (event) {
                if (typeof onClose === 'function') {
                    onClose(event);
                }
            };
            socket.onmessage = function (event) {
                var _a = JSON.parse(event.data), messageType = _a.messageType, data = _a.data;
                if (typeof onMessage === 'function') {
                    onMessage(messageType, data);
                }
                if (typeof onEvent === 'function') {
                    onEvent(messageType, data);
                }
            };
            socket.onerror = function (event) {
                if (typeof onError === 'function') {
                    onError(event);
                }
                reject(event);
            };
        });
    };
    /**
     * Send message to RPPG Socket
     * @returns {Promise<Event>}
     */
    RPPGSocket.prototype.send = function (message) {
        this.socket.send(JSON.stringify(message));
    };
    return RPPGSocket;
}());
exports.default = RPPGSocket;
//# sourceMappingURL=RPPGSocket.js.map