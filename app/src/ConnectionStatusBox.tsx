import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MinimalSectionHeader from './components/MinimalSectionHeader';
import {Path, Svg} from 'react-native-svg';
import {useTheme} from '@react-navigation/native';
import InternetStatus from './lib/InternetStatus';
import {SUPABASE_URL} from '@env';

const useUrlStatus = (url: string) => {
  const [status, setStatus] = useState(InternetStatus.NOT_ATTEMPTED);
  const [previousController, setPreviousController] =
    useState<AbortController | null>(null);
  const [previousTimeout, setPreviousTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const fetchStatus = async () => {
    setStatus(InternetStatus.ATTEMPTING_TO_CONNECT);
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000);
    setPreviousController(controller);
    setPreviousTimeout(timeout);
    fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    })
      .then(() => {
        setStatus(InternetStatus.CONNECTED);
      })
      .catch(_err => {
        setStatus(InternetStatus.FAILED);
      });
  };
  const cleanup = () => {
    if (previousController) {
      previousController.abort();
    }
    if (previousTimeout) {
      clearTimeout(previousTimeout);
    }
    setPreviousController(null);
    setPreviousTimeout(null);
  };
  useEffect(() => {
    cleanup();
    fetchStatus();
    return cleanup;
  }, [url]);
  return {
    status,
    retry: () => {
      cleanup();
      fetchStatus();
    },
  };
};

const ConnectionStatusBox = () => {
  const {colors} = useTheme();

  const {status: tbaConnection, retry: retryTba} = useUrlStatus(
    'https://www.thebluealliance.com/api/v3/status',
  );
  const {status: dbConnection, retry: retrySupabase} = useUrlStatus(
    `${SUPABASE_URL}/rest/v1`,
  );

  const Checkmark = () => {
    return (
      <Svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <Path
          fill="green"
          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
        />
        <Path
          fill="green"
          d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"
        />
      </Svg>
    );
  };

  const XIcon = () => {
    return (
      <Svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <Path
          fill="red"
          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
        />
        <Path
          fill="red"
          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
        />
      </Svg>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      padding: '5%',
      margin: '3%',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 10,
      borderColor: colors.border,
      borderWidth: 1,
    },
    label: {
      color: colors.text,
      flex: 1,
      fontWeight: 'bold',
    },
    row_container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: '1%',
      marginTop: '1%',
    },
    explanation_text: {
      paddingHorizontal: '5%',
      marginHorizontal: '3%',
      color: colors.notification,
      marginBottom: '3%',
      fontWeight: 'bold',
    },
  });

  return (
    <View>
      <MinimalSectionHeader title={'Connection Status'} />
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          retryTba();
          retrySupabase();
        }}>
        <View style={styles.row_container}>
          <Text style={styles.label}>TBA</Text>
          {(tbaConnection === InternetStatus.ATTEMPTING_TO_CONNECT ||
            dbConnection === InternetStatus.NOT_ATTEMPTED) && (
            <ActivityIndicator />
          )}
          {tbaConnection === InternetStatus.CONNECTED && <Checkmark />}
          {tbaConnection === InternetStatus.FAILED && <XIcon />}
        </View>
        <View style={styles.row_container}>
          <Text style={styles.label}>Database</Text>
          {(dbConnection === InternetStatus.ATTEMPTING_TO_CONNECT ||
            dbConnection === InternetStatus.NOT_ATTEMPTED) && (
            <ActivityIndicator />
          )}
          {dbConnection === InternetStatus.CONNECTED && <Checkmark />}
          {dbConnection === InternetStatus.FAILED && <XIcon />}
        </View>
      </TouchableOpacity>
      {tbaConnection === InternetStatus.FAILED &&
        dbConnection === InternetStatus.FAILED && (
          <Text style={styles.explanation_text}>
            Unable to connect to TBA or Database. Please check your internet
            connection and try again.
          </Text>
        )}
      {tbaConnection === InternetStatus.FAILED && (
        <Text style={styles.explanation_text}>
          Unable to connect to TBA. Picklist creation will be disabled.
        </Text>
      )}
      {dbConnection === InternetStatus.FAILED && (
        <Text style={styles.explanation_text}>
          Unable to connect to database. Data analysis features will be
          disabled. All scout reports will be created offline, and must be
          published to the database later when a connection is available.
        </Text>
      )}
    </View>
  );
};

export default ConnectionStatusBox;
