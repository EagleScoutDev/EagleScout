export interface Form {
    formStructure: Form.Structure;
    pitScouting: boolean;
    name: string;
}

export namespace Form {
    export type Structure = Item[];

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
    export type Item = Heading | Question

    export interface Heading extends BaseItem {
        type: ItemType.heading;
        title: string;
        description: string;
    }

    interface BaseQuestion extends BaseItem {
        question: string;
        required: boolean;
    }
    export type Question = Radio | Checkboxes | Textbox | Number | Slider

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
}
