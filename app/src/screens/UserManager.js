import {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {supabase} from '../lib/supabase';

function SortOption({onPress, title, colors, isActive}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        backgroundColor: isActive ? 'blue' : colors.card,
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        margin: 10,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
      <Text style={{color: isActive ? 'white' : colors.text}}>{title}</Text>
    </TouchableOpacity>
  );
}

const DEBUG = false;
function UserManager({navigation}) {
  const [users, setUsers] = useState([]);
  const {colors} = useTheme();
  const [sort, setSort] = useState('All');
  const [sortedUsers, setSortedUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = sortType => {
    setSort(sortType);
    if (sortType === 'All') {
      setSortedUsers(users);
      fetchUsers().then(() => {
        if (DEBUG) {
          console.log('fetched');
        }
      });
    } else if (sortType === 'Rejected') {
      setSortedUsers(users.filter(user => !user.scouter));
    } else if (sortType === 'Captain') {
      setSortedUsers(users.filter(user => user.admin));
    } else if (sortType === 'Scouter') {
      setSortedUsers(users.filter(user => !user.admin && user.scouter));
    }
  };

  const fetchUsers = async () => {
    console.log('fetching');
    const {data, error} = await supabase.rpc('get_user_profiles_with_email');
    const users = data;
    users.forEach(user => {
      user.name =
        (user.first_name || 'UNKNOWN_FIRSTNAME') +
        ' ' +
        (user.last_name || 'UNKNOWN_LASTNAME');
    });
    if (error) {
      console.log(error);
    }
    // sort users by name
    users.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setUsers(users);
    setSortedUsers(users);
  };

  async function updateApproveStatus(user, b) {
    const {data, error} = await supabase
      .from('user_attributes')
      .update({scouter: b})
      .eq('id', user.id);
    if (error) {
      console.error(error);
      Alert.alert('Error updating user status', JSON.stringify(error));
    } else {
      fetchUsers();
    }
  }

  async function updateAdminStatus(user, b) {
    const {data, error} = await supabase
      .from('user_attributes')
      .update({admin: b})
      .eq('id', user.id);
    if (error) {
      console.error(error);
      Alert.alert('Error updating user status', JSON.stringify(error));
    } else {
      fetchUsers();
    }
  }

  // cleanup after any database changes
  const successAlert = () => {
    Toast.show({
      type: 'success',
      text1: 'User status updated!',
      visibilityTime: 3000,
    });
  };

  // create a constant handlePress that takes in a user and a string
  const handlePress = (user, changeType) => {
    // if the string is 'edit'
    if (changeType === 'approved') {
      if (user.scouter) {
        Alert.alert(
          'Unapprove ' + user.name + '?',
          'Are you sure you want to unapprove this user? This will remove their access from creating and viewing scouting reports.',
          [
            {
              text: 'Cancel',
              onPress: () => {
                if (DEBUG) {
                  console.log('Cancel Pressed');
                }
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                // call the function updateAdminStatus and pass in the user and true
                if (user.admin) {
                  const res = await supabase.auth.getUser();
                  const currentUser = res.data.user;
                  if (DEBUG) {
                    console.log(currentUser.email);
                    console.log(currentUser.id);
                  }
                  if (user.id === currentUser.id) {
                    Alert.alert(
                      'Cannot unapprove yourself',
                      'For security purposes, you cannot unapprove yourself. Please contact another admin to unapprove you.',
                    );
                  } else {
                    updateApproveStatus(user, false);
                    updateAdminStatus(user, false).then(successAlert);
                  }
                } else {
                  updateApproveStatus(user, false);
                  updateAdminStatus(user, false).then(successAlert);
                }
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          'Approve ' + user.name + '?',
          'Are you sure you want to approve this user?',
          [
            {
              text: 'Cancel',
              onPress: () => {
                if (DEBUG) {
                  console.log('Cancel Pressed');
                }
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                // call the function updateAdminStatus and pass in the user and true
                updateApproveStatus(user, true).then(successAlert);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } else if (changeType === 'admin') {
      if (user.admin) {
        Alert.alert(
          'Remove ' + user.name + ' as admin?',
          'Are you sure you want to remove this user as admin?',
          [
            {
              text: 'Cancel',
              onPress: () => {
                if (DEBUG) {
                  console.log('Cancel Pressed');
                }
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                // call the function updateAdminStatus and pass in the user and true
                const res = await supabase.auth.getUser();
                const currentUser = res.data.user;
                if (DEBUG) {
                  console.log(currentUser.email);
                  console.log(currentUser.id);
                }
                if (user.id === currentUser.id) {
                  Alert.alert(
                    'Cannot unapprove yourself',
                    'For security purposes, you cannot unapprove yourself. Please contact another admin to unapprove you.',
                  );
                } else {
                  updateAdminStatus(user, false).then(successAlert);
                }
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          'Make ' + user.name + ' an admin?',
          'Are you sure you want to make this user an admin?',
          [
            {
              text: 'Cancel',
              onPress: () => {
                if (DEBUG) {
                  console.log('Cancel Pressed');
                }
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                // call the function updateAdminStatus and pass in the user and true
                updateAdminStatus(user, true);
                updateApproveStatus(user, true).then(successAlert);
              },
            },
          ],
          {cancelable: false},
        );
      }
    }
  };

  const styles = StyleSheet.create({
    option: {
      padding: 10,
      color: colors.text,
    },
    chosen: {
      backgroundColor: 'blue',
      color: 'white',
      padding: 10,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: 'blue',
      // prevent the background color from showing through the border
      overflow: 'hidden',
    },
    chosenRejected: {
      backgroundColor: 'red',
      color: 'white',
      padding: 10,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: 'red',
      // prevent the background color from showing through the border
      overflow: 'hidden',
    },
  });
  const picker = user => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.card,
          justifyContent: 'space-around',
          padding: 5,

          margin: 5,
          borderRadius: 10,
        }}>
        <Text
          style={user.scouter ? styles.option : styles.chosenRejected}
          onPress={() => {
            if (user.scouter) {
              handlePress(user, 'approved');
            }
          }}>
          Rejected
        </Text>
        <Text
          onPress={() => {
            if (!user.scouter) {
              handlePress(user, 'approved');
            } else if (user.admin) {
              handlePress(user, 'admin');
            }
          }}
          style={
            user.scouter
              ? user.admin
                ? styles.option
                : styles.chosen
              : styles.option
          }>
          Scouter
        </Text>
        <Text
          style={user.admin ? styles.chosen : styles.option}
          onPress={() => {
            if (!user.admin) {
              handlePress(user, 'admin');
            }
          }}>
          Captain
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <SortOption
          title="All"
          onPress={() => {
            handleSort('All');
          }}
          colors={colors}
          isActive={sort === 'All'}
        />
        <SortOption
          title={'Rejected'}
          onPress={() => {
            handleSort('Rejected');
          }}
          colors={colors}
          isActive={sort === 'Rejected'}
        />
        <SortOption
          title="Scouter"
          onPress={() => {
            handleSort('Scouter');
          }}
          colors={colors}
          isActive={sort === 'Scouter'}
        />
        <SortOption
          title="Captain"
          onPress={() => {
            handleSort('Captain');
          }}
          colors={colors}
          isActive={sort === 'Captain'}
        />
      </View>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: 10,
            flex: 1,
          }}>
          {sortedUsers.map(user => (
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: colors.card,
                paddingTop: 15,
                paddingLeft: 15,
                margin: 5,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: colors.border,
              }}
              key={user.email}>
              <Text
                style={{fontWeight: 'bold', fontSize: 20, color: colors.text}}>
                {user.name}
              </Text>
              <Text style={{color: colors.text}}>{user.email}</Text>
              {picker(user)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default UserManager;
