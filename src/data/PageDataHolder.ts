import { LayoutRectangle } from "react-native";
import { BaseItemType } from "../types/data";
import {
  PagePosition,
  UnusedPagePosition,
  UsedPagePosition
} from "../types/ui/page/Position";

export class PageDataHolder {
  private __data: ReadonlyArray <StoredItemType>;
  private __layout: Readonly <LayoutRectangle>;
  private __position: PagePosition;
  
  constructor() {
    this.reset();
  }
  
  get data() {
    return this.__data;
  }
  
  get layout(): Readonly <LayoutRectangle> {
    return this.__layout;
  }
  
  set layout(layout: LayoutRectangle) {
    this.__layout = layout;
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
  
  set(data: Array <BaseItemType>, begin: number, end: number, position: UsedPagePosition) {
    this.__data = data.slice(begin, end).map(item => ({
      item
    }));
    
    this.position = position;
  }
};

interface StoredItemType {
  item: BaseItemType
};
