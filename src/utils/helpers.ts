import pTimeout from 'p-timeout';

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
type WaitForValueOptions = {
  ms: number;
  intervalCheck?: number;
  message?: string;
};
type Callback<T> = () => T | Promise<T>;

export async function waitForValue<R>(cb: Callback<R>, options: number | WaitForValueOptions): Promise<R> {
  const { ms, intervalCheck = 300, message = undefined } = typeof options === 'number' ? { ms: options } : options;
  let intervalId: NodeJS.Timeout | null = null;

  const promise = new Promise<R>(async resolve => {
    const checkValue = async () => {
      const value = await Promise.resolve(cb());

      if (value !== null && value !== undefined) {
        resolve(value);
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
      }
      return value;
    };
    const cbValue = await checkValue();
    if (cbValue !== null && cbValue !== undefined) {
      // found on first check
      return cbValue;
    }
    intervalId = setInterval(checkValue, intervalCheck);
  });

  const promiseWithTimeout = pTimeout(promise, { milliseconds: ms, message });
  promiseWithTimeout.catch(error => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    throw error;
  });

  return promiseWithTimeout;
}

export function emulateTextInput(element: HTMLInputElement, text: string) {
  // Set the element's value to the provided text
  element.value = text;

  // Event types to dispatch
  const eventTypes = ['keydown', 'keypress', 'input', 'keyup'];

  // Loop through event types and dispatch events
  for (const eventType of eventTypes) {
    const event = new KeyboardEvent(eventType, {
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(event);
  }
}
