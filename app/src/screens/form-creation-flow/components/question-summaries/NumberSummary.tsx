import SummaryTemplate from './SummaryTemplate';
import SummaryText from './SummaryText';
import {
    getActionForLink as reefscapeGetActionForLink,
    ReefscapeActions,
} from '../../../../components/games/reefscape/ReefscapeActions';
import {
    CrescendoActions,
    getActionForLink as crescendoGetActionForLink,
} from '../../../../components/games/crescendo/CrescendoActions';

const NumberSummary = ({ question, onDelete }) => {
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

export default NumberSummary;
