import { ProtocolWithReturn } from 'webext-bridge';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    NEW_RESPONSE_DATA: IResponseInfo;
    // to specify the return type of the message,
    // use the `ProtocolWithReturn` type wrapper
    // bar: ProtocolWithReturn<string, string>;
    OPEN_SHOPPING_LISTS: undefined;
    OPEN_SHOPPING_LIST_BY_NAME: ProtocolWithReturn<string, void>;
  }
}
