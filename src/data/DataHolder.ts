import { BaseItemType } from "../types/data";

export interface DataHolder <ItemT extends BaseItemType> {
  setData(data: ReadonlyArray <ItemT>): void;
};
