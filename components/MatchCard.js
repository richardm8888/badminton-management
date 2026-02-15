import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { formatDateUK } from '../utils/dateHelpers';

export default function MatchCard({ match, games }) {
  const [showGames, setShowGames] = React.useState(false);
  const filteredGames = games?.filter(game => game.date === match.date && game.opponent === match.opponent) ?? [];

  const renderSets = (game) => {
    if (!game.sets || game.sets.length === 0) {
      return null;
    }
    
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View></View>
            <View style={styles.setsContainer}>
                <Text style={styles.setsLabel}>Sets:</Text>
                {game.sets.map((set, index) => (
                <Text key={index} style={styles.setScore}>
                    {set.points_for}-{set.points_against}
                    {index < game.sets.length - 1 ? ', ' : ''}
                </Text>
                ))}
            </View>
        </View>
    );
  };

  return (
    <>
        <Modal
            visible={showGames}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowGames(false)}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Game Details</Text>
                    {filteredGames.length > 0 ? (
                        filteredGames.map((game, index) => (
                            <View key={index} style={{ marginBottom: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Game {index + 1}:</Text><Text>{game.pairing}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.setScore}>{game.sets_for > game.sets_against ? 'W' : (game.sets_for === game.sets_against ? 'D' : 'L')}</Text>
                                    <View style={styles.setsContainer}>
                                        <Text style={styles.setsLabel}>Result:</Text>
                                        <Text key={index} style={styles.setScore}>
                                            {game.sets_for}-{game.sets_against}
                                        </Text>
                                    </View>
                                </View>
                                {renderSets(game)}
                            </View>
                        ))
                    ) : (
                        <Text>No game details available.</Text>
                    )}
                    <Text style={{ marginTop: 20, color: '#0287d6', textAlign: 'center' }} onPress={() => setShowGames(false)}>Close</Text>
                </View>
            </View> 

        </Modal>
        <TouchableOpacity style={styles.card} onPress={() => setShowGames(true)}>
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
        </TouchableOpacity>
    </>
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
  setsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  setsLabel: {
    color: '#888',
    fontSize: 12,
    marginRight: 6,
  },
  setScore: {
    color: '#0287d6',
    fontSize: 12,
    fontWeight: '600',
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
