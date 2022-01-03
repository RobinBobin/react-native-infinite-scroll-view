import React from "react";
import Context from "./Context";
import { ContextType } from "./types/context";
import { BaseItemType } from "./types/data";
import { InfiniteScrollView as RealInfiniteScrollView } from "./ui/InfiniteScrollView";

export default function InfiniteScrollView <ItemT extends BaseItemType> (props: ContextType <ItemT> ) {
  return (
    <Context.Provider
      value={props}
    >
      <RealInfiniteScrollView />
    </Context.Provider>
  );
};
