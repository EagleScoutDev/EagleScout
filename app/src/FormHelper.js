import AsyncStorage from '@react-native-async-storage/async-storage';

class FormHelper {
  static DEBUG = false;
  static LATEST_FORM = 'current-form';
  static ASYNCSTORAGE_COMPETITION_KEY = 'current-competition';
  static SCOUTING_STYLE = 'scoutingStyle';
  static THEME = 'themePreference';

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
    dataToSubmit.createdAt = new Date();

    await AsyncStorage.setItem(
      'pit-form-' + dataToSubmit.createdAt.getUTCMilliseconds(),
      JSON.stringify(dataToSubmit),
    );
    for (let i = 0; i < images.length; i++) {
      await AsyncStorage.setItem(
        'pit-form-image-' + dataToSubmit.createdAt.getUTCMilliseconds() + i,
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
}

export default FormHelper;
