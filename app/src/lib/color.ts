import { padLeft } from "./util/padLeft.ts";

export type RGB = [r: number, g: number, b: number];

const colorMemo = new Map<string, Color>()
export class Color {
    public static white: Color = new Color(255, 255, 255, 255);
    public static black: Color = new Color(0, 0, 0, 1);
    public static transparent: Color = new Color(0, 0, 0, 0);

    public luminance!: number;
    public fg!: Color;

    public hex!: string;
    public rgba: string;

    public constructor(public r: number, public g: number, public b: number, public a: number) {
        this.rgba = `rgba(${r},${g},${b},${a})`
        if(colorMemo.has(this.rgba)) return colorMemo.get(this.rgba)!
        else colorMemo.set(this.rgba, this)

        this.hex =
            "#" +
            padLeft(r.toString(16), 2, "0") +
            padLeft(g.toString(16), 2, "0") +
            padLeft(b.toString(16), 2, "0") +
            padLeft(a.toString(16), 2, "0");

        this.luminance = r * 0.299 + g * 0.587 + b * 0.114;

        this.fg = 255 - this.luminance < 110 ? Color.black : Color.white;
    }
    public static parse(str: string) {
        return RGB(...parseColor(str))
    }
    public map(f: (x: number) => number): Color {
        return new Color(f(this.r), f(this.g), f(this.b), f(this.a))
    }
    public set(r?: number | null, g?: number | null, b?: number | null, a?: number | null) {
        return new Color(r ?? this.r, g ?? this.g, b ?? this.b, a ?? this.a)
    }

    public [Symbol.toPrimitive]() { return this.rgba }
    public toString(): string { return this.rgba }
}
export const RGB = (r: number, g: number, b: number) => new Color(r, g, b, 255)

export function parseColor(raw: string): RGB {
    if (raw.startsWith("rgb(")) {
        return raw.match(/\d+/g)!.slice(0, 3).map(Number) as RGB;
    } else if (raw.startsWith("#")) {
        return raw
            .match(/[a-z0-9]{2}/gi)!
            .slice(0, 3)
            .map((x) => parseInt(x, 16)) as RGB;
    } else throw new Error("unrecognized rgb color format");
}
export function stringifyRGB(color: RGB): string {
    return `rgb(${color
        .slice(0, 3)
        .map((x) => x.toString())
        .join(", ")})`;
}

export function getLuminance([r, g, b]: RGB) {
    return r * 0.299 + g * 0.587 + b * 0.114;
}

export const getIdealTextColor = (bg: RGB, thresh = 110) => {
    return 255 - getLuminance(bg) < thresh ? "#000000" : "#ffffff";
};

export const getLighterColor = (color: RGB) => {
    return stringifyRGB(color.map((x) => x + 50) as RGB);
};
