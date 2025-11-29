import { padLeft } from "./util/padLeft";

// TODO: find a better solution for placeholder/gray text
const LEVEL_OPACITY = [255, 153, 102, 76] as const;

const cache = new Map<string, Color>();
export class Color {
    public static white: Color = Color.rgba(255, 255, 255, 255);
    public static black: Color = Color.rgba(0, 0, 0, 255);
    public static transparent: Color = Color.rgba(0, 0, 0, 0);

    public readonly luminance!: number;
    public readonly fg!: Color;

    public readonly hex!: string;
    public readonly rgba: string;

    private constructor(public r: number, public g: number, public b: number, public a: number, fg?: Color) {
        this.rgba = `rgba(${r},${g},${b},${a})`;
        if (cache.has(this.rgba)) return cache.get(this.rgba)!;
        else cache.set(this.rgba, this);

        this.hex =
            "#" +
            padLeft(r.toString(16), 2, "0") +
            padLeft(g.toString(16), 2, "0") +
            padLeft(b.toString(16), 2, "0") +
            padLeft(a.toString(16), 2, "0");

        this.luminance = r * 0.299 + g * 0.587 + b * 0.114;

        this.fg = fg ?? 255 - this.luminance < 110 ? Color.rgb(0, 0, 0) : Color.rgb(255, 255, 255);
    }
    public static rgb(r: number, g: number, b: number, fg?: Color) {
        return new Color(r, g, b, 255, fg);
    }
    public static rgba(r: number, g: number, b: number, a: number, fg?: Color) {
        return new Color(r, g, b, a, fg);
    }
    public static hex(hex: string, fg?: Color) {
        return new Color(
            ...(<[number, number, number, number]>(hex + "FF")
                .match(/[a-z0-9]{2}/gi)!
                .slice(0, 4)
                .map((x) => parseInt(x, 16))),
            fg
        );
    }
    public static parse(str: string) {
        if (str.startsWith("rgb(")) {
            return Color.rgb(...(<[number, number, number]>str.match(/\d+/g)!.slice(0, 3).map(Number)));
        } else if (str.startsWith("#")) {
            return Color.hex(str);
        } else throw new Error("unrecognized rgb color format");
    }
    public map(f: (x: number) => number): Color {
        return new Color(f(this.r), f(this.g), f(this.b), f(this.a));
    }
    public set(r?: number | null, g?: number | null, b?: number | null, a?: number | null) {
        return new Color(r ?? this.r, g ?? this.g, b ?? this.b, a ?? this.a);
    }
    public level(level: 0 | 1 | 2 | 3): Color {
        return new Color(this.r, this.g, this.b, LEVEL_OPACITY[level]);
    }

    public [Symbol.toPrimitive]() {
        return this.rgba;
    }
    public toString(): string {
        return this.rgba;
    }
}
