import {
  action,
  computed,
  makeObservable,
  observable
} from "mobx";
import { LayoutRectangle } from "react-native";
import { BaseItemType } from "../types/data";
import { PagePosition } from "../types/ui/page/Position";
import { strictDeepEqual } from "../utils";

export class PageDataHolder {
  private readonly __data: ReadonlyArray <StoredItemType>;
  private __layout: PageLayout;
  private __position: PagePosition;
  
  __layoutChanged = 0;
  
  constructor(
    data: Array <BaseItemType>,
    begin: number,
    end: number,
    position: PagePosition
  ) {
    this.__data = data.slice(begin, end).map(item => ({
      item
    }));
    
    this.position = position;
    
    makeObservable(
      this, {
        layoutChanged: computed,
        setLayout: action,
        __layoutChanged: observable
      }
    );
  }
  
  get data() {
    return this.__data;
  }
  
  get layout(): PageLayout {
    return this.__layout;
  }
  
  get layoutChanged() {
    return this.__layoutChanged;
  }
  
  get position() {
    return this.__position;
  }
  
  set position(position: PagePosition) {
    this.__position = position;
  }
  
  setLayout(layout: PageLayout, rerender: boolean) {
    console.log(`Page '${this.__position}' setLayout()`);
    
    const layoutsDiffer = !strictDeepEqual(this.__layout, layout);
    
    if (layoutsDiffer) {
      console.log(`Current layout: ${JSON.stringify(this.__layout)}, new layout: ${JSON.stringify(layout)}, rerender: ${rerender}`);
      
      this.__layout = layout;
      
      if (rerender) {
        this.__layoutChanged ^= 1;
      }
    } else {
      console.log("skipping");
    }
    
    return layoutsDiffer;
  }
};

type PageLayout = Readonly <{
  dimension: number;
  origin: number;
}>;

interface StoredItemType {
  item: BaseItemType
};
