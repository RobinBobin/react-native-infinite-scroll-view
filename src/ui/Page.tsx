import React, {
  MutableRefObject,
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef
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

const Page = forwardRef(<ItemT extends BaseItemType>(props: PageProps <ItemT>, ref: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const result = {};
    
    result[props.horizontal ? "start" : "top"] =
      props.backgroundColor == "red" ? 0
      : props.backgroundColor == "green" ? 100
      : 200;
    
    result[props.horizontal ? "top" : "start"] = undefined;
    
    return result;
  }, [props.horizontal]);
  
  const layout = useRef <LayoutRectangle> ();
  
  const onLayout = useCallback(({nativeEvent}: LayoutChangeEvent) => {
    layout.current = nativeEvent.layout;
  }, []);
  
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: props.backgroundColor,
        position: "absolute",
        [props.horizontal ? "width" : "height"]: 100,
        [props.horizontal ? "height" : "width"]: "100%"
      }
    });
  }, [
    props.backgroundColor,
    props.horizontal
  ]);
  
  usePageMethods(layout, props, ref);
  
  return (
    <Animated.View
      onLayout={onLayout}
      style={[styles.container, animatedStyle]}
    >
      
    </Animated.View>
  );
});

export { Page };

export interface PageProps <ItemT extends BaseItemType> {
  backgroundColor: string,
  data: PageDataHolder <ItemT>,
  horizontal?: boolean;
};

function usePageMethods <ItemT extends BaseItemType> (
  layout: MutableRefObject <LayoutRectangle>,
  props: PageProps <ItemT>,
  ref: ForwardedRef <any>
) {
  return useImperativeHandle(ref, () => ({
    getDimension() {
      return props.horizontal ? layout.current?.width : layout.current?.height;
    }
  }), [props.horizontal]);
}
