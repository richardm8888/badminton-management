import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { DataContext } from '../contexts/DataContext';

export default function PlayersScreen() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useContext(DataContext);
  const [newName, setNewName] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editName, setEditName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAdd = async () => {
    if (!newName || newName.trim().length === 0) {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }
    
    try {
      await addPlayer(newName);
      setNewName('');
      Alert.alert('Success', 'Player added successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add player');
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setEditName(player.name);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editName || editName.trim().length === 0) {
      Alert.alert('Error', 'Player name cannot be empty');
      return;
    }

    try {
      await updatePlayer(editingPlayer.id, editName.trim());
      setShowEditModal(false);
      Alert.alert('Success', 'Player updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update player');
    }
  };

  const handleDelete = (player) => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to delete ${player.name}? This will also delete all their matches and pairs.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlayer(player.id);
              Alert.alert('Success', 'Player deleted successfully');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete player');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Players</Text>
      <FlatList
        data={players}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={{ color: '#fff', marginBottom: 4 }}>Games For: {item.games_for} | Against: {item.games_against}</Text>
                <Text style={{ color: '#fff' }}>Sets Won: {item.sets_won} | Lost: {item.sets_lost}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginLeft: 8 }}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={{ color: '#888' }}>No players found.</Text>}
      />
      <View style={styles.form}>
        <TextInput
          placeholder="New player name"
          placeholderTextColor="#888"
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <View style={{ backgroundColor: '#1a1a1a', padding: 20, borderRadius: 10, width: '80%', borderWidth: 2, borderColor: '#0287d6' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#fff' }}>Edit Player</Text>
            
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Player Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
              placeholder="Player name"
              placeholderTextColor="#888"
            />

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
              <TouchableOpacity 
                style={{ flex: 1, backgroundColor: '#0287d6', padding: 14, borderRadius: 8, alignItems: 'center' }}
                onPress={handleSaveEdit}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, backgroundColor: '#666', padding: 14, borderRadius: 8, alignItems: 'center' }}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0287d6',
  },
  card: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#0287d6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#0287d6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
