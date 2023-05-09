import { useCallback, useEffect, useState } from 'react';
import {
  IStorageShoppingListsBucket,
  ItemsMapBucket,
  shoppingListsStorageBucket,
} from '~/shared/shopping-cart/storage';
import './ShoppingList.scss';
import { clickOnShoppingList, saveShoppingListsToNewList, openShoppingList } from '../utils/communication';
import { downloadAsFile } from '../utils/helpers';
import { addNamesToItems, mergeQuantityDuplicatedItems } from '~/shared/shopping-cart/helpers';
import ToggleSwitch from '../components/ToggleSwitch';

const clearLocalCache = () => {
  shoppingListsStorageBucket.set({ ShoppingLists: [] });
  ItemsMapBucket.set({});
};
type CachedShoppingLists = IStorageShoppingListsBucket['ShoppingLists'];
type UseCachedShoppingListsData = {
  shoppingLists: CachedShoppingLists;
  refresh: () => void;
};
const useCachedShoppingLists = (initialValue = []): UseCachedShoppingListsData => {
  const [shoppingLists, setShoppingLists] = useState<CachedShoppingLists>(initialValue);
  const refresh = useCallback(async () => {
    await openShoppingList({ forceReopen: true });
  }, []);

  useEffect(() => {
    shoppingListsStorageBucket.get().then(data => {
      setShoppingLists(data.ShoppingLists || []);
    });
    shoppingListsStorageBucket.valueStream.subscribe(data => {
      setShoppingLists(data.ShoppingLists || []);
    });
  }, []);

  return { shoppingLists, refresh };
};

export default function _ShoppingList() {
  const { shoppingLists, refresh: refreshShoppingLists } = useCachedShoppingLists();
  const [selectedLists, setSelectedLists] = useState<IStorageShoppingListsBucket['ShoppingLists']>([]);
  const [debug, setDebug] = useState(false);

  async function handleDownloadDuplictedItemsSum() {
    const [, duplicatedItems] = await mergeQuantityDuplicatedItems(...shoppingLists);
    if (!duplicatedItems.length) {
      alert('No Duplicates');
      return;
    }
    const itemsWithNames = await addNamesToItems(duplicatedItems);
    const downloadContent = itemsWithNames.map(item => `${item.name} : ${item.quantity}`).join('\n');

    downloadAsFile(downloadContent, 'duplicated-items.txt');
  }
  async function handleSaveShoppingListsToNewList() {
    const newListName = prompt('Enter new list name');
    if (!newListName) return;
    try {
      await saveShoppingListsToNewList({ shoppingLists: selectedLists, newListName });
    } catch (e: any) {
      console.error(e);
      alert('Error saving list ' + e?.message);
    }
  }
  async function handleDownloadSelectShoppingLists() {
    selectedLists.map(async list => {
      const itemsWithNames = await addNamesToItems(list.items || []);
      const downloadContent = itemsWithNames.map(item => `${item.name} : ${item.quantity}`).join('\n');

      downloadAsFile(downloadContent, `${list.name}.txt`);
    });
  }

  const onCheckShoppingList = (
    isChecked: boolean,
    shoppingListInfo: IStorageShoppingListsBucket['ShoppingLists'][0],
  ) => {
    if (isChecked) {
      setSelectedLists(prev => [...prev, shoppingListInfo]);
    } else {
      setSelectedLists(prev => prev.filter(list => list.id !== shoppingListInfo.id));
    }
  };

  const downloadCache = async () => {
    const data = await shoppingListsStorageBucket.get();
    const s = JSON.stringify(data).slice(0, 100);
    // alert(`data:\n${s}`);
    downloadAsFile(JSON.stringify(data), 'shopping-lists-cache.json');
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
                  <button
                    className='button update-button'
                    onClick={() => clickOnShoppingList({ name: listInfo.name, id: listInfo.id })}
                  >
                    Update
                  </button>
                )}
              </div>
            </li>
          );
        })}
        {shoppingLists.length > 0 ? (
          <>
            {debug && (
              <>
                <button
                  className='button'
                  onClick={handleDownloadSelectShoppingLists}
                  disabled={selectedLists.length === 0}
                >
                  Download Shopping Lists Info
                </button>
                <button
                  className='button'
                  onClick={handleDownloadDuplictedItemsSum}
                  disabled={selectedLists.length !== 2}
                >
                  Download Duplicated Items Sum
                </button>
              </>
            )}
            <button className='button' onClick={handleSaveShoppingListsToNewList} disabled={selectedLists.length === 0}>
              Save To New List
            </button>
            <button className='button' onClick={clearLocalCache}>
              clear cache
            </button>
            <ToggleSwitch id='toggle-debug' isChecked={debug} onChange={() => setDebug(prev => !prev)} label='Debug' />
          </>
        ) : (
          <>
            <button className='button' onClick={refreshShoppingLists}>
              Show Shopping Lists
            </button>

            <button className='button' onClick={downloadCache}>
              Download Cache Storage
            </button>
          </>
        )}
      </ul>
    </div>
  );
}
