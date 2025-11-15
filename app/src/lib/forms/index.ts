import { Alert } from "react-native";

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
        checkbox = "checkboxes",
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
        defaultIndex: 0; // TODO: this value is completely unused and should be deleted
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
        low: number | null;
        high: number | null;
        step: number;
    }
    export interface Slider extends BaseQuestion {
        type: ItemType.number;
        slider: true;
        low: number;
        high: number;
        step: number;
        lowLabel: string | null; // TODO: add this to the database schema
        highLabel: string | null; // TODO: add this to the database schema
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
        let i = 0;
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
                    end: i + 1,
                };
            } else {
                if (section) {
                    section.items.push(item);
                    section.end++;
                }
            }
            i++;
        }
        if (section) out.push(section);

        return out;
    }
    export function initialize(sections: Section[]) {
        return sections.map((section) =>
            section.items.map((item) => {
                switch (item.type) {
                    case "heading":
                        return null;
                    case "radio":
                        return null;
                    case "checkboxes":
                        return [];
                    case "textbox":
                        return "";
                    case "number":
                        return Math.max(0, item.low ?? 0);
                }
            })
        );
    }
    export function checkRequired(sections: Section[], data: Form.Data[]): Question | null {
        for (let si = 0; si < sections.length; si++) {
            let section = sections[si];
            let sectionData = data[si];
            for (let i = 0; i < section.items.length; i++) {
                let item = section.items[i];
                let value = sectionData[i];

                if (item.type === ItemType.heading) continue;
                else if (!item.required) continue;
                else if (value === "" || value == null) return item;
            }
        }
        return null;
    }
}
