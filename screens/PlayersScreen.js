import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { DataContext } from '../contexts/DataContext';

export default function PlayersScreen() {
  const { players, games, addPlayer } = useContext(DataContext);
  const [newName, setNewName] = useState('');

  // compute simple stats per player (gamesFor, gamesAgainst)
  const computeStats = (playerName) => {
    let gf = 0;
    let ga = 0;
    let setsWon = 0;
    let setsLost = 0;
    games.forEach((g) => {
      if (g.player1 === playerName || g.player2 === playerName) {
        gf += g.games_for;
        ga += g.games_against;
        setsWon += g.sets_won;
        setsLost += g.sets_lost;
      }
    });
    return { gf, ga, setsWon, setsLost };
  };

  const handleAdd = () => {
    addPlayer(newName);
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Players</Text>
      <FlatList
        data={players}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const stats = computeStats(item);
          return (
            <View style={styles.card}>
              <Text style={styles.playerName}>{item}</Text>
              <Text style={{ color: '#fff', marginBottom: 4 }}>Games For: {stats.gf} | Against: {stats.ga}</Text>
              <Text style={{ color: '#fff' }}>Sets Won: {stats.setsWon} | Lost: {stats.setsLost}</Text>
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
  },
  playerName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
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
