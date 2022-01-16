import { BaseItemType } from "../types/data";

export interface DataHolder <ItemT extends BaseItemType> {
  setData(data: ReadonlyArray <ItemT>, options?: SetDataOptions): void;
};

interface SetDataOptions {
  initiallyScrollToEnd?: boolean,
  itemsPerPage?: number
};
