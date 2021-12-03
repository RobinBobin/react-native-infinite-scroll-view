import BaseItemType from "./BaseItemType";

export default class PageDataHolder <ItemT extends BaseItemType> {
  __data: ReadonlyArray <StoredItemType <ItemT> >;
  
  __isPrevious: boolean;
  __isMedium: boolean;
  __isNext: boolean;
  
  get data() {
    return this.__data;
  }
  
  get isMedium() {
    return this.__isMedium;
  }
  
  set isMedium(isMedium) {
    this.__isMedium = isMedium;
  }
  
  get isNext() {
    return this.__isNext;
  }
  
  set isNext(isNext) {
    this.__isNext = isNext;
  }
  
  get isPrevious() {
    return this.__isPrevious;
  }
  
  set isPrevious(isPrevious) {
    this.__isPrevious = isPrevious;
  }
  
  set(data: Array <ItemT>, begin: number, end: number) {
    this.__data = data.slice(begin, end).map(item => ({
      item
    }));
  }
};

interface StoredItemType <ItemT extends BaseItemType> {
  item: ItemT
};
