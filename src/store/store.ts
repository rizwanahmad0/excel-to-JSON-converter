import {create} from 'zustand';
import {Item} from '../components/TabbleJurisdictionMap'

// Define the Item interface
// interface Item {
//   key: number;
//   name: string;
//   // Add other properties here...
// }

// Define the store state interface
interface Store {
  data: Item[];
  addItem: (item: Item[]) => void;
  removeItem: (key: number) => void;
  updateItem: (key: number, newItem: Item) => void;
}

// Create the store with the defined state type
export const usejurisdictionStore = create<Store>((set:any) => ({
  data:[], // Initialize the store with an empty array of items
  addItem: (item: Item[]) => set((state: Store) => ({ data: [...item] })),
  removeItem: (key: number) => set((state: Store) => ({
    data: state.data.filter(item => item.key !== key)
  })),
  updateItem: (key: number, newItem: Item) => set((state: Store) => ({
    data: state.data.map(item =>
      item.key === key ? { ...item, ...newItem } : item
    )
  }))
}));

