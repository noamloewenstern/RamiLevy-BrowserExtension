import { shoppingListsStorageBucket } from '~/shared/shopping-cart/shopping-cart';
import { z } from 'zod';
import { ResponseShoppingLists, ResponseSingleShoppingList } from '~/shared/shopping-cart/types';
const injectScriptURLFile = 'src/contentScript/interceptRequests/injectedDOMscript.js';
function addScriptToDOM() {
  const xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.id = '__xhrOverrideScript';
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.src = chrome.runtime.getURL(injectScriptURLFile);
  document.head.prepend(xhrOverrideScript);
}

function addInjectScriptAfterDOMReady() {
  if (document.body && document.head) {
    const interceptResultsDataElement = createInterceptDataElement();
    document.body.appendChild(interceptResultsDataElement);
    registerInterceptedDataResulstsObserver(interceptResultsDataElement);
    addScriptToDOM();
  } else {
    requestIdleCallback(addInjectScriptAfterDOMReady);
  }
}

function createInterceptDataElement() {
  const interceptDataElement = document.createElement('div');
  interceptDataElement.id = '__interceptedData';
  interceptDataElement.innerText = 'intercepted data';
  interceptDataElement.style.height = '0';
  interceptDataElement.style.overflow = 'hidden';
  return interceptDataElement;
}

export const ResponseInfo = z.object({
  url: z.string(),
  data: z.record(z.any()),
});
export type IResponseInfo = z.infer<typeof ResponseInfo>;
export function getResponseInfo(url: string) {
  const respDiv = document.getElementById(`__interceptedData_${url}`);
  if (respDiv) {
    return ResponseInfo.parse(JSON.parse(respDiv.innerText));
  }
  return;
}

requestIdleCallback(addInjectScriptAfterDOMReady);
function registerInterceptedDataResulstsObserver(interceptResultsDataElement: HTMLDivElement) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;
        if (addedNodes.length > 0) {
          const addedNode = addedNodes[0];
          if (addedNode instanceof HTMLDivElement) {
            const url = addedNode.id.replace('__interceptedData_', '');
            const respInfo = ResponseInfo.parse(JSON.parse(addedNode.innerText));
            saveNewResponseDataToLocalStorage(respInfo);
          }
        }
      }
    });
  });
  observer.observe(interceptResultsDataElement, { childList: true });
}
function saveNewResponseDataToLocalStorage({ data, url }: IResponseInfo) {
  const urlRegexPattern = /https:\/\/api-prod.rami-levy.co.il\/api\/v2\/site\/clubs\/shop-lists\/(\d+)/;
  if (url === 'https://api-prod.rami-levy.co.il/api/v2/site/clubs/shop-lists') {
    try {
      const parsedData = ResponseShoppingLists.parse(data);
      shoppingListsStorageBucket.set({ ShoppingListsMeta: parsedData.data });
    } catch (e) {
      console.log('error parsing data in ResponseShoppingLists', e);
      console.log(data);
    }
  } else if (!url.match(urlRegexPattern)) {
    try {
      const listId = +url.match(urlRegexPattern)![1];

      const parsedData = ResponseSingleShoppingList.parse(data);
      const items_count = parsedData.data.items.length;
      shoppingListsStorageBucket.set(prev => {
        const existingShoppingList = prev.ShoppingLists.filter(list => list.id !== listId);
        const shoppingList = {
          ...parsedData.data,
          items_count,
        };
        const newShoppingLists = [...existingShoppingList, shoppingList];
        return {
          ShoppingLists: newShoppingLists,
        };
      });
    } catch (e) {
      console.log('error parsing data in ResponseShoppingLists', e);
      console.log(data);
    }
  }
}
