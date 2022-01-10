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
  
  __rerenderRequest = 0;
  
  constructor() {
    this.reset();
    
    makeObservable(
      this, {
        rerenderRequest: computed,
        setLayout: action,
        __rerenderRequest: observable
      }
    );
  }
  
  get data() {
    return this.__data;
  }
  
  get layout(): Readonly <LayoutRectangle> {
    return this.__layout;
  }
  
  get position() {
    return this.__position;
  }
  
  set position(position: PagePosition) {
    this.__position = position;
  }
  
  get rerenderRequest() {
    return this.__rerenderRequest;
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
        this.__rerenderRequest ^= 1;
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
