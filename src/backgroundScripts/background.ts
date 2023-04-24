import { onMessage } from 'webext-bridge/background';

console.log('background script loaded');

// must run in order to listen to network onMessage between contexts
onMessage('keep_alive', () => {
  console.log('[background] keep_alive message');
});
