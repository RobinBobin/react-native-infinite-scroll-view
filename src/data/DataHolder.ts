import {
  useMemo
} from "react";
import { BaseItemType } from "./BaseItemType";
import { PageDataHolder } from "./PageDataHolder";
import { UsedPagePosition } from "../utils/page/Position";

export class DataHolder <ItemT extends BaseItemType> {
  private readonly __initialDatasetSize: number;
  private readonly __inverted: boolean;
  private readonly __itemsPerPage: number;
  
  private readonly __pages: ReadonlyArray <PageDataHolder <ItemT> > = [
    new PageDataHolder <ItemT> (),
    new PageDataHolder <ItemT> (),
    new PageDataHolder <ItemT> ()
  ];
  
  constructor(inverted: boolean = false, itemsPerPage: number = 50) {
    this.__initialDatasetSize = itemsPerPage * 2;
    this.__inverted = inverted;
    this.__itemsPerPage = itemsPerPage;
  }
  
  get initialDatasetSize() {
    return this.__initialDatasetSize;
  }
  
  get pages() {
    return this.__pages;
  }
  
  set(data: Array <ItemT>) {
    if (data.length > this.initialDatasetSize) {
      throw new RangeError(`Initial dataset size ${data.length} can't exceed ${this.initialDatasetSize}`);
    }
    
    const itemsPerPage1x = this.__itemsPerPage;
    const itemsPerPage2x = itemsPerPage1x * 2;
    
    this.__pages[0].set(data, 0, itemsPerPage1x, UsedPagePosition.medium);
    this.__pages[1].set(data, itemsPerPage1x, itemsPerPage2x, this.__inverted ? UsedPagePosition.previous : UsedPagePosition.next);
  }
};

export function useDataHolder <ItemT extends BaseItemType> (inverted?: boolean, itemsPerPage?: number) {
  return useMemo(() => new DataHolder <ItemT> (inverted, itemsPerPage), []);
};
