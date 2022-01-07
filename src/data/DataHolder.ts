import {
  action,
  computed,
  makeObservable,
  observable
} from "mobx";
import { useMemo } from "react";
import { LayoutRectangle } from "react-native";
import { PageDataHolder } from "./PageDataHolder";
import { BaseItemType } from "../types/data";
import {
  UsedPagePosition,
  UnusedPagePosition
} from "../types/ui/page/Position";

export interface DataHolder <ItemT extends BaseItemType> {
  setData(
    data: Array <ItemT>,
    {
      initiallyScrollToEnd,
      itemsPerPage
    }
  ): void
};

export class DataHolderImpl <ItemT extends BaseItemType> implements DataHolder <ItemT> {
  private readonly __pages: ReadonlyArray <PageDataHolder> = [
    new PageDataHolder(),
    new PageDataHolder(),
    new PageDataHolder()
  ];
  
  __pageReferences: Readonly <PageReferences> = {};
  
  constructor() {
    makeObservable(
      this, {
        pageReferences: computed,
        setData: action,
        __pageReferences: observable
      }
    );
  }
  
  get pageReferences(): Readonly <PageReferences> {
    return this.__pageReferences;
  }
  
  setData(
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
    
    this.__pages.forEach(page => page.reset());
    
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
    
    const pageReferences: PageReferences = {};
    
    this.__pages.forEach(page => {
      if (page.position !== UnusedPagePosition.unused) {
        pageReferences[page.position] = page;
      }
    });
    
    this.__pageReferences = pageReferences;
  }
  
  setLayout(layout: Readonly <LayoutRectangle>, page: PageDataHolder) {
    const l = {...layout};
    
    // TODO horizontal
    
    l.y = 
      page.position === UsedPagePosition.previous ? (this.__pageReferences.medium.layout?.y ?? 0) - layout.height
      : page.position === UsedPagePosition.medium ? this.__pageReferences.previous.layout.y + this.__pageReferences.previous.layout.height
      : this.__pageReferences.medium.layout.y + this.__pageReferences.medium.layout.height;
    
    page.layout = l;
  }
};

export function useDataHolder <ItemT extends BaseItemType> (): DataHolder <ItemT> {
  return useMemo(() => new DataHolderImpl <ItemT> (), []);
};

interface PageReferences {
  previous?: PageDataHolder;
  medium?: PageDataHolder;
  next?: PageDataHolder;
}
