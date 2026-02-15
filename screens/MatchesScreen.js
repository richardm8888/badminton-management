import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import MatchCard from '../components/MatchCard';

export default function MatchesScreen() {
  const { matches, games } = useContext(DataContext);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <MatchCard match={item} games={games} />}
        ListEmptyComponent={<Text style={{ color: '#888' }}>No matches recorded yet.</Text>}
      />
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
});
