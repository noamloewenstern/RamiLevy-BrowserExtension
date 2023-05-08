import { onMessage } from 'webext-bridge/content-script';
import pTimeout from 'p-timeout';
import { delay } from '~/utils/helpers';
import { z } from 'zod';
import { ShoppingList } from '~/shared/shopping-cart/types';

interface ItemInfo {
  itemId: number;
  name: string;
  quantity: number;
  price?: number;
  totalPrice?: number;
  isAvailable?: boolean;
  isOnSale?: boolean;
}
interface ShoppingListMetaInfo {
  id: number;
  name: string;
  size: number;
  shoppingListElement: HTMLDivElement;
}
interface ShoppingListInfo extends ShoppingListMetaInfo {
  items: ItemInfo[];
}

async function clickOnShoppingList(shoppingListName: string, { stopRecursiveCheck = false } = {}) {
  if (!isShoppingListsVisible()) {
    if (stopRecursiveCheck) {
      throw new Error('[clickOnShoppingList] ShoppingList lists are not visible');
    }
    document.querySelector<HTMLDialogElement>('#my-list')?.click();
    await delay(1000);
    return clickOnShoppingList(shoppingListName, { stopRecursiveCheck: true });
  }

  const shoppingListsInfo = getShoppingListsMetaInfo();
  if (!shoppingListsInfo) {
    throw new Error('No shopping lists info found');
  }
  const shoppingListInfo = shoppingListsInfo.find(({ name }) => name === shoppingListName);
  if (!shoppingListInfo) {
    throw new Error(`Shopping List With Name "${shoppingListName}" not found`);
  }
  const clickableElemInsideShoppingList =
    shoppingListInfo.shoppingListElement.querySelector<HTMLDivElement>('div[role="button"]')!;
  clickableElemInsideShoppingList.click();
}
function getShoppingListsMetaInfo() {
  if (!isShoppingListsVisible()) {
    throw new Error('ShoppingList lists are not visible');
  }
  const listsDivs = [
    ...(document.querySelector<HTMLDivElement>('#online-cart-wrap > div > div:nth-child(2) > div > div > div')
      ?.children || []),
  ];
  if (!listsDivs.length) {
    throw new Error('No Shopping Lists found');
  }

  return (listsDivs as HTMLDivElement[]).map(getShoppingListMetaInfo);
}
function isShoppingListsVisible() {
  return document.querySelector<HTMLDivElement>('#online-cart-wrap')?.classList.contains('is-list');
}

function getShoppingListIdFromElem(shoppingListElem: HTMLDivElement) {
  const divShoppingListIdRegexPattern = /^list-(\d+)$/;

  // Get the div element that matches the regular expression
  const divElement = shoppingListElem.querySelector<HTMLDivElement>('div[id^="list-"]:not([id=""])');
  if (!divElement) {
    throw new Error('No shoping list div found');
  }
  const match = !divShoppingListIdRegexPattern.exec(divElement.getAttribute('id') || '');

  const shoppingListId = +match[1];
  return shoppingListId;
}

function getShoppingListMetaInfo(shoppingListDiv: HTMLDivElement): ShoppingListMetaInfo {
  const shoppingListBtn = [...shoppingListDiv.querySelectorAll('div[role="button"]')].find(e =>
    e?.textContent?.includes('פתח חלונית רשימה'),
  );
  if (!shoppingListBtn) {
    throw new Error('No ShoppingList button found');
  }

  const shoppingListName = shoppingListBtn.childNodes[0].textContent!.trim()!;
  const shoppingListSize = +shoppingListBtn
    .nextElementSibling!.querySelector<HTMLSpanElement>('span')!
    .textContent!.trim()!;
  const shoppingListId = getShoppingListIdFromElem(shoppingListDiv);

  return {
    id: shoppingListId,
    name: shoppingListName,
    size: shoppingListSize,
    shoppingListElement: shoppingListDiv,
  };
}

