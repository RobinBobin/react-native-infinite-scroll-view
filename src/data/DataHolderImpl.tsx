import React, {
  DependencyList,
  useMemo
} from "react";
import { LayoutRectangle } from "react-native";
import {
  SharedValue,
  useSharedValue
} from "react-native-reanimated";
import { DataHolder } from "./DataHolder";
import { PageDataHolder } from "./PageDataHolder";
import { BaseItemType } from "../types/data";
import {
  PageAnimatedStyle,
  PagePosition
} from "../types/ui/page";
import { Page } from "../ui/Page";

export class DataHolderImpl <ItemT extends BaseItemType> implements DataHolder <ItemT> {
  private __initiallyScrollToEnd = false;
  private __itemsPerPage = 10;
  
  private readonly __pages: ReadonlyArray <PageDataHolder> = Array.from(Array(3)).map(() => new PageDataHolder());
  
  private __translation: SharedValue <number>;
  
  get initiallyScrollToEnd() {
    return this.__initiallyScrollToEnd;
  }
  
  set initiallyScrollToEnd(initiallyScrollToEnd) {
    this.__initiallyScrollToEnd = initiallyScrollToEnd;
  }
  
  get itemsPerPage() {
    return this.__itemsPerPage;
  }
  
  set itemsPerPage(itemsPerPage) {
    this.__itemsPerPage = itemsPerPage;
  }
  
  setData(data: ReadonlyArray <ItemT>): void {
    const maxLength = this.__pages.length * this.itemsPerPage;
    
    if (data.length > maxLength) {
      throw new RangeError(`Dataset size (${data.length}) can't exceed ${maxLength}`);
    }
    
    const itemsPerPage2x = this.itemsPerPage * 2;
    
    this.__pages.forEach(page => page.reset());
    
    if (data.length > itemsPerPage2x) {
      this.__pages[0].setData(data, PagePosition.previous, 0, this.itemsPerPage);
      this.__pages[1].setData(data, PagePosition.middle, this.itemsPerPage, itemsPerPage2x);
      this.__pages[2].setData(data, PagePosition.next, itemsPerPage2x, this.itemsPerPage * 3);
    } else if (data.length > this.itemsPerPage) {
      if (this.initiallyScrollToEnd) {
        this.__pages[0].setData(data, PagePosition.previous, 0, data.length - this.itemsPerPage);
        this.__pages[1].setData(data, PagePosition.middle, data.length - this.itemsPerPage, data.length);
      } else {
        this.__pages[0].setData(data, PagePosition.middle, 0, this.itemsPerPage);
        this.__pages[1].setData(data, PagePosition.next, this.itemsPerPage, data.length);
      }
    } else if (data.length) {
      this.__pages[0].setData(data, PagePosition.middle);
    }
    
    if (this.__translation) {
      this.__translation.value = 0;
    }
  }
  
  setPageLayout(
    debugLogsEnabled: boolean,
    nativeEventLayout: Readonly <LayoutRectangle>,
    page: PageDataHolder,
    vertical: boolean
  ) {
    const nativeEventDimension = nativeEventLayout[vertical ? "height" : "width"];
    
    debugLogsEnabled && console.log(`No layout yet: ${!page.hasLayout}`);
    
    if (!page.hasLayout) {
      page.setLayout(
        debugLogsEnabled,
        {
          dimension: nativeEventDimension,
          origin: page.position === PagePosition.previous ? -nativeEventDimension
            : page.position === PagePosition.middle ? 0
            : this.__getPage(PagePosition.middle).layout.dimension
        },
        page.position !== PagePosition.middle
      );
    } else {
      if (page.setLayout(
        debugLogsEnabled,
        {
          dimension: nativeEventDimension,
          origin: nativeEventLayout[vertical ? "y" : "x"]
        },
        false
      )) {
        const keys = Object.values(PagePosition);
        
        for (
          let i = keys.indexOf(page.position) + 1;
          i < keys.length;
          ++i
        ) {
          const layout = this.__getPage(keys[i - 1]).layout;
          const thisPage = this.__getPage(keys[i]);
          
          thisPage.setLayout(
            debugLogsEnabled,
            {
              ...thisPage.layout,
              origin: layout.origin + layout.dimension
            },
            true
          );
        }
      }
    }
  }
  
  usePages(pageAnimatedStyle: PageAnimatedStyle) {
    return useMemo(() => this.__pages.map((page, index) => (
      <Page
        key={index}
        page={page}
        pageAnimatedStyle={pageAnimatedStyle}
      />
    )), [pageAnimatedStyle]);
  }
  
  useTranslation() {
    this.__translation = useSharedValue(0);
    
    return this.__translation;
  }
  
  __getPage(position: PagePosition) {
    return this.__pages.find(page => page.position === position);
  }
};

export function useDataHolder <ItemT extends BaseItemType> (
  initializer?: (dataHolder: DataHolder <ItemT>) => void,
  deps: DependencyList = []
  
): DataHolder <ItemT> {
  return useMemo(() => {
    const dataHolder = new DataHolderImpl <ItemT> ();
    
    if (initializer) {
      initializer(dataHolder);
    }
    
    return dataHolder;
  }, deps);
};
