import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; 
import { getTournamentById, updateTournament } from '../Services/tournamentService';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import config from './config';

const EditTournament = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; 
  const [tournament, setTournament] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const data = await getTournamentById(id);
        console.log('Fetched data:', data);

        const updatedData = {
          ...data,
          date: data.date ? formatDateToLocal(new Date(data.date)) : '',
          enddate: data.enddate ? formatDateToLocal(new Date(data.enddate)) : ''
        };

        setTournament(updatedData);

        if (data.image) {
          const imageUrl = `${config.backendUrl.replace('/api', '')}/uploads/${data.image}`;
          setImagePreview(imageUrl);
          console.log('Image preview set to:', imageUrl);
        }
      } catch (err) {
        console.error('Error fetching tournament:', err);
      }
    };

    fetchTournament();
  }, [id]);

  const formatDateToLocal = (date) => {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().slice(0, 16);
  };

  const handleChange = (name, value) => {
    setTournament({ ...tournament, [name]: value });
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setImageFile(file);
      setImagePreview(file.uri);
      console.log('Image file selected:', file);
      console.log('Image preview URL:', file.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(tournament).forEach((key) => {
        formData.append(key, tournament[key]);
      });

      if (imageFile) {
        formData.append('image', {
          uri: imageFile.uri,
          name: imageFile.fileName || 'photo.jpg',
          type: imageFile.mimeType || 'image/jpeg',
        });
      }

      const headersConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.put(`${config.backendUrl}/tournaments/${id}`, formData, headersConfig);

      console.log('Tournament updated successfully:', response.data);

      // Update tournament data and image preview
      const updatedTournament = await getTournamentById(id);
      setTournament(updatedTournament);
      if (updatedTournament.image) {
        const updatedImageUrl = `${config.backendUrl.replace('/api', '')}/uploads/${updatedTournament.image}`;
        setImagePreview(updatedImageUrl);
        console.log('Updated image URL:', updatedImageUrl);
      }

      navigation.navigate('Tournament');
    } catch (err) {
      console.error('Error updating tournament:', err.message || err);
      Alert.alert('Error', 'Failed to update the tournament. Please try again later.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit Tournament</Text>
      {tournament ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Tournament Name"
            value={tournament.tournamentname || ''}
            onChangeText={(value) => handleChange('tournamentname', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Organizer Name"
            value={tournament.organizerName || ''}
            onChangeText={(value) => handleChange('organizerName', value)}
            required
          />
          <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          </TouchableOpacity>
          {imagePreview && (
            <Image
              source={{ uri: imagePreview }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Start Date & Time"
            value={tournament.date || ''}
            onChangeText={(value) => handleChange('date', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="End Date & Time"
            value={tournament.enddate || ''}
            onChangeText={(value) => handleChange('enddate', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={tournament.location || ''}
            onChangeText={(value) => handleChange('location', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Enter the names of teams or participants"
            value={tournament.teamsparticipants || ''}
            onChangeText={(value) => handleChange('teamsparticipants', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Sport Type"
            value={tournament.sporttype || ''}
            onChangeText={(value) => handleChange('sporttype', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Teams"
            value={String(tournament.numberofteams || '')} // Ensure this is a string
            keyboardType="numeric"
            onChangeText={(value) => handleChange('numberofteams', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Tournament Type"
            value={tournament.tournamenttype || ''}
            onChangeText={(value) => handleChange('tournamenttype', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Information"
            value={tournament.contactinformation || ''}
            onChangeText={(value) => handleChange('contactinformation', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Describe the prizes for winners"
            value={tournament.prizes || ''}
            onChangeText={(value) => handleChange('prizes', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="List the tournament rules and regulations"
            value={tournament.rules || ''}
            onChangeText={(value) => handleChange('rules', value)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Enter sponsor details"
            value={tournament.sponsor || ''}
            onChangeText={(value) => handleChange('sponsor', value)}
            required
          />
          <Button title="Update Tournament" onPress={handleSubmit} color="#4CAF50" />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  imagePicker: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#fff',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#007BFF',
  },
});

export default EditTournament;

