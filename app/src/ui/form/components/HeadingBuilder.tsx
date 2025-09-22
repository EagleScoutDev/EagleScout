import { SummaryTemplate } from './question-summaries/SummaryTemplate.tsx';
import { SummaryText } from './question-summaries/SummaryText.tsx';

export function HeadingBuilder({ question, onDelete }) {
    return (
        <SummaryTemplate onDelete={onDelete}>
            <SummaryText>Question Type: Heading</SummaryText>
            <SummaryText>Title: {question.title}</SummaryText>
            <SummaryText>Description: {question.description}</SummaryText>
        </SummaryTemplate>
    );
};
