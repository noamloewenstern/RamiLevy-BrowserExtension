import { useEffect, useRef, useState } from 'react';
import {
  IStorageShoppingListsBucket,
  ItemsMapBucket,
  shoppingListsStorageBucket,
} from '~/shared/shopping-cart/shopping-cart';
import './ShoppingList.scss';
import { addProductsToShoppingList, clickOnShoppingList, showShoppingLists } from '../utils/communication';
import { getShoppingListItemsMergedContentFromDuplicates } from './helpers';
import { downloadAsFile } from '../utils/helpers';

const clearLocalCache = () => {
  shoppingListsStorageBucket.set({ ShoppingLists: [] });
  ItemsMapBucket.set({});
};

export default function _ShoppingList() {
  const [shoppingLists, setShoppingLists] = useState<IStorageShoppingListsBucket['ShoppingLists']>([]);
  const [selectedLists, setSelectedLists] = useState<IStorageShoppingListsBucket['ShoppingLists']>([]);
  const applyDuplicateRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    shoppingListsStorageBucket.get().then(data => {
      setShoppingLists(data.ShoppingLists || []);
    });
    shoppingListsStorageBucket.valueStream.subscribe(data => {
      setShoppingLists(data.ShoppingLists || []);
    });
  }, []);
  async function downloadDuplictedItemsSum() {
    if (selectedLists?.length !== 2) {
      alert('You must select only 2 lists');
      return;
    }
    const duplicatedItems = await getShoppingListItemsMergedContentFromDuplicates(selectedLists[0], selectedLists[1]);
    if (duplicatedItems.length === 0) {
      alert('No duplicated items found');
      return;
    }
    const itemsNamesMap = await ItemsMapBucket.get();
    const itemsWithNames = duplicatedItems.map(item => {
      const name = itemsNamesMap[item.item_id] || item.item_id;
      return { ...item, name };
    });
    const downloadContent = itemsWithNames.map(item => `${item.name} : ${item.quantity}`).join('\n');

    downloadAsFile(downloadContent, 'duplicated-items.txt');
  }

  async function applyDuplicateItemsInListToList() {
    if (selectedLists?.length !== 2) {
      alert('You must select only 2 lists');
      return;
    }
    const listId = parseInt(applyDuplicateRef.current!.value);
    const listName = shoppingLists.find(list => list.id === listId)!.name;
    const duplicatedItems = await getShoppingListItemsMergedContentFromDuplicates(selectedLists[0], selectedLists[1]);
    if (duplicatedItems.length === 0) {
      alert('No duplicated items found');
      return;
    }
    const itemsNamesMap = await ItemsMapBucket.get();
    const itemsWithNames = duplicatedItems.map(item => {
      const name = itemsNamesMap[item.item_id] || item.item_id.toString();
      return { ...item, name };
    });

    addProductsToShoppingList({ shoppingListId: listId, shoppingListName: listName, products: itemsWithNames });
  }

  const onCheckShoppingList = (
    isChecked: boolean,
    shoppingListInfo: IStorageShoppingListsBucket['ShoppingLists'][0],
  ) => {
    if (isChecked) {
      if (selectedLists.length === 2) {
        alert('You can select only 2 lists');
        return;
      }
      setSelectedLists(prev => [...prev, shoppingListInfo]);
    } else {
      setSelectedLists(prev => prev.filter(list => list.id !== shoppingListInfo.id));
    }
  };
  return (
    <div className='shopping-lists'>
      <h1>רשימות קנייה</h1>
      <ul>
        {shoppingLists.map(listInfo => {
          const maxChecked = selectedLists.length === 2 && !selectedLists.find(list => list.id === listInfo.id);
          const itemsSavedInCache = listInfo.items?.length || 0 > 0;

          return (
            <li key={listInfo.id}>
              <div className='name'>{listInfo.name}</div>
              <div className='count'>{listInfo.items_count}</div>
              <div className='checkbox'>
                {itemsSavedInCache ? (
                  <input
                    type='checkbox'
                    checked={!!selectedLists.find(list => list.id === listInfo.id)}
                    onChange={e => onCheckShoppingList(e.target.checked, listInfo)}
                    disabled={maxChecked}
                  />
                ) : (
                  <button className='button update-button' onClick={() => clickOnShoppingList(listInfo.name)}>
                    Update
                  </button>
                )}
              </div>
            </li>
          );
        })}
        {shoppingLists.length > 0 ? (
          <>
            <button className='button' onClick={downloadDuplictedItemsSum} disabled={selectedLists.length !== 2}>
              Download Duplicated Items Sum
            </button>
            <div className='select-apply-dup'>
              <button
                className='button'
                onClick={applyDuplicateItemsInListToList}
                disabled={selectedLists.length !== 2}
              >
                Apply Duplicates to
              </button>
              <select ref={applyDuplicateRef}>
                {shoppingLists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
            <button className='button' onClick={clearLocalCache}>
              clear cache
            </button>
          </>
        ) : (
          <button className='button' onClick={showShoppingLists}>
            Show Shopping Lists
          </button>
        )}
      </ul>
    </div>
  );
}
