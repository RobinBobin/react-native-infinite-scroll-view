export enum UnusedPagePosition {
  unused = "unused"
};

export enum UsedPagePosition {
  previous = "previous",
  medium = "medium",
  next = "next"
};

export type PagePosition = UnusedPagePosition | UsedPagePosition;
