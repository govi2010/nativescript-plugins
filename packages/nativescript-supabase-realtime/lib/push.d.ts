import RealtimeSubscription from '../RealtimeSubscription';
export default class Push {
    channel: RealtimeSubscription;
    event: string;
    payload: any;
    timeout: number;
    sent: boolean;
    timeoutTimer: number | undefined;
    ref: string;
    receivedResp: {
        status: string;
        response: Function;
    } | null;
    recHooks: {
        status: string;
        callback: Function;
    }[];
    refEvent: string | null;
    /**
     * Initializes the Push
     *
     * @param channel The Channel
     * @param event The event, for example `"phx_join"`
     * @param payload The payload, for example `{user_id: 123}`
     * @param timeout The push timeout in milliseconds
     */
    constructor(channel: RealtimeSubscription, event: string, payload?: any, timeout?: number);
    resend(timeout: number): void;
    send(): void;
    receive(status: string, callback: Function): this;
    startTimeout(): void;
    trigger(status: string, response: any): void;
    private _cancelRefEvent;
    private _cancelTimeout;
    private _matchReceive;
    private _hasReceived;
}
