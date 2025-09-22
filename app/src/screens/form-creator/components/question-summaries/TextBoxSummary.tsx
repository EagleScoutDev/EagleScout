import { SummaryTemplate } from './SummaryTemplate';
import { SummaryText } from './SummaryText';

export function TextBoxSummary({ question, onDelete }) {
    return (
        <SummaryTemplate onDelete={onDelete}>
            <SummaryText>Question Type: Text Box</SummaryText>
            <SummaryText>Question: {question.question}</SummaryText>
            <SummaryText>Required: {question.required ? 'Yes' : 'No'}</SummaryText>
        </SummaryTemplate>
    );
};
