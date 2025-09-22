import { SummaryTemplate } from './question-summaries/SummaryTemplate.tsx';
import { SummaryText } from './question-summaries/SummaryText.tsx';

export function RadioBuilder({ question, onDelete }) {
    return (
        <SummaryTemplate onDelete={onDelete}>
            <SummaryText>Question Type: Radio</SummaryText>
            <SummaryText>Question: {question.question}</SummaryText>
            <SummaryText>Options:</SummaryText>
            {question.options.map((option, index) => (
                <SummaryText key={index} bold={question.defaultIndex === index}>
                    {'\u2022'} {option}
                </SummaryText>
            ))}
            <SummaryText>Required: {question.required ? 'Yes' : 'No'}</SummaryText>
        </SummaryTemplate>
    );
};
