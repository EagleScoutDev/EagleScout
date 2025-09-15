import React, {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { CloudUpload, X } from '../../../components/icons/icons.generated';

export const NoteFAB = ({
    onSubmitPress,
    isLoading,
    contentPresent,
}: {
    onSubmitPress: () => void;
    isLoading: boolean;
    // do any of the notes have content?
    contentPresent: boolean;
}) => {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        fab: {
            // position: 'absolute',
            // bottom: insets.bottom + 20,
            right: 20,
            alignSelf: 'flex-end',
        },
        fabButton: {
            backgroundColor: contentPresent ? colors.primary : colors.notification,
            padding: 20,
            borderRadius: 99,
            elevation: 2,
        },
        fabButtonLoading: {
            backgroundColor: 'gray',
            padding: 20,
            borderRadius: 99,
            elevation: 2,
        },
    });
    return (
        <View style={styles.fab}>
            <TouchableOpacity
                style={isLoading ? styles.fabButtonLoading : styles.fabButton}
                onPress={onSubmitPress}
                disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <>
                        {contentPresent ? (
                            <CloudUpload size="24" fill="white" />
                        ) : (
                            <X size="24" fill="white" />
                        )}
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};
