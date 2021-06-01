import { RPPGSocketConfig, RPPGSocketInterface, RPPGSocketSendMessage } from './RPPGSocket.types';
/**
 * Class RPPGSocketInterface
 * @example
 * const rppgSocketInstance = new RPPGSocket()
 */
declare class RPPGSocket implements RPPGSocketInterface {
    config: RPPGSocketConfig;
    socket: WebSocket;
    /**
     * @param {RPPGSocketConfig} config Config passed to RPPGSocket
     */
    constructor(config: RPPGSocketConfig);
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
    init(): Promise<Event>;
    /**
     * Send message to RPPG Socket
     * @returns {Promise<Event>}
     */
    send(message: RPPGSocketSendMessage): void;
    /**
     * Close socket connection
     */
    close(): Promise<void>;
}
export default RPPGSocket;
