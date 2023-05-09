import { z } from 'zod';
import { ResponseShoppingLists, ResponseSingleShoppingList } from '~/shared/shopping-cart/types';
import { listItemsUrl, shopListsUrlRegexPattern } from './utils';
import { addInjectScriptAfterDOMReady } from './injectScript';
import { ItemsMapBucket, shoppingListsStorageBucket } from '~/shared/shopping-cart/storage';

const ResponseInfo = z.object({
  url: z.string(),
  data: z.record(z.any()),
  method: z.string(),
});
type IResponseInfo = z.infer<typeof ResponseInfo>; // Type of the DOM Script intercepting the AJAX requests

function onNewResponseDiv(addedNode: HTMLDivElement) {
  try {
    const respInfo = ResponseInfo.parse(JSON.parse(addedNode.innerText));
    saveNewResponseDataToLocalStorage(respInfo);
  } catch (e) {
    console.error('error parsing intercepted data', e);
    console.log(addedNode.innerText);
  }
}

function registerInterceptedDataResulstsObserver(interceptResultsDataElement: HTMLDivElement) {
  /* observing the element which the DOM Script will save the responses */
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;
        if (addedNodes.length > 0) {
          const addedNode = addedNodes[0];
          if (addedNode instanceof HTMLDivElement) {
            onNewResponseDiv(addedNode);
          }
        }
      }
    });
  });
  observer.observe(interceptResultsDataElement, { childList: true });
}
function saveNewResponseDataToLocalStorage({ data, url, method }: IResponseInfo) {
  /* saving to cache the result from curtain intercepted AJAX requests */
  if (method.toUpperCase() === 'POST') {
    if (url === listItemsUrl) {
      const items = z.array(z.object({ id: z.number(), name: z.string() })).parse(data.data);
      const itemsMap = items.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<number, string>);

      ItemsMapBucket.set(itemsMap); // saving to cache
      return;
    }
    return;
  } else if (method.toUpperCase() === 'GET') {
    if (!url.match(shopListsUrlRegexPattern)) {
      return;
    }
    const listId = +url.match(shopListsUrlRegexPattern)![1];

    if (!listId) {
      // all lists response

      try {
        const shoppingListsInfo = ResponseShoppingLists.parse(data);
        saveShoppingListMetaDataToStorage(shoppingListsInfo);
        return;
      } catch (e) {
        console.error('error parsing data in ResponseShoppingLists', e);
        return;
      }
    } else {
      // single list
      try {
        const shoppingListInfo = ResponseSingleShoppingList.parse(data);
        saveShoppingListItemsToStorage(shoppingListInfo, listId);
        return;
      } catch (e) {
        console.error('error parsing data in ResponseShoppingLists', e);
        return;
      }
    }
  }
}

function saveShoppingListMetaDataToStorage(shoppingListsInfo: z.TypeOf<typeof ResponseShoppingLists>) {
  shoppingListsStorageBucket.set(({ ShoppingLists: prevShoppingLists = [] }) => {
    if (prevShoppingLists.length === 0) {
      return { ShoppingLists: shoppingListsInfo.data };
    }
    // finding different list changes in items-count (and remove items if count was changed)
    const newShoppingLists = shoppingListsInfo.data.map(newList => {
      const prevList = prevShoppingLists.find(prevList => prevList.id === newList.id);
      if (!prevList) {
        return newList;
      }
      if (prevList.items_count !== newList.items_count) {
        return { ...newList, items: [] };
      }
      return prevList; // and not the newList because we want to keep the items, which is not in the response (since this response is just the metadata)
    });
    return { ShoppingLists: newShoppingLists };
  });
}

function saveShoppingListItemsToStorage(shoppingListInfo: z.TypeOf<typeof ResponseSingleShoppingList>, listId: number) {
  shoppingListsStorageBucket.set(({ ShoppingLists: prevShoppingLists = [] }) => {
    // replacing the changed list with the new one
    const newShoppingLists = prevShoppingLists.map(prevList => {
      if (prevList.id === listId) {
        return {
          ...shoppingListInfo.data,
          items_count: shoppingListInfo.data.items.length,
        };
      }
      return prevList;
    });
    return {
      ShoppingLists: newShoppingLists,
    };
  });
}

/*
  MAIN
*/
const main = () => {
  requestIdleCallback(() => {
    const responsesElem = addInjectScriptAfterDOMReady();
    if (!responsesElem) {
      console.error('failed to add inject script');
      return;
    }
    registerInterceptedDataResulstsObserver(responsesElem);
  });
};
main();
