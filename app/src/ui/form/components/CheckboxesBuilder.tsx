import { SummaryTemplate } from './question-summaries/SummaryTemplate.tsx';
import { SummaryText } from './question-summaries/SummaryText.tsx';

export function CheckboxesBuilder({ question, onDelete }) {
    return (
        <SummaryTemplate onDelete={onDelete}>
            <SummaryText>Question Type: Checkboxes</SummaryText>
            <SummaryText>Question: {question.question}</SummaryText>
            <SummaryText>Options:</SummaryText>
            {question.options.map((option, index) => (
                <SummaryText key={index}>
                    {'\u2022'} {option}
                </SummaryText>
            ))}
        </SummaryTemplate>
    );
};
