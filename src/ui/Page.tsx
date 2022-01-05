import React, {
  useCallback,
  useMemo
} from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View
} from "react-native";
import { PageDataHolder } from "../data/PageDataHolder";
import { ContextType } from "../types/context";
import { UsedPagePosition } from "../types/ui/page/Position";
import { useContext } from "../utils/ui";
import "../../wdyr";

const Page: React.FC <PageProps> = React.memo(({page}) => {
  const context = useContext();
  const containerStyle = useContainerStyle(context, page);
  const onLayout = useOnLayout(page);
  const items = useItems(context, page);
  
  if (page) {
    console.log(`Page '${page.position}', item count: ${page.data.length}`);
  }
  
  return (
    !page
    ?
      null
    :
      <View
        onLayout={onLayout}
        style={containerStyle}
      >
        { items }
      </View>
  );
});

Page.whyDidYouRender = {
  customName: "Page"
};

interface PageProps {
  page: PageDataHolder
}

export { Page };

const useContainerStyle = (context: ContextType <any>, page: PageDataHolder) => (
  useMemo(() => StyleSheet.create({
    container: {
      backgroundColor:
        page?.position === UsedPagePosition.previous ? "pink"
        : page?.position === UsedPagePosition.medium ? "lightgreen"
        : page?.position === UsedPagePosition.next ? "lightblue"
        : "black",
      // @ts-ignore
      flexDirection: context.style.flexDirection
    }
  }).container, [context.style, page])
);

const useItems = (context: ContextType <any>, page: PageDataHolder) => (
  useMemo(() => page?.data.map((item, index) => (
    <View
      key={index}
    >
      {
        context.renderItem({
          item: item.item
        })
      }
    </View>
  )), [context, page])
);

const useOnLayout = (page: PageDataHolder) => (
  useCallback(({nativeEvent}: LayoutChangeEvent) => {
    if (page) {
      page.layout = nativeEvent.layout;
      
      console.log(`Page '${page.position}', layout: ${JSON.stringify(page.layout)}`);
    }
  }, [page])
);
