import {
  useMemo
} from "react";
import { PageDataHolder } from "./PageDataHolder";
import { BaseItemType } from "../types/data";
import { UsedPagePosition } from "../types/ui/page/Position";

export class DataHolder <ItemT extends BaseItemType> {
  private readonly __pages: ReadonlyArray <PageDataHolder> = [
    new PageDataHolder(),
    new PageDataHolder(),
    new PageDataHolder()
  ];
  
  set(
    data: Array <ItemT>,
    initiallyScrollToEnd = false,
    itemsPerPage = 50
  ) {
    const maxLength = this.__pages.length * itemsPerPage;
    
    if (data.length > maxLength) {
      throw new RangeError(`Dataset size (${data.length}) can't exceed ${maxLength}`);
    }
    
    const itemsPerPage2x = itemsPerPage * 2;
    const itemsPerPage3x = itemsPerPage * 3;
    
    if (data.length > itemsPerPage2x) {
      this.__pages[0].set(data, 0, itemsPerPage, UsedPagePosition.previous);
      this.__pages[1].set(data, itemsPerPage, itemsPerPage2x, UsedPagePosition.medium);
      this.__pages[2].set(data, itemsPerPage2x, itemsPerPage3x, UsedPagePosition.next);
    } else if (data.length > itemsPerPage) {
      this.__pages[0].set(
        data,
        0,
        itemsPerPage,
        initiallyScrollToEnd ? UsedPagePosition.previous : UsedPagePosition.medium
      );
      
      this.__pages[1].set(
        data,
        itemsPerPage,
        itemsPerPage2x,
        initiallyScrollToEnd ? UsedPagePosition.medium : UsedPagePosition.next
      );
    } else {
      this.__pages[0].set(data, 0, data.length, UsedPagePosition.medium);
    }
  }
};

export function useDataHolder <ItemT extends BaseItemType> () {
  return useMemo(() => new DataHolder <ItemT> (), []);
};
