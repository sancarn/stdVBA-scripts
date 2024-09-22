import { initial, signal, Rect, Txt, TxtProps, RectProps, colorSignal } from "@motion-canvas/2d";
import {
  createSignal,
  SignalValue,
  SimpleSignal,
  tween,
  PossibleColor,
  easeInOutCubic,
  Vector2,
  all,
  easeOutCubic,
} from "@motion-canvas/core";

export interface CalloutProps extends RectProps {
  finalScale: SignalValue<number>;
}

export class Callout extends Rect {
  @initial(1.1)
  @signal()
  public declare readonly finalScale: SimpleSignal<number, this>;

  private scaleSignal: SimpleSignal<number>;

  public constructor(props?: CalloutProps) {
    super({
      ...props,
    });

    //Initial values
    this.scaleSignal = createSignal<number>(1.0);

    this.opacity(0);
    this.scale(() => {
      const scale = this.scaleSignal();
      return new Vector2(scale, scale);
    });
    this.lineWidth(6);
  }

  public *callout(duration: number) {
    yield* all(
      tween(duration, (value) => {
        this.scaleSignal(easeOutCubic(value, 1, this.finalScale()));
      }),
      tween(duration, (value) => {
        this.opacity(easeOutCubic(value, 1, 0));
      })
    );
  }
}
