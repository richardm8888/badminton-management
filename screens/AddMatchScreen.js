import React, { useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, Modal, TouchableOpacity, FlatList } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import { formatDateUK } from '../utils/dateHelpers';

export default function AddMatchScreen({ navigation }) {
  const { addMatch, pairs } = useContext(DataContext);
  const [date, setDate] = useState('');
  const [pairing, setPairing] = useState('');
  const [opponent, setOpponent] = useState('');
  const [pointsFor, setPointsFor] = useState('');
  const [pointsAgainst, setPointsAgainst] = useState('');
  const [setsFor, setSetsFor] = useState('');
  const [setsAgainst, setSetsAgainst] = useState('');
  const [errors, setErrors] = useState({});
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Refs for input fields
  const opponentRef = useRef(null);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate date
    if (!date.trim()) {
      newErrors.date = 'Date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      newErrors.date = 'Date must be in YYYY-MM-DD format';
    }

    // Validate pairing
    if (!pairing) {
      newErrors.pairing = 'Pairing is required';
    }

    // Validate opponent
    if (!opponent.trim()) {
      newErrors.opponent = 'Opponent name is required';
    } else if (opponent.trim().length < 2) {
      newErrors.opponent = 'Opponent name must be at least 2 characters';
    }

    // Validate points
    if (pointsFor && isNaN(parseInt(pointsFor, 10))) {
      newErrors.pointsFor = 'Points For must be a number';
    }
    if (pointsAgainst && isNaN(parseInt(pointsAgainst, 10))) {
      newErrors.pointsAgainst = 'Points Against must be a number';
    }

    // Validate sets
    if (setsFor && isNaN(parseInt(setsFor, 10))) {
      newErrors.setsFor = 'Sets For must be a number';
    }
    if (setsAgainst && isNaN(parseInt(setsAgainst, 10))) {
      newErrors.setsAgainst = 'Sets Against must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    const setsForValue = parseInt(setsFor, 10) || 0;
    const setsAgainstValue = parseInt(setsAgainst, 10) || 0;
    
    // Calculate result based on sets
    let result = 'D'; // Draw
    if (setsForValue > setsAgainstValue) {
      result = 'W'; // Win
    } else if (setsForValue < setsAgainstValue) {
      result = 'L'; // Loss
    }

    const matchObj = {
      date,
      pairing,
      opponent: opponent.trim(),
      result,
      pointsFor: parseInt(pointsFor, 10) || 0,
      pointsAgainst: parseInt(pointsAgainst, 10) || 0,
      setsFor: setsForValue,
      setsAgainst: setsAgainstValue,
    };
    addMatch(matchObj);
    
    // clear form
    setDate('');
    setPairing('');
    setOpponent('');
    setPointsFor('');
    setPointsAgainst('');
    setSetsFor('');
    setSetsAgainst('');
    setErrors({});
    
    Alert.alert('Success', 'Match added successfully.');
    navigation.navigate('Matches');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text style={styles.heading}>Add New Match</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity
                style={[styles.input, styles.pickerButton, errors.date && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={date ? styles.pickerButtonText : styles.pickerButtonPlaceholder}>
                  {date ? formatDateUK(date) : 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>

            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.datePickerModal}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Date</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                          <Text style={styles.modalClose}>✕</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.datePickerContent}>
                        <View style={styles.datePickerRow}>
                          <View style={styles.datePickerColumn}>
                            <Text style={styles.datePickerLabel}>Year</Text>
                            <ScrollView style={styles.datePickerScroll}>
                              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <TouchableOpacity
                                  key={year}
                                  style={[
                                    styles.datePickerItem,
                                    selectedDate.getFullYear() === year && styles.datePickerItemSelected
                                  ]}
                                  onPress={() => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setFullYear(year);
                                    setSelectedDate(newDate);
                                  }}
                                >
                                  <Text style={[
                                    styles.datePickerItemText,
                                    selectedDate.getFullYear() === year && styles.datePickerItemTextSelected
                                  ]}>{year}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                          <View style={styles.datePickerColumn}>
                            <Text style={styles.datePickerLabel}>Month</Text>
                            <ScrollView style={styles.datePickerScroll}>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <TouchableOpacity
                                  key={month}
                                  style={[
                                    styles.datePickerItem,
                                    selectedDate.getMonth() + 1 === month && styles.datePickerItemSelected
                                  ]}
                                  onPress={() => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setMonth(month - 1);
                                    setSelectedDate(newDate);
                                  }}
                                >
                                  <Text style={[
                                    styles.datePickerItemText,
                                    selectedDate.getMonth() + 1 === month && styles.datePickerItemTextSelected
                                  ]}>{String(month).padStart(2, '0')}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                          <View style={styles.datePickerColumn}>
                            <Text style={styles.datePickerLabel}>Day</Text>
                            <ScrollView style={styles.datePickerScroll}>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <TouchableOpacity
                                  key={day}
                                  style={[
                                    styles.datePickerItem,
                                    selectedDate.getDate() === day && styles.datePickerItemSelected
                                  ]}
                                  onPress={() => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setDate(day);
                                    setSelectedDate(newDate);
                                  }}
                                >
                                  <Text style={[
                                    styles.datePickerItemText,
                                    selectedDate.getDate() === day && styles.datePickerItemTextSelected
                                  ]}>{String(day).padStart(2, '0')}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.datePickerConfirmButton}
                          onPress={() => {
                            setDate(formatDate(selectedDate));
                            if (errors.date) setErrors({ ...errors, date: null });
                            setShowDatePicker(false);
                          }}
                        >
                          <Text style={styles.datePickerConfirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Pairing *</Text>
              <TouchableOpacity
                style={[styles.input, styles.pickerButton, errors.pairing && styles.inputError]}
                onPress={() => setShowPairingModal(true)}
              >
                <Text style={pairing ? styles.pickerButtonText : styles.pickerButtonPlaceholder}>
                  {pairing || 'Select a pairing...'}
                </Text>
              </TouchableOpacity>
              {errors.pairing && <Text style={styles.errorText}>{errors.pairing}</Text>}
            </View>

            <Modal
              visible={showPairingModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowPairingModal(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowPairingModal(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Pairing</Text>
                        <TouchableOpacity onPress={() => setShowPairingModal(false)}>
                          <Text style={styles.modalClose}>✕</Text>
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={pairs}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => {
                              setPairing(item.pair_name);
                              if (errors.pairing) setErrors({ ...errors, pairing: null });
                              setShowPairingModal(false);
                            }}
                          >
                            <Text style={styles.modalItemText}>{item.pair_name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Opponent *</Text>
              <TextInput
                ref={opponentRef}
                placeholder="Enter opponent name"
                value={opponent}
                onChangeText={(text) => {
                  setOpponent(text);
                  if (errors.opponent) setErrors({ ...errors, opponent: null });
                }}
                style={[styles.input, errors.opponent && styles.inputError]}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              {errors.opponent && <Text style={styles.errorText}>{errors.opponent}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Points</Text>
              <View style={styles.numberRow}>
                <View style={styles.numberInputContainer}>
                  <Text style={styles.numberLabel}>For</Text>
                  <View style={styles.numberStepper}>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(pointsFor, 10) || 0;
                        if (current > 0) setPointsFor(String(current - 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={pointsFor}
                      onChangeText={(text) => {
                        if (text === '' || /^\d+$/.test(text)) {
                          setPointsFor(text);
                          if (errors.pointsFor) setErrors({ ...errors, pointsFor: null });
                        }
                      }}
                      keyboardType="numeric"
                      style={styles.numberInput}
                      placeholder="0"
                    />
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(pointsFor, 10) || 0;
                        setPointsFor(String(current + 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.numberInputContainer}>
                  <Text style={styles.numberLabel}>Against</Text>
                  <View style={styles.numberStepper}>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(pointsAgainst, 10) || 0;
                        if (current > 0) setPointsAgainst(String(current - 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={pointsAgainst}
                      onChangeText={(text) => {
                        if (text === '' || /^\d+$/.test(text)) {
                          setPointsAgainst(text);
                          if (errors.pointsAgainst) setErrors({ ...errors, pointsAgainst: null });
                        }
                      }}
                      keyboardType="numeric"
                      style={styles.numberInput}
                      placeholder="0"
                    />
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(pointsAgainst, 10) || 0;
                        setPointsAgainst(String(current + 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {(errors.pointsFor || errors.pointsAgainst) && (
                <Text style={styles.errorText}>
                  {errors.pointsFor || errors.pointsAgainst}
                </Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Sets</Text>
              <View style={styles.numberRow}>
                <View style={styles.numberInputContainer}>
                  <Text style={styles.numberLabel}>For</Text>
                  <View style={styles.numberStepper}>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(setsFor, 10) || 0;
                        if (current > 0) setSetsFor(String(current - 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={setsFor}
                      onChangeText={(text) => {
                        if (text === '' || /^\d+$/.test(text)) {
                          setSetsFor(text);
                          if (errors.setsFor) setErrors({ ...errors, setsFor: null });
                        }
                      }}
                      keyboardType="numeric"
                      style={styles.numberInput}
                      placeholder="0"
                    />
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(setsFor, 10) || 0;
                        setSetsFor(String(current + 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.numberInputContainer}>
                  <Text style={styles.numberLabel}>Against</Text>
                  <View style={styles.numberStepper}>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(setsAgainst, 10) || 0;
                        if (current > 0) setSetsAgainst(String(current - 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={setsAgainst}
                      onChangeText={(text) => {
                        if (text === '' || /^\d+$/.test(text)) {
                          setSetsAgainst(text);
                          if (errors.setsAgainst) setErrors({ ...errors, setsAgainst: null });
                        }
                      }}
                      keyboardType="numeric"
                      style={styles.numberInput}
                      placeholder="0"
                    />
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => {
                        const current = parseInt(setsAgainst, 10) || 0;
                        setSetsAgainst(String(current + 1));
                      }}
                    >
                      <Text style={styles.stepperButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {(errors.setsFor || errors.setsAgainst) && (
                <Text style={styles.errorText}>
                  {errors.setsFor || errors.setsAgainst}
                </Text>
              )}
            </View>

            <Text style={styles.requiredNote}>* Required fields</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Match</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  pickerButton: {
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  pickerButtonPlaceholder: {
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
    borderTopWidth: 3,
    borderTopColor: '#0287d6',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalClose: {
    fontSize: 24,
    color: '#0287d6',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalItemText: {
    fontSize: 16,
    color: '#fff',
  },
  datePickerModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    borderTopWidth: 3,
    borderTopColor: '#0287d6',
  },
  datePickerContent: {
    padding: 16,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  datePickerScroll: {
    maxHeight: 200,
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    backgroundColor: '#000',
  },
  datePickerItem: {
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  datePickerItemSelected: {
    backgroundColor: '#0287d6',
  },
  datePickerItemText: {
    fontSize: 16,
    color: '#fff',
  },
  datePickerItemTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  datePickerConfirmButton: {
    backgroundColor: '#0287d6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  numberInputContainer: {
    flex: 1,
  },
  numberLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: '#0287d6',
    textAlign: 'center',
  },
  numberStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  stepperButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0287d6',
  },
  stepperButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  numberInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    padding: 8,
    color: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  requiredNote: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#0287d6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
