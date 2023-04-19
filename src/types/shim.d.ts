import { ProtocolWithReturn } from 'webext-bridge';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    REGISTER_ON_AUTH_CHANGE: ProtocolWithReturn<undefined, undefined>;
    IS_LOGGED_IN: ProtocolWithReturn<undefined, boolean>;
    ON_AUTH_CHANGE: ProtocolWithReturn<boolean, void>;
    INVOKE_LOGIN: ProtocolWithReturn<undefined, { success: boolean; error?: string }>;
    parseFacebookPost: ProtocolWithReturn<undefined, boolean>;
    SAVE_FB_POST_TO_DB: ProtocolWithReturn<SharePostData, { postId?: string; error?: string }>;
    CHECK_FB_POST_EXISTS_BY_HASH: ProtocolWithReturn<string, { exists?: boolean; error?: string }>;
    LOGIN_BG: ProtocolWithReturn<undefined, boolean>;
    TEST_FIRESTORE_REMOTE: ProtocolWithReturn<undefined, boolean>;

    REPORT_ERROR_FACEBOOK_PAGE: ProtocolWithReturn<undefined, { msg?: string; error?: string; [key: string]: any }>;
    GATHER_REPORT_PAGE_INFO: ProtocolWithReturn<undefined, { error?; pageInfo?: PageInfo }>;
    // to specify the return type of the message,
    // use the `ProtocolWithReturn` type wrapper
    // bar: ProtocolWithReturn<string, string>;
  }
}
