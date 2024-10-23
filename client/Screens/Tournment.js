import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/authContext';
import TournamentList from '../components/TournamentList';

const Tournament = () => {
  const navigation = useNavigation();
  const { auth } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const role = auth?.role;

  useEffect(() => {
    console.log('Logged-in user role:', role);
    console.log('Authenticated user:', auth);
  }, [role, auth]);

  const handleCreateTournament = () => {
    navigation.navigate('CreateTournament');
  };

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <ScrollView style={styles.container}>
      {auth && (role && (role.toLowerCase() === 'manager')) ? (
        <Button title="Create New Tournament" onPress={handleCreateTournament} color="green" />
      ) : (
        <Text style={styles.infoText}>Welcome! You can view the tournament list below.</Text>
      )}

      <TournamentList key={refresh} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Tournament;
