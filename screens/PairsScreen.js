import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DataContext } from '../contexts/DataContext';

export default function PairsScreen() {
  const { pairs, players, addPair } = useContext(DataContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleAddPair = async () => {
    if (!player1 || !player2) {
      Alert.alert('Error', 'Please select both players');
      return;
    }
    if (player1 === player2) {
      Alert.alert('Error', 'Please select two different players');
      return;
    }
    
    try {
      await addPair(player1, player2);
      Alert.alert('Success', `Pair ${player1} / ${player2} created!`);
      setPlayer1('');
      setPlayer2('');
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create pair');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Pairs</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Pair</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={pairs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.pairName}>{item.pair_name || `${item.player1} / ${item.player2}`}</Text>
            <Text style={{ color: '#fff', marginBottom: 4 }}>Games For: {item.games_for} | Against: {item.games_against}</Text>
            <Text style={{ color: '#fff', marginBottom: 4 }}>Sets Won: {item.sets_won} | Lost: {item.sets_lost}</Text>
            <Text style={{ color: '#fff' }}>Points For: {item.points_for} | Against: {item.points_against}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888' }}>No pairs available.</Text>}
      />

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Pair</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Player 1</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={player1}
                  onValueChange={setPlayer1}
                  style={styles.picker}
                >
                  <Picker.Item label="Select player..." value="" />
                  {players.map((player, index) => (
                    <Picker.Item key={index} label={player} value={player} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Player 2</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={player2}
                  onValueChange={setPlayer2}
                  style={styles.picker}
                >
                  <Picker.Item label="Select player..." value="" />
                  {players.map((player, index) => (
                    <Picker.Item key={index} label={player} value={player} />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleAddPair}>
              <Text style={styles.createButtonText}>Create Pair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0287d6',
  },
  addButton: {
    backgroundColor: '#0287d6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
  },
  pairName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#0287d6',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalClose: {
    fontSize: 24,
    color: '#0287d6',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    backgroundColor: '#000',
  },
  picker: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#0287d6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
