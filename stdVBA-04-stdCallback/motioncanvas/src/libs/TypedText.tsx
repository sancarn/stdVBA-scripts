import { initial, signal, Txt, TxtProps } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  SignalValue,
  SimpleSignal,
  tween,
} from "@motion-canvas/core";

export interface TypedTextProps extends TxtProps {}

export class TypedText extends Txt {
  private currentText = createSignal("");

  public constructor(props?: TypedTextProps) {
    super({
      ...props,
      text: "",
    });
  }

  public *typeText(fullText: string, duration: number): any {
    const length = fullText.length;

    for (let i = 0; i < length; i++) {
      this.currentText(fullText.slice(0, i + 1));
      yield* tween(duration / length, () => {
        this.text(this.currentText());
      });
    }
  }
  public *addText(newText: string, duration: number) {
    const length = newText.length;
    const oldText = this.currentText();

    for (let i = 0; i < length; i++) {
      this.currentText(oldText + newText.slice(0, i + 1));
      yield* tween(duration / length, () => {
        this.text(this.currentText());
      });
    }
  }
}
