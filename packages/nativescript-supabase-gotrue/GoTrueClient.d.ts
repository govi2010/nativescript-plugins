import GoTrueApi from './GoTrueApi';
import { Session, User, UserAttributes, Provider, Subscription, AuthChangeEvent, CookieOptions, UserCredentials } from './lib/types';
export default class GoTrueClient {
    /**
     * Namespace for the GoTrue API methods.
     * These can be used for example to get a user from a JWT in a server environment or reset a user's password.
     */
    api: GoTrueApi;
    /**
     * The currently logged in user or null.
     */
    protected currentUser: User | null;
    /**
     * The session object for the currently logged in user or null.
     */
    protected currentSession: Session | null;
    protected autoRefreshToken: boolean;
    protected persistSession: boolean;
    protected localStorage: Storage;
    protected stateChangeEmitters: Map<string, Subscription>;
    protected refreshTokenTimer?: ReturnType<typeof setTimeout>;
    /**
     * Create a new client for use in the browser.
     * @param options.url The URL of the GoTrue server.
     * @param options.headers Any additional headers to send to the GoTrue server.
     * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
     * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
     * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
     * @param options.localStorage
     */
    constructor(options: {
        url?: string;
        headers?: {
            [key: string]: string;
        };
        detectSessionInUrl?: boolean;
        autoRefreshToken?: boolean;
        persistSession?: boolean;
        localStorage?: Storage;
        cookieOptions?: CookieOptions;
    });
    /**
     * Creates a new user.
     * @type UserCredentials
     * @param email The user's email address.
     * @param password The user's password.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    signUp({ email, password }: UserCredentials, options?: {
        redirectTo?: string;
    }): Promise<{
        user: User | null;
        session: Session | null;
        error: Error | null;
        data: Session | User | null;
    }>;
    /**
     * Log in an existing user, or login via a third-party provider.
     * @type UserCredentials
     * @param email The user's email address.
     * @param password The user's password.
     * @param provider One of the providers supported by GoTrue.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param scopes A space-separated list of scopes granted to the OAuth application.
     */
    signIn({ email, password, provider }: UserCredentials, options?: {
        redirectTo?: string;
        scopes?: string;
    }): Promise<{
        session: Session | null;
        user: User | null;
        provider?: Provider;
        url?: string | null;
        error: Error | null;
        data: Session | null;
    }>;
    /**
     * Inside a browser context, `user()` will return the user data, if there is a logged in user.
     *
     * For server-side management, you can get a user through `auth.api.getUserByCookie()`
     */
    user(): User | null;
    /**
     * Returns the session data, if there is an active session.
     */
    session(): Session | null;
    /**
     * Force refreshes the session including the user data in case it was updated in a different session.
     */
    refreshSession(): Promise<{
        data: Session | null;
        user: User | null;
        error: Error | null;
    }>;
    /**
     * Updates user data, if there is a logged in user.
     */
    update(attributes: UserAttributes): Promise<{
        data: User | null;
        user: User | null;
        error: Error | null;
    }>;
    /**
     * Sets the session data from refresh_token and returns current Session and Error
     * @param refresh_token a JWT token
     */
    setSession(refresh_token: string): Promise<{
        session: Session | null;
        error: Error | null;
    }>;
    /**
     * Overrides the JWT on the current client. The JWT will then be sent in all subsequent network requests.
     * @param access_token a jwt access token
     */
    setAuth(access_token: string): Session;
    /**
     * Gets the session data from a URL string
     * @param options.storeSession Optionally store the session in the browser
     */
    getSessionFromUrl(options?: {
        storeSession?: boolean;
    }): Promise<{
        data: Session | null;
        error: Error | null;
    }>;
    /**
     * Inside a browser context, `signOut()` will remove extract the logged in user from the browser session
     * and log them out - removing all items from localstorage and then trigger a "SIGNED_OUT" event.
     *
     * For server-side management, you can disable sessions by passing a JWT through to `auth.api.signOut(JWT: string)`
     */
    signOut(): Promise<{
        error: Error | null;
    }>;
    /**
     * Receive a notification every time an auth event happens.
     * @returns {Subscription} A subscription object which can be used to unsubscribe itself.
     */
    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): {
        data: Subscription | null;
        error: Error | null;
    };
    private _handleEmailSignIn;
    private _handleProviderSignIn;
    /**
     * Attempts to get the session from LocalStorage
     * Note: this should never be async (even for React Native), as we need it to return immediately in the constructor.
     */
    private _recoverSession;
    /**
     * Recovers the session from LocalStorage and refreshes
     * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
     */
    private _recoverAndRefresh;
    private _callRefreshToken;
    private _notifyAllSubscribers;
    /**
     * set currentSession and currentUser
     * process to _startAutoRefreshToken if possible
     */
    private _saveSession;
    private _persistSession;
    private _removeSession;
    /**
     * Clear and re-create refresh token timer
     * @param value time intervals in milliseconds
     */
    private _startAutoRefreshToken;
}
