import {
  action,
  computed,
  makeObservable,
  observable
} from "mobx";
import { LayoutRectangle } from "react-native";
import { BaseItemType } from "../types/data";
import {
  PagePosition,
  UnusedPagePosition,
  UsedPagePosition
} from "../types/ui/page/Position";
import { strictDeepEqual } from "../utils";

export class PageDataHolder {
  private __data: ReadonlyArray <StoredItemType>;
  private __layout: Readonly <LayoutRectangle>;
  private __position: PagePosition;
  
  __layoutChanged = 0;
  
  constructor() {
    this.reset();
    
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
  
  get layout(): Readonly <LayoutRectangle> {
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
  
  reset() {
    this.__data = [];
    this.__layout = null;
    this.__position = UnusedPagePosition.unused;
  }
  
  setData(data: Array <BaseItemType>, begin: number, end: number, position: UsedPagePosition) {
    this.__data = data.slice(begin, end).map(item => ({
      item
    }));
    
    this.position = position;
  }
  
  setLayout(layout: LayoutRectangle, rerender: boolean) {
    console.log(`Page '${this.__position}' setLayout()`);
    
    const layoutSet = !strictDeepEqual(this.__layout, layout);
    
    if (layoutSet) {
      console.log(`Current layout: ${JSON.stringify(this.__layout)}, new layout: ${JSON.stringify(layout)}, rerender: ${rerender}`);
      
      this.__layout = layout;
      
      if (rerender) {
        this.__layoutChanged ^= 1;
      }
    } else {
      console.log("skipping");
    }
    
    return layoutSet;
  }
};

interface StoredItemType {
  item: BaseItemType
};
