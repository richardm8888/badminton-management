import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDateUK } from '../utils/dateHelpers';

export default function MatchCard({ match }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.date}>{formatDateUK(match.date)}</Text>
        <Text style={styles.opponent}>vs {match.opponent}</Text>
        <Text style={styles.score}>
          Score: {`${match.games_for} - ${match.games_against}`}
        </Text>
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.result}>{match.games_for > match.games_against ? 'W' : (match.games_for === match.games_against ? 'D' : 'L')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  cardContent: {
    flex: 1,
    paddingRight: 12,
  },
  date: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  opponent: {
    color: '#0287d6',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  score: {
    color: '#888',
    fontSize: 14,
  },
  resultContainer: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderLeftColor: '#0287d6',
    paddingLeft: 12,
  },
  result: {
    color: '#0287d6',
    fontSize: 48,
    fontWeight: 'bold',
  },
});
