import { observer } from "mobx-react-lite";
import React, {
  ForwardedRef,
  useCallback,
  useImperativeHandle,
  useMemo
} from "react";
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet
} from "react-native";
import Animated, {
  useAnimatedStyle
} from "react-native-reanimated";
import { BaseItemType } from "../data/BaseItemType";
import { PageDataHolder } from "../data/PageDataHolder";
import { PageRef } from "../utils/page";

const Page = observer(
  <ItemT extends BaseItemType> (
    props: PageProps <ItemT>,
    ref: ForwardedRef <PageRef>
  ) => {
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
    props.data.layout = nativeEvent.layout;
  }, []);
  
  const containerStyle = useContainerStyle(props);
  
  usePageMethods(ref);
  
  return (
    props.data.isUnused
    ?
      null
    :
      <Animated.View
        onLayout={onLayout}
        style={containerStyle}
      >
        
      </Animated.View>
  );
}, {
  forwardRef: true
});

export { Page };

export interface PageProps <ItemT extends BaseItemType> {
  data: PageDataHolder <ItemT>,
  horizontal?: boolean;
};

function useContainerStyle <ItemT extends BaseItemType> (props: PageProps <ItemT>) {
  return useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor:
          props.data.isPrevious ? "red"
          : props.data.isMedium ? "green"
          : props.data.isNext ? "blue"
          : "black",
        // position: "absolute",
        [props.horizontal ? "width" : "height"]: 100,
        // [props.horizontal ? "height" : "width"]: "100%"
      }
    }).container;
  }, [
    props.data.position,
    props.horizontal
  ]);
}

function usePageMethods(ref: ForwardedRef <PageRef>) {
  useImperativeHandle(ref, () => ({
  }), []);
}
