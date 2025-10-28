import type { Form } from "../../../lib/forms";
import { ReportFlowTab } from "./ReportFlowTab.tsx";
import { FormView } from "../../../forms/FormView.tsx";
import type { JSX } from "react";

export interface ReportFlowFormProps {
    section: Form.Section;
    data: Form.Data;
    setData: (data: Form.Data) => void;
    nextButton: JSX.Element;
}
export function ReportFlowFormSection({ section: { title, description, items }, data, setData, nextButton }: ReportFlowFormProps) {
    return (
        <ReportFlowTab title={title}>
            <FormView items={items} data={data} onInput={setData} />
            {nextButton}
        </ReportFlowTab>
    );
}
