import {
  StyleProp,
  ViewStyle
} from "react-native";
import { BaseItemType } from "./data";
import { RenderItem } from "./ui";
import { DataHolder } from "../data/DataHolder";
import { DataHolderImpl } from "../data/DataHolderImpl";

export interface ContextType
  <
    ItemT extends BaseItemType,
    DataHolderT extends DataHolder <ItemT> = DataHolderImpl <ItemT>
  >
{
  dataHolder: DataHolderT;
  debugLogsEnabled?: boolean;
  renderItem: RenderItem <ItemT>;
  style: StyleProp <ViewStyle>;
};
