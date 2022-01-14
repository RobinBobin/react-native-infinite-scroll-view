import {
  action,
  computed,
  makeObservable,
  observable
} from "mobx";
import { useMemo } from "react";
import { LayoutRectangle } from "react-native";
import {
  SharedValue,
  useSharedValue
} from "react-native-reanimated";
import { DataHolder } from "./DataHolder";
import { PageDataHolder } from "./PageDataHolder";
import { BaseItemType } from "../types/data";
import { PagePosition } from "../types/ui/page/Position";

export class DataHolderImpl <ItemT extends BaseItemType> implements DataHolder <ItemT> {
  private __pages: ReadonlyArray <PageDataHolder>;
  private __translation: SharedValue <number>;
  
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
    const maxLength = 3 * itemsPerPage;
    
    if (data.length > maxLength) {
      throw new RangeError(`Dataset size (${data.length}) can't exceed ${maxLength}`);
    }
    
    const itemsPerPage2x = itemsPerPage * 2;
    
    if (data.length > itemsPerPage2x) {
      this.__pages = [
        new PageDataHolder(data, 0, itemsPerPage, PagePosition.previous),
        new PageDataHolder(data, itemsPerPage, itemsPerPage2x, PagePosition.medium),
        new PageDataHolder(data, itemsPerPage2x, itemsPerPage * 3, PagePosition.next)
      ];
    } else if (data.length > itemsPerPage) {
      if (initiallyScrollToEnd) {
        this.__pages = [
          new PageDataHolder(
            data,
            0,
            data.length - itemsPerPage,
            PagePosition.previous
          ),
          new PageDataHolder(
            data,
            data.length - itemsPerPage,
            data.length,
            PagePosition.medium
          )
        ];
      } else {
        this.__pages = [
          new PageDataHolder(
            data,
            0,
            itemsPerPage,
            PagePosition.medium
          ),
          new PageDataHolder(
            data,
            itemsPerPage,
            data.length,
            PagePosition.next
          )
        ];
      }
    } else if (data.length) {
      this.__pages = [new PageDataHolder(data, 0, data.length, PagePosition.medium)];
    }
    
    const pageReferences: PageReferences = {};
    
    this.__pages.forEach(page => {
      pageReferences[page.position] = page;
    });
    
    this.__pageReferences = pageReferences;
    
    if (this.__translation) {
      this.__translation.value = 0;
    }
  }
  
  setPageLayout(
    nativeEventLayout: Readonly <LayoutRectangle>,
    page: PageDataHolder,
    vertical: boolean
  ) {
    const nativeEventDimension = nativeEventLayout[vertical ? "height" : "width"];
    
    console.log(`No layout yet: ${!page.layout}`);
    
    if (!page.layout) {
      page.setLayout(
        {
          dimension: nativeEventDimension,
          origin: page.position === PagePosition.previous ? -nativeEventDimension
            : page.position === PagePosition.medium ? 0
            : this.__pageReferences.medium.layout.dimension
        },
        page.position !== PagePosition.medium
      );
    } else {
      if (page.setLayout(
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
          const layout = this.__pageReferences[keys[i - 1]].layout;
          const thisPage = this.__pageReferences[keys[i]];
          
          thisPage.setLayout(
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
  
  useTranslation() {
    this.__translation = useSharedValue(0);
    
    return this.__translation;
  }
};

export function useDataHolder <ItemT extends BaseItemType> (): DataHolder <ItemT> {
  return useMemo(() => new DataHolderImpl <ItemT> (), []);
};

type PageReferences = {
  [key in PagePosition]?: PageDataHolder
};
