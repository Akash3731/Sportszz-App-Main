import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TournamentForm from '../components/TournamentForm'; 

const CreateTournament = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <View style={styles.container}>
      <TournamentForm onTournamentCreated={handleRefresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default CreateTournament