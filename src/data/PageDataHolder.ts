import {
  action,
  computed,
  makeObservable,
  observable
} from "mobx";
import { BaseItemType } from "../types/data";
import { PagePosition } from "../types/ui/page";
import { strictDeepEqual } from "../utils";

export class PageDataHolder {
  __data: Array <StoredItemType>;
  __layout: PageLayout;
  __position: PagePosition;
  
  constructor() {
    this.reset();
    
    makeObservable(
      this, {
        data: computed,
        layout: computed,
        position: computed,
        reset: action,
        setData: action,
        setLayout: action,
        __data: observable,
        __layout: observable,
        __position: observable,
      }
    );
  }
  
  get data(): ReadonlyArray <StoredItemType> {
    return this.__data;
  }
  
  get hasLayout() {
    return !!this.layout.dimension;
  }
  
  get layout(): Readonly <PageLayout> {
    return this.__layout;
  }
  
  get position() {
    return this.__position;
  }
  
  set position(position: PagePosition) {
    this.__position = position;
  }
  
  reset() {
    this.__data = [];
    
    this.__layout = {
      dimension: 0,
      origin: 0
    };
    
    this.__position = null;
  }
  
  setData(
    data: ReadonlyArray <BaseItemType>,
    position: PagePosition,
    begin?: number,
    end?: number
  ) {
    if (arguments.length !== 2 && arguments.length !== 4) {
      throw new Error("Only 2 or 4 parameters can be supplied");
    }
    
    this.__data = (arguments.length === 2 ? data : data.slice(begin, end)).map(item => ({
      item
    }));
    
    this.position = position;
  }
  
  setLayout(debugLogsEnabled: boolean, layout: PageLayout, rerender: boolean) {
    debugLogsEnabled && console.log(`Page '${this.position}' setLayout()`);
    
    const layoutsDiffer = !strictDeepEqual(this.layout, layout);
    
    if (!layoutsDiffer) {
      debugLogsEnabled && console.log("skipping");
    } else {
      debugLogsEnabled && console.log(`Current layout: ${JSON.stringify(this.layout)}, new layout: ${JSON.stringify(layout)}, rerender: ${rerender}`);
      
      if (rerender) {
        this.__layout = layout;
      } else {
        Object.keys(layout).forEach(key => this.__layout[key] = layout[key]);
      }
    }
    
    return layoutsDiffer;
  }
};

interface PageLayout {
  dimension: number;
  origin: number;
};

interface StoredItemType {
  item: BaseItemType
};
