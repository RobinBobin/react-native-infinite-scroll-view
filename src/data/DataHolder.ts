import { BaseItemType } from "../types/data";

export interface DataHolder <ItemT extends BaseItemType> {
  setData(data: Array <ItemT>, options?: SetDataOptions): void
};

interface SetDataOptions {
  initiallyScrollToEnd?: boolean,
  itemsPerPage?: number
};
