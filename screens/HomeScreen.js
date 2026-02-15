import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import MatchCard from '../components/MatchCard';

export default function HomeScreen() {
  const { teamTotals, matches, games } = useContext(DataContext);

  const formatValue = (key, value) => {
    // Format percentages to 2 decimal places
    if (key.includes('percent') || key.includes('win_rate')) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value;
  };

  const formatLabel = (key) => {
    // Convert snake_case to Title Case
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.heading}>Team Totals</Text>
      {teamTotals && Object.keys(teamTotals).length > 0 ? (
        <View style={styles.totalsGrid}>
          {Object.entries(teamTotals).map(([key, value]) => (
            <View key={key} style={styles.totalItem}>
              <Text style={styles.totalLabel}>{formatLabel(key)}</Text>
              <Text style={styles.totalValue}>{formatValue(key, value)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ color: '#888', textAlign: 'center' }}>No team totals available.</Text>
      )}
      
      <Text style={styles.heading}>Recent Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <MatchCard match={item} games={games} />}
        ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No matches recorded.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 80,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#0287d6',
  },
  totalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#0287d6',
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    padding: 8,
  },
  totalItem: {
    width: '50%',
    padding: 8,
  },
  totalLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  totalValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
