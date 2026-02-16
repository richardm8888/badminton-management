import React from 'react';
import { View, ScrollView, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { formatDateUK } from '../utils/dateHelpers';

export default function MatchCard({ match, games, onEdit, onDelete }) {
  const [showGames, setShowGames] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);
  const filteredGames = games?.filter(game => game.date === match.date && game.opponent === match.opponent) ?? [];

  const handleDelete = (gameId) => {
    Alert.alert(
      'Delete Match',
      'Are you sure you want to delete this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDelete?.(gameId);
            setShowActions(false);
          }
        }
      ]
    );
  };

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
            onDismiss={() => setShowGames(false)}
        >
            <ScrollView 
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', marginTop: 50}}
                contentContainerStyle={{ padding: 20 }}
            >
                <View style={{ backgroundColor: '#1a1a1a', padding: 20, borderRadius: 10, width: '95%', marginHorizontal: '2.5%', borderWidth: 2, borderColor: '#0287d6' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>Game Details</Text>
                    {filteredGames.length > 0 ? (
                        <View>
                            {filteredGames.map((game, index) => (
                                <View key={index} style={{ marginBottom: 16, padding: 12, backgroundColor: '#000', borderRadius: 8, borderWidth: 1, borderColor: '#0287d6' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Game {index + 1}</Text>
                                        <Text style={{ color: '#0287d6' }}>{game.pairing}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                                            {game.sets_for > game.sets_against ? 'W' : (game.sets_for === game.sets_against ? 'D' : 'L')}
                                        </Text>
                                        <View style={styles.setsContainer}>
                                            <Text style={styles.setsLabel}>Result:</Text>
                                            <Text style={{ ...styles.setScore, fontSize: 14 }}>
                                                {game.sets_for}-{game.sets_against}
                                            </Text>
                                        </View>
                                    </View>
                                    {renderSets(game)}
                                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                                        <TouchableOpacity 
                                            style={{ flex: 1, backgroundColor: '#0287d6', padding: 10, borderRadius: 6, alignItems: 'center' }}
                                            onPress={() => {
                                                setShowGames(false);
                                                onEdit?.(game);
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={{ flex: 1, backgroundColor: '#ff4444', padding: 10, borderRadius: 6, alignItems: 'center' }}
                                            onPress={() => {
                                                setShowGames(false);
                                                handleDelete(game.id);
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: '#888' }}>No game details available.</Text>
                    )}
                    <TouchableOpacity 
                        style={{ marginTop: 20, padding: 12, backgroundColor: '#0287d6', borderRadius: 8 }}
                        onPress={() => setShowGames(false)}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView> 

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
