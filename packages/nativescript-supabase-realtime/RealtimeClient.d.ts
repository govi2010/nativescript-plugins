import Timer from './lib/timer';
import RealtimeSubscription from './RealtimeSubscription';
import Serializer from './lib/serializer';
declare type Options = {
    transport?: WebSocket;
    timeout?: number;
    heartbeatIntervalMs?: number;
    longpollerTimeout?: number;
    logger?: Function;
    encode?: Function;
    decode?: Function;
    reconnectAfterMs?: Function;
    headers?: {
        [key: string]: string;
    };
    params?: {
        [key: string]: string;
    };
};
declare type Message = {
    topic: string;
    event: string;
    payload: any;
    ref: string;
};
export default class RealtimeClient {
    channels: RealtimeSubscription[];
    endPoint: string;
    headers?: {
        [key: string]: string;
    };
    params?: {
        [key: string]: string;
    };
    timeout: number;
    transport: any;
    heartbeatIntervalMs: number;
    longpollerTimeout: number;
    heartbeatTimer: ReturnType<typeof setInterval> | undefined;
    pendingHeartbeatRef: string | null;
    ref: number;
    reconnectTimer: Timer;
    logger: Function;
    encode: Function;
    decode: Function;
    reconnectAfterMs: Function;
    conn: WebSocket | null;
    sendBuffer: Function[];
    serializer: Serializer;
    stateChangeCallbacks: {
        open: Function[];
        close: Function[];
        error: Function[];
        message: Function[];
    };
    /**
     * Initializes the Socket
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket.
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers The optional headers to pass when connecting.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.longpollerTimeout The maximum timeout of a long poll AJAX request. Defaults to 20s (double the server long poll timer).
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     */
    constructor(endPoint: string, options?: Options);
    /**
     * Connects the socket.
     */
    connect(): void;
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     */
    disconnect(code?: number, reason?: string): Promise<{
        error: Error | null;
        data: boolean;
    }>;
    /**
     * Logs the message. Override `this.logger` for specialized logging.
     */
    log(kind: string, msg: string, data?: any): void;
    /**
     * Registers a callback for connection state change event.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onOpen(() => console.log("Socket opened."))
     */
    onOpen(callback: Function): void;
    /**
     * Registers a callbacks for connection state change events.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onOpen(() => console.log("Socket closed."))
     */
    onClose(callback: Function): void;
    /**
     * Registers a callback for connection state change events.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onOpen((error) => console.log("An error occurred"))
     */
    onError(callback: Function): void;
    /**
     * Calls a function any time a message is received.
     * @param callback A function to be called when the event occurs.
     *
     * @example
     *    socket.onMessage((message) => console.log(message))
     */
    onMessage(callback: Function): void;
    /**
     * Returns the current state of the socket.
     */
    connectionState(): "connecting" | "open" | "closing" | "closed";
    /**
     * Retuns `true` is the connection is open.
     */
    isConnected(): boolean;
    /**
     * Removes a subscription from the socket.
     *
     * @param channel An open subscription.
     */
    remove(channel: RealtimeSubscription): void;
    channel(topic: string, chanParams?: {}): RealtimeSubscription;
    push(data: Message): void;
    onConnMessage(rawMessage: any): void;
    /**
     * Returns the URL of the websocket.
     */
    endPointURL(): string;
    /**
     * Return the next message ref, accounting for overflows
     */
    makeRef(): string;
    private _onConnOpen;
    private _onConnClose;
    private _onConnError;
    private _triggerChanError;
    private _appendParams;
    private _flushSendBuffer;
    private _resetHeartbeat;
    private _sendHeartbeat;
}
export {};
