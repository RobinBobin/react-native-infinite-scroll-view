import { BaseItemType } from "../data";

export interface RenderItemInfo <ItemT extends BaseItemType> {
  item: ItemT
};

export type RenderItem <ItemT extends BaseItemType> = (info: RenderItemInfo <ItemT>) => React.ReactElement;
