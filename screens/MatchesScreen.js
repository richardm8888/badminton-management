import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import MatchCard from '../components/MatchCard';

export default function MatchesScreen() {
  const { matches, games, pairs, deleteMatch, updateMatch } = useContext(DataContext);
  const [editingMatch, setEditingMatch] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form states
  const [editDate, setEditDate] = useState('');
  const [editPairing, setEditPairing] = useState('');
  const [editOpponent, setEditOpponent] = useState('');
  const [editSet1For, setEditSet1For] = useState('');
  const [editSet1Against, setEditSet1Against] = useState('');
  const [editSet2For, setEditSet2For] = useState('');
  const [editSet2Against, setEditSet2Against] = useState('');
  const [editSet3For, setEditSet3For] = useState('');
  const [editSet3Against, setEditSet3Against] = useState('');

  const handleEdit = (game) => {
    setEditingMatch(game);
    setEditDate(game.date);
    setEditPairing(game.pairing);
    setEditOpponent(game.opponent);
    
    // Populate sets
    if (game.sets && game.sets.length > 0) {
      setEditSet1For(game.sets[0]?.points_for?.toString() || '');
      setEditSet1Against(game.sets[0]?.points_against?.toString() || '');
      setEditSet2For(game.sets[1]?.points_for?.toString() || '');
      setEditSet2Against(game.sets[1]?.points_against?.toString() || '');
      setEditSet3For(game.sets[2]?.points_for?.toString() || '');
      setEditSet3Against(game.sets[2]?.points_against?.toString() || '');
    }
    
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editDate || !editOpponent) {
      Alert.alert('Error', 'Date and opponent are required');
      return;
    }

    const sets = [];
    
    const s1For = parseInt(editSet1For, 10) || 0;
    const s1Against = parseInt(editSet1Against, 10) || 0;
    if (s1For > 0 || s1Against > 0) {
      sets.push({ pointsFor: s1For, pointsAgainst: s1Against });
    }
    
    const s2For = parseInt(editSet2For, 10) || 0;
    const s2Against = parseInt(editSet2Against, 10) || 0;
    if (s2For > 0 || s2Against > 0) {
      sets.push({ pointsFor: s2For, pointsAgainst: s2Against });
    }
    
    const s3For = parseInt(editSet3For, 10) || 0;
    const s3Against = parseInt(editSet3Against, 10) || 0;
    if (s3For > 0 || s3Against > 0) {
      sets.push({ pointsFor: s3For, pointsAgainst: s3Against });
    }

    try {
      await updateMatch(editingMatch.id, {
        date: editDate,
        pairing: editPairing,
        opponent: editOpponent,
        sets
      });
      setShowEditModal(false);
      Alert.alert('Success', 'Match updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update match');
    }
  };

  const handleDelete = async (gameId) => {
    try {
      await deleteMatch(gameId);
      Alert.alert('Success', 'Match deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete match');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MatchCard 
            match={item} 
            games={games} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={<Text style={{ color: '#888' }}>No matches recorded yet.</Text>}
      />

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <View style={{ backgroundColor: '#1a1a1a', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%', borderWidth: 2, borderColor: '#0287d6' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#fff' }}>Edit Match</Text>
              <ScrollView>
                <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                <TextInput
                  value={editDate}
                  onChangeText={setEditDate}
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Pairing</Text>
                <TextInput
                  value={editPairing}
                  onChangeText={setEditPairing}
                  style={styles.input}
                  placeholder="Player1 / Player2"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Opponent</Text>
                <TextInput
                  value={editOpponent}
                  onChangeText={setEditOpponent}
                  style={styles.input}
                  placeholder="Opponent name"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Set 1 - For</Text>
                <TextInput
                  value={editSet1For}
                  onChangeText={setEditSet1For}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Set 1 - Against</Text>
                <TextInput
                  value={editSet1Against}
                  onChangeText={setEditSet1Against}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Set 2 - For</Text>
                <TextInput
                  value={editSet2For}
                  onChangeText={setEditSet2For}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Set 2 - Against</Text>
                <TextInput
                  value={editSet2Against}
                  onChangeText={setEditSet2Against}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Set 3 - For</Text>
                <TextInput
                  value={editSet3For}
                  onChangeText={setEditSet3For}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Set 3 - Against</Text>
                <TextInput
                  value={editSet3Against}
                  onChangeText={setEditSet3Against}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#888"
                />

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
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
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 16,
  },
});
