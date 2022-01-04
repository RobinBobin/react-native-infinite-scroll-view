import {
  StyleProp,
  ViewStyle
} from "react-native";
import { BaseItemType } from "./data";
import { RenderItem } from "./ui";
import { DataHolder } from "../data/DataHolder";

export interface ContextType <ItemT extends BaseItemType> {
  dataHolder: DataHolder <ItemT>;
  renderItem: RenderItem <ItemT>;
  style: StyleProp <ViewStyle>;
};
