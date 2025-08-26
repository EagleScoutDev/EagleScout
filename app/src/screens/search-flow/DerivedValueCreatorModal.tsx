import {useTheme} from '@react-navigation/native';
import StandardModal from '../../components/modals/StandardModal';
import React, {useState} from 'react';
import NewQuestionSeparator from '../form-creation-flow/components/NewQuestionSeparator';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectMenu from '../../components/form/SelectMenu';
import StandardButton from '../../components/StandardButton';
import {getIdealTextColor} from '../../lib/ColorReadability';
import {TrashCan} from '../../SVGIcons';

type Operation = '+' | '-' | '*' | '/';
const operations = ['+', '-', '*', '/'] as Operation[];

const OperationSelector = ({
  operation,
  setOperation,
}: {
  operation: Operation;
  setOperation: (operation: Operation) => void;
}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        setOperation(
          operations[(operations.indexOf(operation) + 1) % operations.length],
        );
      }}
      style={{
        padding: '1%',
        margin: 10,
        borderRadius: 4,
        borderStyle: 'solid',
        backgroundColor: colors.primary,
        width: 35,
      }}>
      <Text
        style={{
          color: colors.text,
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 22,
        }}>
        {operation}
      </Text>
    </TouchableOpacity>
  );
};

const FieldSelector = ({
  data,
  setSelected,
}: {
  data: {text: string; index: number}[];
  setSelected: (selectedIndex: number) => void;
}) => {
  return (
    <View style={{width: '85%'}}>
      <SelectMenu
        setSelected={setSelected}
        data={data.map((item, index) => ({value: item.text, key: index}))}
        searchEnabled={true}
        searchPlaceholder={'Search for a field...'}
        placeholder={'Select a field...'}
        maxHeight={100}
      />
    </View>
  );
};

interface FieldOperation {
  /*
   * format: {preOperation} {value} {operation} {fieldIndex}
   * ex: + 7 * "L4 Scored"
   */
  preOperation: Operation;
  value: number;
  operation: Operation;
  fieldIndex: number;
}

export const DerivedValueCreatorModal = ({
  isOpen,
  onSubmit,
  formFields,
}: {
  isOpen: boolean;
  onSubmit: (fields?: FieldOperation[]) => void;
  formFields: {
    text: string;
    index: number;
  }[];
}) => {
  const {colors} = useTheme();
  const [fields, setFields] = useState<FieldOperation[]>([
    {
      preOperation: '+',
      value: 1,
      operation: '+',
      fieldIndex: 0,
    },
  ]);
  const [deleteMode, setDeleteMode] = useState(false);

  const styles = StyleSheet.create({
    textInput: {
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      color: colors.text,
      width: 35,
      height: 35,
      textAlign: 'center',
    },
  });

  return (
    <StandardModal
      visible={isOpen}
      title={'Select Fields'}
      onDismiss={undefined}>
      <View
        style={{
          display: 'flex',
          width: '100%',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            style={{
              borderColor: colors.notification,
              borderWidth: 1,
              backgroundColor: deleteMode ? colors.notification : colors.card,
              padding: 10,
              borderRadius: 4,
            }}
            onPress={() => {
              setDeleteMode((prev: boolean) => !prev);
            }}>
            <TrashCan
              width={20}
              height={20}
              color={deleteMode ? colors.text : colors.notification}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '60%',
          }}>
          {fields.map((field, index) => (
            <View
              key={index}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: deleteMode
                  ? 'rgb(255, 0, 0, 0.5)'
                  : colors.card,
                marginBottom: 4,
              }}
              onPointerDownCapture={() => {
                console.log('deleteMode', deleteMode);
                if (deleteMode) {
                  const newFields = [...fields];
                  newFields.splice(index, 1);
                  setFields(newFields);
                }
              }}>
              <OperationSelector
                operation={field.preOperation}
                setOperation={newOperation => {
                  const newFields = [...fields];
                  newFields[index].preOperation = newOperation;
                  setFields(newFields);
                }}
              />
              <View
                style={{
                  width: '80%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  placeholder={'#'}
                  placeholderTextColor={colors.primary}
                  style={styles.textInput}
                  value={field.value.toString()}
                  onChangeText={text => {
                    try {
                      parseInt(text, 10);
                    } catch (e) {
                      return;
                    }
                    const newFields = [...fields];
                    newFields[index].value = parseInt(text, 10) || 0;
                    setFields(newFields);
                  }}
                  multiline={true}
                />
                <OperationSelector
                  operation={field.operation}
                  setOperation={newOperation => {
                    const newFields = [...fields];
                    newFields[index].operation = newOperation;
                    setFields(newFields);
                  }}
                />
                <FieldSelector
                  data={formFields}
                  setSelected={selectedIndex => {
                    const newFields = [...fields];
                    newFields[index].fieldIndex = selectedIndex;
                    setFields(newFields);
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <NewQuestionSeparator
          onPress={() => {
            setFields([
              ...fields,
              {
                preOperation: '+',
                value: 1,
                operation: '+',
                fieldIndex: 0,
              },
            ]);
          }}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <StandardButton
            text={'Cancel'}
            color={colors.notification}
            textColor={getIdealTextColor(colors.notification)}
            onPress={() => {
              onSubmit();
            }}
            width={'50%'}
          />
          <StandardButton
            text={'Save'}
            color={colors.primary}
            textColor={getIdealTextColor(colors.primary)}
            onPress={() => {
              onSubmit(fields);
            }}
            width={'50%'}
          />
        </View>
      </View>
    </StandardModal>
  );
};
