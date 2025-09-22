import { ScrollView, StyleSheet, Text } from 'react-native';
import { HeadingBuilder } from '../../../ui/form/components/HeadingBuilder.tsx';
import { RadioBuilder } from '../../../ui/form/components/RadioBuilder.tsx';
import { SliderBuilder } from '../../../ui/form/components/SliderBuilder.tsx';
import { TextboxBuilder } from '../../../ui/form/components/TextboxBuilder.tsx';
import { CheckboxesBuilder } from '../../../ui/form/components/CheckboxesBuilder.tsx';

export function FormViewer({ route }) {
    const { questions } = route.params;

    const styles = StyleSheet.create({
        mainText: {
            fontSize: 20,
            paddingTop: 10,
            paddingLeft: 20,
            paddingBottom: 5,
        },
    });

    return <>
        <Text style={styles.mainText}>Questions:</Text>
        <ScrollView>
            {questions.map(question => {
                return (
                    <>
                        {question.type === 'heading' && (
                            <HeadingBuilder question={question} />
                        )}
                        {question.type === 'radio' && (
                            <RadioBuilder question={question} />
                        )}
                        {question.type === 'number' && (
                            <SliderBuilder question={question} />
                        )}
                        {question.type === 'textbox' && (
                            <TextboxBuilder question={question} />
                        )}
                        {question.type === 'checkboxes' && (
                            <CheckboxesBuilder question={question} />
                        )}
                    </>
                );
            })}
        </ScrollView>
    </>
};
