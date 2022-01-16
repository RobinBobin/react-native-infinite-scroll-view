import { observer } from "mobx-react-lite";
import React, {
  useCallback,
  useMemo
} from "react";
import {
  ImageStyle,
  LayoutChangeEvent,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import Animated, {
  AnimatedStyleProp
} from "react-native-reanimated";
import { PageDataHolder } from "../data/PageDataHolder";
import { ContextType } from "../types/context";
import { PagePosition } from "../types/ui/page/Position";
import { strictDeepEqual } from "../utils";
import {
  getFlexDirection,
  isVertical,
  useContext
} from "../utils/ui";
import "../../wdyr";

let Page: React.FC <PageProps> = ({page, pageAnimatedStyle}) => {
  const context = useContext();
  const containerStyle = useContainerStyle(context, page, pageAnimatedStyle);
  const items = useItems(context, page);
  const onLayout = useOnLayout(context, page);
  
  if (context.debugLogsEnabled) {
    if (page) {
      console.log(`render page '${page.position}', item count: ${page.data.length}`);
    } else {
      console.log("render page '<no position>'");
    }
  }
  
  return (
    !page
    ?
      null
    :
      <Animated.View
        onLayout={onLayout}
        style={containerStyle}
      >
        { items }
      </Animated.View>
  );
};

Page.whyDidYouRender = {
  customName: "Page"
};

Page = React.memo(observer(Page), strictDeepEqual);

export { Page };

type PageAnimatedStyle = AnimatedStyleProp <ViewStyle | ImageStyle | TextStyle>;

interface PageProps {
  page: PageDataHolder;
  pageAnimatedStyle: PageAnimatedStyle;
}

const useContainerStyle = (
  context: ContextType <any>,
  page: PageDataHolder,
  pageAnimatedStyle: PageAnimatedStyle
) => (
  useMemo(() => {
    context.debugLogsEnabled && console.log(`Page '${page?.position ?? "<no position>"}' useContainerStyle()`);
    
    if (page) {
      const vertical = isVertical(context.style);
      
      return [
        StyleSheet.create({
          container: {
            backgroundColor:
              page.position === PagePosition.previous ? "pink"
              : page.position === PagePosition.middle ? "lightgreen"
              : page.position === PagePosition.next ? "lightblue"
              : "black",
            flexDirection: getFlexDirection(context.style),
            position: "absolute",
            zIndex: +(page.position === PagePosition.middle),
            [vertical ? "top": "start"]: page.layout?.origin,
            [vertical ? "width" : "height"]: "100%"
          }
        }).container,
        pageAnimatedStyle
      ];
    }
  }, [
    context.debugLogsEnabled,
    context.style,
    page,
    page?.layoutChanged
  ])
);

const useItems = (context: ContextType <any>, page: PageDataHolder) => (
  useMemo(() => {
    context.debugLogsEnabled && console.log(`Page '${page?.position ?? "<no position>"}' useItems()`);
    
    return page?.data.map((item, index) => (
      <View
        key={index}
      >
        {
          context.renderItem({
            item: item.item
          })
        }
      </View>
    ));
  }, [
    context.debugLogsEnabled,
    context.renderItem,
    page
  ])
);

const useOnLayout = (
  context: ContextType <any>,
  page: PageDataHolder
) => (
  useCallback(({nativeEvent}: LayoutChangeEvent) => {
    context.debugLogsEnabled && console.log(`Page '${page.position}' onLayout()`);
    
    context.dataHolder.setPageLayout(
      context.debugLogsEnabled,
      nativeEvent.layout,
      page,
      isVertical(context.style)
    );
  }, [
    context.dataHolder,
    context.debugLogsEnabled,
    context.style,
    page
  ])
);
