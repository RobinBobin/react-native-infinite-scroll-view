import React, {
  useCallback,
  useMemo,
  useState
} from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View
} from "react-native";
import { PageDataHolder } from "../data/PageDataHolder";
import { ContextType } from "../types/context";
import { UsedPagePosition } from "../types/ui/page/Position";
import {
  isVertical,
  useContext
} from "../utils/ui";
import "../../wdyr";

let Page: React.FC <PageProps> = ({page}) => {
  const context = useContext();
  const [top, setTop] = useState <number> (0);
  const containerStyle = useContainerStyle(context, page, top);
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
      <View
        onLayout={onLayout}
        style={containerStyle}
      >
        { items }
      </View>
  );
};

Page.whyDidYouRender = {
  customName: "Page"
};

Page = React.memo(Page);

interface PageProps {
  page: PageDataHolder
}

export { Page };

const useContainerStyle = (
  context: ContextType <any>,
  page: PageDataHolder,
  top: number
) => (
  useMemo(() => {
    console.log(`Page '${page?.position ?? "<no position>"}' useContainerStyle()`);
    
    if (page) {
      // @ts-ignore
      const flexDirection = context.style.flexDirection;
      
      return StyleSheet.create({
        container: {
          backgroundColor:
            page.position === UsedPagePosition.previous ? "pink"
            : page.position === UsedPagePosition.medium ? "lightgreen"
            : page.position === UsedPagePosition.next ? "lightblue"
            : "black",
          flexDirection,
          position: "absolute",
          top,
          [isVertical(flexDirection) ? "width" : "height"]: "100%"
        }
      }).container;
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
  }, [context, page])
);
