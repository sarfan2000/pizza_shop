
import create from 'zustand';

type FilterState = {
  sort: string;
  filter: string;
  setSort: (sort: string) => void;
  setFilter: (filter: string) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  sort: 'price-asc',
  filter: '',
  setSort: (sort) => set({ sort }),
  setFilter: (filter) => set({ filter }),
}));
