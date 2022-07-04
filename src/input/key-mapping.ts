export const enum KeyCode {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  ENTER = "ENTER",
  LINE_START = "LINE_START",
  LINE_END = "LINE_END",
  BOTTOM = "BOTTOM",
}

export const KeyMap: Record<string, KeyCode> = {
  "0": KeyCode.LINE_START,
  $: KeyCode.LINE_END,
  ArrowDown: KeyCode.DOWN,
  ArrowLeft: KeyCode.LEFT,
  ArrowRight: KeyCode.RIGHT,
  ArrowUp: KeyCode.UP,
  Enter: KeyCode.ENTER,
  G: KeyCode.BOTTOM,
  b: KeyCode.LEFT,
  h: KeyCode.LEFT,
  j: KeyCode.DOWN,
  k: KeyCode.UP,
  l: KeyCode.RIGHT,
  w: KeyCode.RIGHT,
};
