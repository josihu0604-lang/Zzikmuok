import { create } from 'zustand';

type ExploreState = {
  center?: [number, number];
  zoom?: number;
  selectedPlaceId?: string;
};

type FeedState = {
  scrollY: number;
  filters?: string[];
};

type NavState = {
  explore: ExploreState;
  feed: FeedState;
  setExplore: (partial: Partial<ExploreState>) => void;
  setFeed: (partial: Partial<FeedState>) => void;
};

export const useNavStore = create<NavState>((set) => ({
  explore: {},
  feed: { scrollY: 0 },
  setExplore: (partial) =>
    set((state) => ({ explore: { ...state.explore, ...partial } })),
  setFeed: (partial) =>
    set((state) => ({ feed: { ...state.feed, ...partial } })),
}));
