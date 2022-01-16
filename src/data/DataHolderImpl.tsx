import React, {
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
  private readonly __pages: ReadonlyArray <PageDataHolder> = Array.from(Array(3)).map(() => new PageDataHolder());
  
  private __translation: SharedValue <number>;
  
  setData(
    data: ReadonlyArray <ItemT>,
    {
      initiallyScrollToEnd = false,
      itemsPerPage = 50
    } = {}
  ): void {
    const maxLength = 3 * itemsPerPage;
    
    if (data.length > maxLength) {
      throw new RangeError(`Dataset size (${data.length}) can't exceed ${maxLength}`);
    }
    
    const itemsPerPage2x = itemsPerPage * 2;
    
    this.__pages.forEach(page => page.reset());
    
    if (data.length > itemsPerPage2x) {
      this.__pages[0].setData(data, PagePosition.previous, 0, itemsPerPage);
      this.__pages[1].setData(data, PagePosition.middle, itemsPerPage, itemsPerPage2x);
      this.__pages[2].setData(data, PagePosition.next, itemsPerPage2x, itemsPerPage * 3);
    } else if (data.length > itemsPerPage) {
      if (initiallyScrollToEnd) {
        this.__pages[0].setData(data, PagePosition.previous, 0, data.length - itemsPerPage);
        this.__pages[1].setData(data, PagePosition.middle, data.length - itemsPerPage, data.length);
      } else {
        this.__pages[0].setData(data, PagePosition.middle, 0, itemsPerPage);
        this.__pages[1].setData(data, PagePosition.next, itemsPerPage, data.length);
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

export function useDataHolder <ItemT extends BaseItemType> (): DataHolder <ItemT> {
  return useMemo(() => new DataHolderImpl <ItemT> (), []);
};
