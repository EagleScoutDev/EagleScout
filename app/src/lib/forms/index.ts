export interface Form {
    formStructure: Form.Structure;
    pitScouting: boolean;
    name: string;
}
export namespace Form {
    export type Structure = Item[];
    export type Data = any[];

    export enum ItemType {
        heading = "heading",
        radio = "radio",
        checkbox = "checkbox",
        textbox = "textbox",
        number = "number",
    }

    interface BaseItem {
        type: ItemType;
    }
    export type Item = Heading | Question;

    export interface Heading extends BaseItem {
        type: ItemType.heading;
        title: string;
        description: string;
    }

    interface BaseQuestion extends BaseItem {
        question: string;
        required: boolean;
    }
    export type Question = Radio | Checkboxes | Textbox | Number | Slider;

    export interface Radio extends BaseQuestion {
        type: ItemType.radio;
        options: string[];
    }
    export interface Checkboxes extends BaseQuestion {
        type: ItemType.checkbox;
        options: string[];
    }
    export interface Textbox extends BaseQuestion {
        type: ItemType.textbox;
    }
    export interface Number extends BaseQuestion {
        type: ItemType.number;
        slider: false;
    }
    export interface Slider extends BaseQuestion {
        type: ItemType.number;
        slider: true;
        low: number;
        high: number;
        step: number;
        lowLabel: string | null;
        highLabel: string | null;
    }

    export interface Section {
        title: string;
        description: string;
        items: Item[];

        // TODO: these fields only exist because form question responses
        //       are keyed by incrementing indices; using random ids would
        //       be much better
        /**
         * Index of the first item, **(includes the heading)**
         */
        start: number;
        /**
         * **Exclusive** index of the last item
         */
        end: number;
    }
    export function splitSections(structure: Structure): Section[] {
        const out: Section[] = [];

        let section: Section | null = null;
        let i = 0
        for (let item of structure) {
            if (item.type === ItemType.heading) {
                if (section) {
                    out.push(section);
                }
                section = {
                    title: item.title,
                    description: item.description,
                    items: [],
                    start: i,
                    end: i+1
                };
            } else {
                if (section) {
                    section.items.push(item);
                    section.end++;
                }
            }
            i++
        }
        if (section) out.push(section);

        return out;
    }
}
