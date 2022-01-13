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
      this.__pages[0].setData(data, 0, itemsPerPage, UsedPagePosition.previous);
      this.__pages[1].setData(data, itemsPerPage, itemsPerPage2x, UsedPagePosition.medium);
      this.__pages[2].setData(data, itemsPerPage2x, itemsPerPage * 3, UsedPagePosition.next);
    } else if (data.length > itemsPerPage) {
      if (initiallyScrollToEnd) {
        this.__pages[0].setData(
          data,
          data.length - itemsPerPage,
          data.length,
          UsedPagePosition.medium
        );
        
        this.__pages[1].setData(
          data,
          0,
          data.length - itemsPerPage,
          UsedPagePosition.previous
        );
      } else {
        this.__pages[0].setData(
          data,
          0,
          itemsPerPage,
          UsedPagePosition.medium
        );
        
        this.__pages[1].setData(
          data,
          itemsPerPage,
          data.length,
          UsedPagePosition.next
        );
      }
    } else if (data.length) {
      this.__pages[0].setData(data, 0, data.length, UsedPagePosition.medium);
    }
    
    const pageReferences: PageReferences = {};
    
    this.__pages.forEach(page => {
      if (page.position !== UnusedPagePosition.unused) {
        pageReferences[page.position] = page;
      }
    });
    
    this.__pageReferences = pageReferences;
  }
  
  setPageLayout(
    nativeEventlayout: Readonly <LayoutRectangle>,
    page: PageDataHolder,
    vertical: boolean
  ) {
    const dimensionKey = vertical ? "height" : "width";
    const originKey = vertical ? "y" : "x";
    
    if (!page.layout) {
      page.setLayout(
        {
          ...nativeEventlayout,
          [originKey]: page.position === UsedPagePosition.previous ? -nativeEventlayout[dimensionKey]
            : page.position === UsedPagePosition.medium ? 0
            : this.__pageReferences.medium.layout[dimensionKey]
        },
        page.position !== UsedPagePosition.medium
      );
    } else if (page.setLayout(nativeEventlayout, false)) {
      const keys = Object.values(UsedPagePosition);
      
      for (
        let i = keys.indexOf(page.position as UsedPagePosition) + 1;
        i < keys.length;
        ++i
      ) {
        const layout = this.__pageReferences[keys[i - 1]].layout;
        const thisPage = this.__pageReferences[keys[i]];
        
        const newLayout = {
          ...thisPage.layout,
          [originKey]: layout[originKey] + layout[dimensionKey]
        }
        
        thisPage.setLayout(newLayout, true);
      }
    }
  }
};

export function useDataHolder <ItemT extends BaseItemType> (): DataHolder <ItemT> {
  return useMemo(() => new DataHolderImpl <ItemT> (), []);
};

type PageReferences = {
  [key in UsedPagePosition]?: PageDataHolder
};
