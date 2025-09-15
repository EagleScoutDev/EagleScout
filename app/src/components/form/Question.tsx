import { Pressable, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

export interface QuestionProps {
    title: string
    required?: boolean
    onReset: () => void
}
export function Question({ title, required = false, onReset }: QuestionProps) {
    const { colors } = useTheme();

    return title
        ? <Pressable onLongPress={onReset} style={{ flexDirection: 'row' }}>
            <Text
                style={{
                    color: colors.text,
                    textAlign: 'left',
                    paddingBottom: 10,
                    fontWeight: 'bold',
                    fontSize: 16,
                }}>
                {title}
            </Text>
            <Text
                style={{
                    color: colors.notification,
                    textAlign: 'left',
                    paddingBottom: 10,
                    fontWeight: 'bold',
                    fontSize: 16,
                }}>
                {required ? '*' : ''}
            </Text>
        </Pressable>
        : null
}
