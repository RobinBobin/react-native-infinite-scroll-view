import React, {
  useCallback,
  useMemo,
  useState
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
import { UsedPagePosition } from "../types/ui/page/Position";
import {
  getFlexDirection,
  isVertical,
  useContext
} from "../utils/ui";
import "../../wdyr";

let Page: React.FC <PageProps> = ({page, pageAnimatedStyle}) => {
  const context = useContext();
  const [top, setTop] = useState <number> (0);
  const containerStyle = useContainerStyle(context, page, pageAnimatedStyle, top);
  const items = useItems(context, page);
  const onLayout = useOnLayout(context, page, setTop);
  
  if (page) {
    console.log(`render page '${page.position}', item count: ${page.data.length}`);
  } else {
    console.log("render page '<no position>'");
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

Page = React.memo(Page);

type PageAnimatedStyle = AnimatedStyleProp <ViewStyle | ImageStyle | TextStyle>;

interface PageProps {
  page: PageDataHolder;
  pageAnimatedStyle: PageAnimatedStyle;
}

export { Page };

const useContainerStyle = (
  context: ContextType <any>,
  page: PageDataHolder,
  pageAnimatedStyle: PageAnimatedStyle,
  top: number
) => (
  useMemo(() => {
    console.log(`Page '${page?.position ?? "<no position>"}' useContainerStyle()`);
    
    if (page) {
      return [
        StyleSheet.create({
          container: {
            backgroundColor:
              page.position === UsedPagePosition.previous ? "pink"
              : page.position === UsedPagePosition.medium ? "lightgreen"
              : page.position === UsedPagePosition.next ? "lightblue"
              : "black",
            flexDirection: getFlexDirection(context.style),
            position: "absolute",
            top,
            [isVertical(context.style) ? "width" : "height"]: "100%"
          }
        }).container,
        pageAnimatedStyle
      ];
    }
  }, [context.style, page, top])
);

const useItems = (context: ContextType <any>, page: PageDataHolder) => (
  useMemo(() => {
    console.log(`Page '${page?.position ?? "<no position>"}' useItems()`);
    
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
  }, [context.renderItem, page])
);

const useOnLayout = (
  context: ContextType <any>,
  page: PageDataHolder,
  setTop: React.Dispatch <number>
) => (
  useCallback(({nativeEvent}: LayoutChangeEvent) => {
    context.dataHolder.setLayout(nativeEvent.layout, page);
    
    setTop(page.layout.y);
    
    console.log(`Page '${page.position}', layout: ${JSON.stringify(nativeEvent.layout)}, page layout: ${JSON.stringify(page.layout)}`);
  }, [context.dataHolder, page])
);
