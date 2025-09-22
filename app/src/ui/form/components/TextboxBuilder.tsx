import { SummaryTemplate } from './question-summaries/SummaryTemplate.tsx';
import { SummaryText } from './question-summaries/SummaryText.tsx';

export function TextboxBuilder({ question, onDelete }) {
    return (
        <SummaryTemplate onDelete={onDelete}>
            <SummaryText>Question Type: Text Box</SummaryText>
            <SummaryText>Question: {question.question}</SummaryText>
            <SummaryText>Required: {question.required ? 'Yes' : 'No'}</SummaryText>
        </SummaryTemplate>
    );
};
