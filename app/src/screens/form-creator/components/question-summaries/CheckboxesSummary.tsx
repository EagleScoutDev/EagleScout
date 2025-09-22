import { SummaryTemplate } from './SummaryTemplate';
import { SummaryText } from './SummaryText';

export function CheckboxesSummary({ question, onDelete }) {
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
