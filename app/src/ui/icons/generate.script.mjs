import * as fs from "node:fs";
import * as path from "node:path";

console.log("Generating icons...");

const NUMBERS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

const __dirname = import.meta.dirname;
const iconsLoc = path.resolve(__dirname, "../../../node_modules/bootstrap-icons/icons");

fs.writeFileSync(
    path.resolve(__dirname, "icons.generated.tsx"),
    `import _svg, { Circle as _circle, Path as _path, Rect as _rect, type SvgProps } from "react-native-svg";
import type { JSX } from "react";
export type Icon = (props: IconProps) => JSX.Element;
export interface IconProps extends SvgProps {
    size?: string | number | undefined;
}

${fs
    .readdirSync(iconsLoc)
    .map((f) => {
        const name = NUMBERS.reduce(
            (a, rep, i) => a.replaceAll(i.toString(), rep),
            path
                .basename(f)
                .split(".")[0]
                .split("-")
                .map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase())
                .join(""),
        );

        return `export const ${name}=(props:IconProps)=>${fs
            .readFileSync(path.join(iconsLoc, f))
            .toString()
            .replaceAll("\n", "")
            .replaceAll(/<(\/?)/g, "<$1_")
            .replaceAll(/ (xmlns|class)=".*?"/g, "")
            .replaceAll(/ (width|height)=".*?"/g, " $1={props.size??16}")
            .replaceAll(/>\s*</g, "><")
            .replaceAll(' fill="currentColor"', "")
            .replaceAll('viewBox="0 0 16 16"', 'viewBox="0 0 16 16" {...props}')};`;
    })
    .join("\n")}`,
);
