import AsyncStorage from '@react-native-async-storage/async-storage';

class FormHelper {
  static DEBUG = false;
  static LATEST_FORM = '2023form';
  static COMPETITION = '2023competition';
  static SCOUTING_STYLE = 'scoutingStyle';
  static THEME = 'themePreference';

  /**
   * Reads form data from AsyncStorage
   * @returns {Promise<null|string>}
   */
  static async readAsyncStorage(itemKey) {
    try {
      const value = await AsyncStorage.getItem(itemKey);
      if (value !== null) {
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

  static async saveFormOffline(dataToSubmit, competition) {
    dataToSubmit.timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: Date.now(),
    };
    dataToSubmit.competition = competition;

    await AsyncStorage.setItem(
      'form-' + dataToSubmit.timestamp.seconds,
      JSON.stringify(dataToSubmit),
    );
  }
}

export default FormHelper;
