import {
  useMemo
} from "react";
import { BaseItemType } from "./BaseItemType";
import { PageDataHolder } from "./PageDataHolder";

export class DataHolder <ItemT extends BaseItemType> {
  __maxItemCount: number;
  
  __page1 = new PageDataHolder <ItemT> ();
  __page2 = new PageDataHolder <ItemT> ();
  __page3 = new PageDataHolder <ItemT> ();
  
  __onSetData: Listener;
  
  constructor(itemsPerPage: number = 50) {
    this.__maxItemCount = itemsPerPage * 3;
  }
  
  get maxItemCount() {
    return this.__maxItemCount;
  }
  
  get page1() {
    return this.__page1;
  }
  
  get page2() {
    return this.__page2;
  }
  
  get page3() {
    return this.__page3;
  }
  
  set(data: Array <ItemT>) {
    const itemsPerPage = this.maxItemCount / 3;
    
    let index = 0;
    
    this.__page1.set(data, index++ * itemsPerPage, index * itemsPerPage);
    this.__page2.set(data, index++ * itemsPerPage, index * itemsPerPage);
    this.__page3.set(data, index++ * itemsPerPage, index * itemsPerPage);
    
    this.__onSetData();
  }
  
  _setListeners(onSetData: Listener) {
    this.__onSetData = onSetData;
  }
};

export function useDataHolder <ItemT extends BaseItemType> (itemsPerPage?: number) {
  return useMemo(() => new DataHolder <ItemT> (itemsPerPage), []);
};

type Listener = () => void;