function waitForShoppingListToBeInView({ name, id, waitMs = 6 * 1000 }: { name: string; id: number; waitMs: number }) {
  // const modelId = `__BVID__${id}___BV_modal_outer_`;
  return new Promise<HTMLDivElement>(resolve => {
    const maxSeconds = 6;
    let currentSecond = 0;
    const interval = setInterval(() => {
      currentSecond++;
      const modal = document.querySelector<HTMLDivElement>('div.modal-dialog.modal-lg > div.modal-content');
      if (modal) {
        clearInterval(interval);
        resolve(modal);
      } else if (currentSecond > maxSeconds) {
        clearInterval(interval);
        throw new Error(`Timeout: Shopping List Modal not in view`);
      }
    }, 1000);
  });
}

/*
    Listeners
*/
onMessage('OPEN_SHOPPING_LISTS', () => {
  if (!isShoppingListsVisible()) {
    document.querySelector<HTMLDivElement>('#my-list')?.click();
  } else {
    document.querySelector<HTMLDivElement>('#my-list')?.click();
    // openning after closing
    setTimeout(() => {
      document.querySelector<HTMLDivElement>('#my-list')?.click();
    }, 200);
  }
});
onMessage('OPEN_SHOPPING_LIST_BY_NAME', ({ data: shoppingListName }) => {
  try {
    clickOnShoppingList(shoppingListName);
  } catch (e) {
    console.error(e);
  }
});

onMessage(
  'APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST',
  async ({ data: { shoppingListName, shoppingListId, products } }) => {
    const duplicatedProducts = products as Exclude<z.TypeOf<typeof ShoppingList>['items'], undefined>;
    const mouseOverEvent = new MouseEvent('mouseover', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    try {
      await clickOnShoppingList(shoppingListName);
      const modalElem = await waitForShoppingListToBeInView({
        name: shoppingListName,
        id: shoppingListId,
        waitMs: 6 * 1000,
      });
      const itemsListElem = modalElem.querySelector('.inner-scroll.rl-scroll')!;
      for (const product of duplicatedProducts) {
        const itemNameElem = itemsListElem.querySelector(`div[role="button"][id="product-${product.barcode}"]`);
        if (!itemNameElem) {
          continue;
        }
        const itemAmountElem = itemNameElem?.parentElement?.nextElementSibling?.children[0]!;
        if (!itemAmountElem) {
          continue;
        }

        itemAmountElem.dispatchEvent(mouseOverEvent);
        await delay(100);
        const plusBtn = itemAmountElem.querySelector('button.focus-item.btn-acc.plus') as HTMLButtonElement | undefined;
        const textDiv = itemAmountElem.querySelector('div[type="text"].num-span') as HTMLDivElement | undefined;

        if (!textDiv || !plusBtn) {
          console.error('no textDiv content elem or plusBtn elem');
          continue;
        }

        const maxTimeWait = 6 * 1000;

        await pTimeout(
          new Promise(async resolve => {
            const getCurrentAmmount = () => +textDiv.textContent!.trim();
            let prevAmount = getCurrentAmmount();
            while (getCurrentAmmount() !== product.quantity) {
              if (getCurrentAmmount() > product.quantity) {
                alert(`too much amount of ${product.name} in productName: ${shoppingListName}`);
                return;
              }
              plusBtn.click();
              if (isDeliveryModalVisible()) {
                alert('choose time for delivery, and then try again');
                return resolve(void 0);
                // closeDeliveryModal();
                // await delay(100);
              }
              await waitForElemContentToChange(textDiv, prevAmount.toString(), maxTimeWait);
              prevAmount = getCurrentAmmount();
            }
            resolve(void 0);
          }),
          { milliseconds: maxTimeWait },
        );
      }
      alert('done!');
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }

    return { success: true };
  },
);

function getDeliveryModal() {
  return document.querySelector<HTMLDivElement>('.delivery-modal');
}
function closeDeliveryModal() {
  const modal = getDeliveryModal();
  if (!modal) {
    return;
  }
  const closeBtn = modal.querySelector<HTMLDivElement>('div#close-popup');
  closeBtn?.click();
}
function isDeliveryModalVisible() {
  return getDeliveryModal() !== null;
}

async function waitForElemContentToChange(elem: HTMLElement, content: string, maxTimeWait: number) {
  const startTime = Date.now();
  while (elem.textContent?.trim() === content) {
    if (Date.now() - startTime > maxTimeWait) {
      throw new Error(`Timeout: elem content not changed`);
    }
    await delay(100);
  }
}
