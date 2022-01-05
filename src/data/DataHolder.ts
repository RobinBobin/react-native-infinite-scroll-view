import {
  useMemo
} from "react";
import { PageDataHolder } from "./PageDataHolder";
import { BaseItemType } from "../types/data";
import {
  UsedPagePosition,
  UnusedPagePosition
} from "../types/ui/page/Position";

export class DataHolder <ItemT extends BaseItemType> {
  private readonly __pages: ReadonlyArray <PageDataHolder> = [
    new PageDataHolder(),
    new PageDataHolder(),
    new PageDataHolder()
  ];
  
  getPages(): {
    previous?: PageDataHolder;
    medium?: PageDataHolder;
    next?: PageDataHolder
  } {
    const result = {};
    
    this.__pages.forEach(page => {
      if (page.position !== UnusedPagePosition.unused) {
        result[page.position] = page;
      }
    });
    
    return result;
  }
  
  set(
    data: Array <ItemT>,
    {
      initiallyScrollToEnd = false,
      itemsPerPage = 50
    }
  ) {
    const maxLength = this.__pages.length * itemsPerPage;
    
    if (data.length > maxLength) {
      throw new RangeError(`Dataset size (${data.length}) can't exceed ${maxLength}`);
    }
    
    const itemsPerPage2x = itemsPerPage * 2;
    
    if (data.length > itemsPerPage2x) {
      this.__pages[0].set(data, 0, itemsPerPage, UsedPagePosition.previous);
      this.__pages[1].set(data, itemsPerPage, itemsPerPage2x, UsedPagePosition.medium);
      this.__pages[2].set(data, itemsPerPage2x, itemsPerPage * 3, UsedPagePosition.next);
    } else if (data.length > itemsPerPage) {
      if (initiallyScrollToEnd) {
        this.__pages[0].set(
          data,
          data.length - itemsPerPage,
          data.length,
          UsedPagePosition.medium
        );
        
        this.__pages[1].set(
          data,
          0,
          data.length - itemsPerPage,
          UsedPagePosition.previous
        );
      } else {
        this.__pages[0].set(
          data,
          0,
          itemsPerPage,
          UsedPagePosition.medium
        );
        
        this.__pages[0].set(
          data,
          itemsPerPage,
          data.length,
          UsedPagePosition.next
        );
      }
    } else if (data.length) {
      this.__pages[0].set(data, 0, data.length, UsedPagePosition.medium);
    }
  }
};

export function useDataHolder <ItemT extends BaseItemType> () {
  return useMemo(() => new DataHolder <ItemT> (), []);
};
