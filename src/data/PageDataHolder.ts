import {
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

export class PageDataHolder <ItemT extends BaseItemType> {
  private __data: ReadonlyArray <StoredItemType <ItemT> > = [];
  private __previousPosition: PagePosition;
  
  __layout: LayoutRectangle = null;
  __position: PagePosition = UnusedPagePosition.unused;
  
  constructor() {
    makeObservable(
      this,
      {
        layout: computed,
        position: computed,
        __layout: observable,
        __position: observable
      }
    );
  }
  
  get data() {
    return this.__data;
  }
  
  get isLayoutValid() {
    return !!this.__layout;
  }
  
  get isMedium() {
    return this.__position === UsedPagePosition.medium;
  }
  
  get isNext() {
    return this.__position === UsedPagePosition.next;
  }
  
  get isPrevious() {
    return this.__position === UsedPagePosition.previous;
  }
  
  get isUnused() {
    return this.__position === UnusedPagePosition.unused;
  }
  
  get layout() {
    return this.__layout;
  }
  
  set layout(layout: LayoutRectangle) {
    this.__layout = layout;
  }
  
  get position() {
    return this.__position;
  }
  
  set position(position: PagePosition) {
    this.__previousPosition = this.__position;
    this.__position = position;
  }
  
  set(data: Array <ItemT>, begin: number, end: number, position: UsedPagePosition) {
    this.__data = data.slice(begin, end).map(item => ({
      item
    }));
    
    this.position = position;
  }
};

interface StoredItemType <ItemT extends BaseItemType> {
  item: ItemT
};
