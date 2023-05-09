import { onMessage } from 'webext-bridge/content-script';
import { wait, waitForValue } from '~/utils/helpers';
import { IShoppingList, IShoppingListItem } from '~/shared/shopping-cart/types';
import {
  addShoppingListToCart,
  clearCurrentCart,
  clickOnShoppingList,
  isDeliveryModalVisible,
  isShoppingListsVisible,
  saveCartAsShoppingList,
  toggleShowShoppingLists,
  waitTillShoppingListsVisible,
} from './actions';
import { getDuplicatedItems } from '~/shared/shopping-cart/helpers';
import { getShoppingListsMetaInfo } from '../rami-levy-cache';
import { ShopList } from '../rami-levy-types';

const mouseOverEvent = new MouseEvent('mouseover', {
  bubbles: true,
  cancelable: true,
  view: window,
});
async function updateProductQuantity({
  list,
  itemAmountElem,
  item,
}: {
  list: { name: string; id: number };
  itemAmountElem: HTMLDivElement;
  item: IShoppingListItem;
}) {
  itemAmountElem.dispatchEvent(mouseOverEvent);

  const plusBtn = await waitForValue(
    () => itemAmountElem.querySelector('button.focus-item.btn-acc.plus') as HTMLButtonElement,
    2000,
  );
  const textDiv = await waitForValue(
    () => itemAmountElem.querySelector('div[type="text"].num-span') as HTMLDivElement,
    2000,
  );

  const maxTimeWait = 6 * 1000;
  await waitForValue(
    async () => {
      const getCurrentAmmount = () => +textDiv.textContent!.trim();
      let prevAmount = getCurrentAmmount();
      while (getCurrentAmmount() !== item.quantity) {
        if (getCurrentAmmount() > item.quantity) {
          alert(`too much amount of ${item.name} in productName: ${list.name}`);
          throw new Error(`too much amount of ${item.name} in productName: ${list.name}`);
        }
        plusBtn.click();

        if (isDeliveryModalVisible()) {
          alert('choose time for delivery, and then try again');
          return true;
        }

        // wait for value to change
        await waitForValue(() => getCurrentAmmount() !== prevAmount, 2000);
        prevAmount = getCurrentAmmount();
      }
      return true;
    },
    {
      ms: maxTimeWait,
      message: `timeout waiting for incrementing item count in shopping list: ${list.name} id ${list.id}`,
    },
  );
}

/*
    Listeners
*/
onMessage('GET_SHOPPING_LISTS_META_INFO', () => {
  // await waitTillShoppingListsVisible();
  return getShoppingListsMetaInfo();
});
onMessage('OPEN_SHOPPING_LIST', ({ data: { name, id } }) => {
  try {
    clickOnShoppingList({ name, id });
  } catch (e) {
    console.error(e);
  }
});

async function handle_APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST({
  id,
  name,
  items,
}: {
  id: number;
  name: string;
  items: Exclude<IShoppingList['items'], undefined>;
}) {
  const duplicatedProducts = items;

  try {
    const viewingShoppingList = await clickOnShoppingList({ name, id });
    if (!viewingShoppingList) {
      throw new Error('shopping list modal not visible');
    }
    const itemsListElem = viewingShoppingList.modalContentElem.querySelector('.inner-scroll.rl-scroll')!;
    for (const product of duplicatedProducts) {
      const itemNameElem = itemsListElem.querySelector(`div[role="button"][id="product-${product.barcode}"]`);
      if (!itemNameElem) {
        console.warn(`product ${product.name} not found in shopping list: ${name} id ${id}`);
        continue;
      }
      const itemAmountElem = itemNameElem?.parentElement?.nextElementSibling?.children[0]! as HTMLDivElement;
      if (!itemAmountElem) {
        console.warn(`product ${product.name} AMOUNT elem not found in shopping list: ${name} id ${id}`);
        continue;
      }
      await updateProductQuantity({ list: { name, id }, itemAmountElem, item: product });
    }
    const addItemsToCartBtn = await waitForValue(
      () => document.querySelector('div.modal-body div > button[aria-label="הוספת מוצרים לסל"]') as HTMLButtonElement,
      { ms: 2000, message: 'timeout waiting for "הוספת מוצרים לסל" button' },
    );
    const saveShoppingListNewQuantity = addItemsToCartBtn.parentElement?.nextElementSibling as HTMLButtonElement;
    if (saveShoppingListNewQuantity?.querySelector('div')?.textContent?.trim() !== 'שמירה') {
      throw new Error('Error Saving shopping list new quantity button not');
    }
    saveShoppingListNewQuantity.click();
    await waitTillShoppingListsVisible();
    await toggleShowShoppingLists(); // closing shopping lists modal
    alert('done!');
    await clickOnShoppingList({ name, id });
  } catch (e: any) {
    console.error(e);
    alert(`Error: ${e.message}`);
  }
}

onMessage('APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST', ({ data }) =>
  handle_APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST(data),
);

onMessage('ADD_SHOPPING_LISTS_TO_NEW_LIST', async ({ data: { shoppingLists, newListName } }) => {
  try {
    await clearCurrentCart();
    for (const shoppingList of shoppingLists) {
      await addShoppingListToCart(shoppingList);
    }
    const prevShoppingLists = getShoppingListsMetaInfo();

    await saveCartAsShoppingList(newListName);
    await wait(1000);
    await waitTillShoppingListsVisible();
    await toggleShowShoppingLists(); // close shopping lists
    // await toggleShowShoppingLists(); // open shopping lists, for triggering update of shopping lists info cache
    await clearCurrentCart();
    const shoppingListsInfo = (await waitForValue(
      () => {
        const currentShoppingListsInfo = getShoppingListsMetaInfo();
        if (currentShoppingListsInfo.length > prevShoppingLists.length) {
          return currentShoppingListsInfo;
        }
      },
      { ms: 5000, message: 'timeout waiting for new shopping list to appear in cache', intervalCheck: 700 },
    )) as ShopList[];
    // open shopping lists
    if (shoppingListsInfo.length === prevShoppingLists.length) {
      throw new Error('failed to create new shopping list');
    }
    const newListId = shoppingListsInfo[shoppingListsInfo.length - 1].id;
    const duplicatedItems = await getDuplicatedItems(...shoppingLists);
    if (duplicatedItems.length === 0) {
      return;
    }
    await handle_APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST({
      id: newListId,
      name: newListName,
      items: duplicatedItems,
    });
  } catch (e) {
    console.error(e);
  }
});

onMessage('OPEN_SHOPPING_LISTS_MODAL', async ({ data: { forceReopen = false } }) => {
  try {
    if (forceReopen && isShoppingListsVisible()) {
      toggleShowShoppingLists();
      await waitForValue(() => !isShoppingListsVisible(), 3000);
    }
    await waitTillShoppingListsVisible();
  } catch (e) {
    console.error(e);
  }
});
