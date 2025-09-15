import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

export interface MinimalSectionHeaderProps {
    title: string
}
export function MinimalSectionHeader({ title }: MinimalSectionHeaderProps) {
    const { colors } = useTheme();

    return (
        <Text
            style={{
                color: colors.text, //getLighterColor(parseColor(colors.primary)),
                opacity: 0.6,
                fontWeight: 'bold',
                fontSize: 12,
                paddingLeft: '2%',
                paddingTop: '2%',
            }}>
            {title.toUpperCase()}
        </Text>
    );
}
