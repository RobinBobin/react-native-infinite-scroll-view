import {
  ImageStyle,
  TextStyle,
  ViewStyle
} from "react-native";
import {
  AnimatedStyleProp
} from "react-native-reanimated";

export type PageAnimatedStyle = AnimatedStyleProp <ViewStyle | ImageStyle | TextStyle>;

export enum PagePosition {
  previous = "previous",
  middle = "middle",
  next = "next"
};
