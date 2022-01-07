import {
  StyleProp,
  ViewStyle
} from "react-native";
import { BaseItemType } from "./data";
import { RenderItem } from "./ui";
import {
  DataHolder,
  DataHolderImpl
} from "../data/DataHolder";

export interface ContextType
  <
    ItemT extends BaseItemType,
    DataHolderT extends DataHolder <ItemT> = DataHolderImpl <ItemT>
  >
{
  dataHolder: DataHolderT;
  renderItem: RenderItem <ItemT>;
  style: StyleProp <ViewStyle>;
};
