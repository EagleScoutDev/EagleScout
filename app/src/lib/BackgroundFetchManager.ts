import AsyncStorage from '@react-native-async-storage/async-storage';
import PitScoutReports from '../database/ScoutPitReports';
import BackgroundFetch from 'react-native-background-fetch';

export class BackgroundFetchManager {
    static syncActive = false;

    /**
     * sync offline pit scouting reports
     */
    static async syncReports(taskId?: string) {
        const allOffline = await AsyncStorage.getAllKeys();
        const offReports = allOffline.filter(
            key => key.startsWith('pit-form-') && !key.startsWith('pit-form-image-'),
        );
        const formsFound = [];
        for (const report of offReports) {
            const data = JSON.parse((await AsyncStorage.getItem(report))!);
            const images = [];
            const imageKeys = allOffline.filter(key =>
                key.startsWith(
                    `pit-form-image-${new Date(data.createdAt).getUTCMilliseconds()}`,
                ),
            );
            for (const imageKey of imageKeys) {
                images.push((await AsyncStorage.getItem(imageKey))!);
            }
            formsFound.push({ data, images });
        }
        for (const form of formsFound) {
            await PitScoutReports.createOfflinePitScoutReport(form.data, form.images);
        }
        if (taskId) {
            await BackgroundFetch.stop(taskId);
            BackgroundFetchManager.syncActive = false;
        }
    }

    static async startBackgroundFetch() {
        if (BackgroundFetchManager.syncActive) {
            return;
        }
        const status = await BackgroundFetch.configure(
            {
                minimumFetchInterval: 15,
            },
            async taskId => {
                console.log('[BackgroundFetch] start');
                await BackgroundFetchManager.syncReports(taskId);
                console.log('[BackgroundFetch] finish');
            },
            error => {
                console.log('[BackgroundFetch] timed out');
            },
        );
        BackgroundFetchManager.syncActive =
            status === BackgroundFetch.STATUS_AVAILABLE;
        console.log('[BackgroundFetch] status: ', status);
    }
}
