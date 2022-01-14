import { BaseItemType } from "../types/data";

export interface DataHolder <ItemT extends BaseItemType> {
  setData(
    data: Array <ItemT>,
    {
      initiallyScrollToEnd,
      itemsPerPage
    }
  ): void
};
