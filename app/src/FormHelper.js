import AsyncStorage from '@react-native-async-storage/async-storage';
import {BackgroundFetchManager} from './lib/BackgroundFetchManager';

class FormHelper {
  static DEBUG = false;
  static LATEST_FORM = 'current-form';
  static ASYNCSTORAGE_COMPETITION_KEY = 'current-competition';
  static ASYNCSTORAGE_MATCHES_KEY = 'current-matches';
  static SCOUTING_STYLE = 'scoutingStyle';
  static THEME = 'themePreference';
  static OLED = 'oled';

  static EXCLUDE_DELETE_KEYS = [
    FormHelper.LATEST_FORM,
    FormHelper.SCOUTING_STYLE,
    FormHelper.THEME,
    FormHelper.OLED,
  ];

  /**
   * Reads form data from AsyncStorage
   * @returns {Promise<null|string>}
   */
  static async readAsyncStorage(itemKey) {
    try {
      const value = await AsyncStorage.getItem(itemKey);
      if (value != null) {
        // value previously stored
        if (FormHelper.DEBUG) {
          console.log('[readStoredForm] data: ' + value);
        }
        return value;
      }
    } catch (e) {
      // error reading value
      if (FormHelper.DEBUG) {
        console.log('[readStoredForm] error: ' + e);
      }
      return null;
    }
  }

  /**
   * Saves a form offline
   */

  static async saveFormOffline(dataToSubmit) {
    dataToSubmit.createdAt = new Date();

    await AsyncStorage.setItem(
      'form-' + dataToSubmit.createdAt.getUTCMilliseconds(),
      JSON.stringify(dataToSubmit),
    );
  }

  /**
   * Saves a pit scouting form offline
   * @param dataToSubmit
   * @param images - array of image base64 strings
   */
  static async savePitFormOffline(dataToSubmit, images) {
    await BackgroundFetchManager.startBackgroundFetch();
    dataToSubmit.createdAt = new Date();

    await AsyncStorage.setItem(
      'pit-form-' + dataToSubmit.createdAt.getUTCMilliseconds(),
      JSON.stringify(dataToSubmit),
    );
    for (let i = 0; i < images.length; i++) {
      await AsyncStorage.setItem(
        `pit-form-image-${dataToSubmit.createdAt.getUTCMilliseconds()}-${i}`,
        images[i],
      );
    }
  }

  /**
   * Edits an offline form
   */
  static async editFormOffline(data, createdAt) {
    const utcMilliseconds = new Date(createdAt).getUTCMilliseconds();
    const originalReport = JSON.parse(
      await AsyncStorage.getItem('form-' + utcMilliseconds),
    );
    await AsyncStorage.setItem(
      'form-' + utcMilliseconds,
      JSON.stringify({
        ...originalReport,
        data: data,
      }),
    );
  }

  static async saveNoteOffline(note) {
    note.created_at = new Date();
    await AsyncStorage.setItem(
      'note-' + note.created_at.getUTCMilliseconds() + '-' + note.team_number,
      JSON.stringify(note),
    );
  }

  static async getOfflineNotes() {
    const keys = await AsyncStorage.getAllKeys();
    const notes = await AsyncStorage.multiGet(keys);
    return notes
      .filter(note => note[0].includes('note-'))
      .map(note => JSON.parse(note[1]));
  }

  static async deleteOfflineNote(createdAt, teamNumber) {
    createdAt = new Date(createdAt);
    await AsyncStorage.removeItem(
      `note-${createdAt.getUTCMilliseconds()}-${teamNumber}`,
    );
  }
}

export default FormHelper;
