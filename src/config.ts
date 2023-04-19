export const DEBUG = !!import.meta.env.DEBUG;

import { getBucket } from '@extend-chrome/storage';

export interface IStorageBucket {
  enableReportErrorPage: boolean;
}
export const configStore = getBucket<IStorageBucket>('Config', 'local');
