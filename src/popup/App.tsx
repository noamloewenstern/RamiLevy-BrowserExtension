import { useEffect, useState } from 'react';
import { IStorageShoppingListsBucket, shoppingListsStorageBucket } from '~/shared/shopping-cart/shopping-cart';
export function App() {
  const [shoppingListsMeta, setShoppingListsMeta] = useState([] as IStorageShoppingListsBucket['ShoppingListsMeta']);
  const [shoppingLists, setShoppingLists] = useState([] as IStorageShoppingListsBucket['ShoppingLists']);
  useEffect(() => {
    shoppingListsStorageBucket.get().then(data => {
      setShoppingListsMeta(data.ShoppingListsMeta || []);
      setShoppingLists(data.ShoppingLists || []);
    });
  }, []);
  return (
    <div className='rcet-main-cointainer'>
      <h1>Shopping Lists</h1>
      {shoppingListsMeta.map((meta, index) => (
        <div key={meta.id}>
          <h3>{meta.name}</h3>
          <h4>items_count: {meta.items_count}</h4>
        </div>
      ))}
      <br />
    </div>
  );
}
