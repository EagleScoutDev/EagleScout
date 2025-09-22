import { SummaryTemplate } from './question-summaries/SummaryTemplate.tsx';
import { SummaryText } from './question-summaries/SummaryText.tsx';
import {
    getActionForLink as reefscapeGetActionForLink,
    ReefscapeActions,
} from '../../../components/games/reefscape/ReefscapeActions.tsx';
import {
    CrescendoActions,
    getActionForLink as crescendoGetActionForLink,
} from '../../../components/games/crescendo/CrescendoActions.tsx';

export function SliderBuilder({ question, onDelete }) {
    return (
        <SummaryTemplate onDelete={onDelete}>
            <SummaryText>Question Type: Number</SummaryText>
            <SummaryText>Question: {question.question}</SummaryText>
            <SummaryText>Slider: {question.slider ? 'Yes' : 'No'}</SummaryText>
            {question.low != null && (
                <SummaryText>Low: {question.low.toString()}</SummaryText>
            )}
            {question.high != null && (
                <SummaryText>High: {question.high.toString()}</SummaryText>
            )}
            <SummaryText>Step: {question.step.toString()}</SummaryText>
            <SummaryText>
                Link to:{' '}
                {question.link_to
                    ? (CrescendoActions[crescendoGetActionForLink(question.link_to)] &&
                        CrescendoActions[crescendoGetActionForLink(question.link_to)]
                            .name) ||
                    (ReefscapeActions[reefscapeGetActionForLink(question.link_to)] &&
                        ReefscapeActions[reefscapeGetActionForLink(question.link_to)]
                            .name)
                    : 'None'}
            </SummaryText>
        </SummaryTemplate>
    );
};
