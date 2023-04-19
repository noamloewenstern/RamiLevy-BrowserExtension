export {};
console.log('context menu loaded');

// console.log('context menu loaded');

// const FACEBOOK_POST_LINK_LISTENER_ID = 'facebook-post-listener';

// chrome.contextMenus.removeAll(() => {
//   chrome.contextMenus.create({
//     title: 'AH: Save Post: %s',
//     id: FACEBOOK_POST_LINK_LISTENER_ID,
//     contexts: ['link'],
//     documentUrlPatterns: [
//       // // 'https://www.facebook.com/permalink*story_fbid*',
//       // 'https://www.facebook.com/permalink.php?story_fbid=',
//       // // 'https://www.facebook.com/permalink.php*',
//       // 'https://www.facebook.com/groups/*/multi_permalinks*',
//       // 'https://www.facebook.com/*/posts*',
//     ],
//   });
// });
// chrome.contextMenus.onClicked.addListener(async (info, tab) => {
//   if (info.menuItemId == FACEBOOK_POST_LINK_LISTENER_ID) {
//     // const resp = await chrome.tabs.sendMessage(tab!.id!, {
//     //   action: 'onPostLinkClick',
//     //   payload: info,
//     // });
//     if (!tab?.id) {
//       console.warn('tab?.id is undefined');
//       return;
//     }
//     const resp = await parseFacebookPost({ postLinkUrl: info.linkUrl! }, { tabId: tab!.id! });
//     console.log('context-menu-parseFacebookPost-resp', resp);
//   }
// });

// chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
//   if (!msg.action) return;
//   // if (!sender.tab) return;
//   // const tabId = sender.tab.id;

//   switch (msg.action) {
//     case 'test-firebase': {
//       try {
//       } catch (error: any) {
//         console.warn(error);
//         sendResponse(error.toString());
//       }
//       // console.log('Receive color = ' + color);
//       // document.body.style.backgroundColor = color;
//       // sendResponse('Change color to ' + color);
//       break;
//     }

//     default: {
//       console.log('unknown action', msg.action);
//       sendResponse(`unknown action = ${msg.action}`);
//       break;
//     }
//   }
// });
