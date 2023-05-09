import { wait } from '~/utils/helpers';

export async function waitForElemContentToChange(elem: HTMLElement, content: string, maxTimeWait: number) {
  const startTime = Date.now();
  while (elem.textContent?.trim() === content) {
    if (Date.now() - startTime > maxTimeWait) {
      throw new Error(`Timeout: elem content not changed`);
    }
    await wait(100);
  }
}
