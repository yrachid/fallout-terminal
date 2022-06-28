export const range = <T>(limit: number, cb: (idx: number) => T) =>
  [...Array(limit).keys()].map(cb);

export type RangeBoundaries = {
  start?: number;
  end: number;
};

export const boundedRange = ({ start = 0, end }: RangeBoundaries): number[] => {
  const placeholder = [...Array(Math.abs(end - start)).keys()];
  return start < end
    ? placeholder.map((n) => n + start).concat([end])
    : placeholder.map((n) => -(n - start)).concat([end]);
};
