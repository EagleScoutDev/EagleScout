#!/bin/bash

cd "$(dirname "$0")"

icons_loc=$(realpath ../../../node_modules/bootstrap-icons/icons)

cat > ./icons.generated.tsx <<EOF
import _svg, { Path as _path, Rect as _rect, Circle as _circle, SvgProps } from "react-native-svg";
export interface IconProps extends SvgProps {
    size?: string | number | undefined
}

EOF

for f in $icons_loc/*; do
    name=$(basename "$f")
    name=${name%.svg}
    name=$(echo $name \
        | tr '-' ' ' \
        | perl -pe 's/\b(\w)/\u\1/g' \
        | sed -e 's/0/Zero/g' -e 's/1/One/g' -e 's/2/Two/g' -e 's/3/Three/g' -e 's/4/Four/g' -e 's/5/Five/g' -e 's/6/Six/g' -e 's/7/Seven/g' -e 's/8/Eight/g' -e 's/9/Nine/g'\
        | tr -d ' ')
    
    echo "export const $name = (props: IconProps) => "$(
        tr -d '\n' <$f \
        | perl -pe 's/(<\/?)/\1_/g' \
        | perl -pe 's/ (xmlns|class)=".*?"//g;' \
        | perl -pe 's/ (width|height)=".*?"/ \1={props.size ?? "16"}/g;' \
        | perl -pe 's/viewBox="0 0 16 16"/viewBox="0 0 16 16" {...props}/' \
        | perl -pe 's/>\s*</></g'
    )
done >> ./icons.generated.tsx
