export const enum KeyCode {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  ENTER = "ENTER",
}

export const KeyMap: Record<string, KeyCode> = {
  j: KeyCode.DOWN,
  ArrowDown: KeyCode.DOWN,
  ArrowUp: KeyCode.UP,
  k: KeyCode.UP,
  ArrowLeft: KeyCode.LEFT,
  h: KeyCode.LEFT,
  ArrowRight: KeyCode.RIGHT,
  l: KeyCode.RIGHT,
  Enter: KeyCode.ENTER,
};