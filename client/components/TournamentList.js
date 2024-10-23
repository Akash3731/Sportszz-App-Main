import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { getTournaments, deleteTournament, toggleFavorite } from '../Services/tournamentService';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/authContext'; // Custom hook to get auth context
import Icon from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome5 icons

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [expandedTournamentId, setExpandedTournamentId] = useState(null); // State to track expanded tournament
  const { auth: user } = useAuth(); // Get the current logged-in user info
  const navigation = useNavigation();

  // Fetch tournaments when the component mounts

    const fetchTournaments = async () => {
      try {
        const data = await getTournaments();
        console.log('Fetched tournaments:', data);
        if (Array.isArray(data)) {
          setTournaments(data);
        } else {
          console.error('Expected data to be an array:', data);
        }
      } catch (err) {
        console.error('Error fetching tournaments:', err);
      }
    };
    useFocusEffect(
      React.useCallback(() => {
        fetchTournaments();
      }, [])
    );


    const handleTournamentCreated = () => {
      console.log('Tournament created, refreshing list...');
    fetchTournaments(); // Fetch tournaments again after a new one is created
  };

  // Handle tournament deletion
  const handleDelete = async (id) => {
    try {
      await deleteTournament(id);
      setTournaments(tournaments.filter((tournament) => tournament._id !== id)); // Remove deleted tournament from the list
    } catch (err) {
      console.error('Error deleting tournament:', err);
    }
  };

  // Navigate to edit tournament page
  const handleEdit = (id) => {
    navigation.navigate('EditTournament', { id }); // Pass the correct parameter
  };

  const handleFavorite = async (id) => {
    try {
      const updatedTournament = await toggleFavorite(id);
      setTournaments(
        tournaments.map((tournament) =>
          tournament._id === id
            ? { ...tournament, isFavorite: updatedTournament.isFavorite }
            : tournament
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleShowMore = (id) => {
    setExpandedTournamentId(expandedTournamentId === id ? null : id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Tournament List</Text>
      {tournaments.length > 0 ? (
        tournaments.map((tournament) => (
          <View key={tournament._id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Tournament Name: </Text>
              <Text>{tournament.tournamentname}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Organizer Name: </Text>
              <Text>{tournament.organizerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Start Date: </Text>
              <Text>{new Date(tournament.date).toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Location: </Text>
              <Text>{tournament.location}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sport Type: </Text>
              <Text>{tournament.sporttype}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Number of Teams: </Text>
              <Text>{tournament.numberofteams}</Text>
            </View>

            {user && ['manager'].includes(user.role.toLowerCase()) && (
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleEdit(tournament._id)}>
                  <Icon name="edit" size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(tournament._id)}>
                  <Icon name="trash-alt" size={20} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFavorite(tournament._id)}>
                  <Icon name={tournament.isFavorite ? 'star' : 'star-of-life'} size={20} color={tournament.isFavorite ? 'orange' : 'gray'} />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => handleShowMore(tournament._id)}
            >
              <Text style={styles.button}>
                {expandedTournamentId === tournament._id ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>

            {expandedTournamentId === tournament._id && (
              <View style={styles.details}>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>End Date: </Text>
                  {new Date(tournament.enddate).toLocaleString()}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Teams/Participants: </Text>
                  {tournament.teamsparticipants}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Contact Information: </Text>
                  {tournament.contactinformation}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Prizes: </Text>
                  {tournament.prizes}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Rules & Regulations: </Text>
                  {tournament.rules}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Sponsor Information: </Text>
                  {tournament.sponsor}
                </Text>
                {tournament.image ? (
                  <Image
                    source={{ uri: tournament.image }}
                    style={styles.image}
                  />
                ) : (
                  <Text>No image available</Text>
                )}
              </View>
            )}
          </View>
        ))
      ) : (
        <Text>No tournaments available. Please create a tournament first.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    color: 'blue',
    fontWeight: 'bold',
  },
  showMoreButton: {
    marginTop: 10,
  },
  details: {
    marginTop: 10,
  },
  detailText: {
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 150,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default TournamentList;





