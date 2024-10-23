import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import config from './config';

// Replace with your backend URL
const API_URL = `${config.backendUrl}/tournaments`;

const TournamentForm = ({ onTournamentCreated }) => {
  const [formData, setFormData] = useState({
    tournamentname: '',
    organizerName: '',
    image: null,
    date: '',
    enddate: '',
    location: '',
    teamsparticipants: '',
    sporttype: '',
    numberofteams: '',
    tournamenttype: '',
    contactinformation: '',
    prizes: '',
    rules: '',
    sponsor: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setFormData({ ...formData, image });
      setImagePreview(image.uri);
    } else {
      Alert.alert('Error', 'No image selected.');
    }
  };

  const handleSubmit = async () => {
    // Check if all required fields are filled
    const requiredFields = [
      'tournamentname',
      'organizerName',
      'date',
      'enddate',
      'location',
      'teamsparticipants',
      'sporttype',
      'numberofteams',
      'tournamenttype',
      'contactinformation',
      'prizes',
      'rules',
      'sponsor',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        Alert.alert('Error', `Field "${field}" is required.`);
        return;
      }
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'image' && formData.image) {
          const imageData = {
            uri: formData.image.uri,
            type: 'image/jpeg', // Ensure you adjust if your image type is different
            name: formData.image.uri.split('/').pop(), // Extract the image name
          };
          formDataToSend.append('image', imageData);
        } else if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Debugging
      console.log('Sending FormData:', formDataToSend);

      // Make the API call
      const response = await axios.post(API_URL, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API response:', response.data);

      if (response.status === 201) {
        Alert.alert('Success', 'Tournament created successfully!');
        onTournamentCreated();
        navigation.navigate('Tournament');
      } else {
        Alert.alert('Error', 'Failed to create tournament. Please try again.');
      }
    } catch (err) {
      console.error('Error creating tournament:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        Alert.alert('Error', `Failed to create tournament. Server responded with status: ${err.response.status}`);
      } else {
        console.error('Error message:', err.message);
        Alert.alert('Error', `Failed to create tournament. ${err.message || 'Network error'}`);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create a New Tournament</Text>

      <Text style={styles.label}>Tournament Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the tournament name"
        value={formData.tournamentname}
        onChangeText={(value) => handleInputChange('tournamentname', value)}
      />

      <Text style={styles.label}>Organizer Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the organizer's name"
        value={formData.organizerName}
        onChangeText={(value) => handleInputChange('organizerName', value)}
      />

      <TouchableOpacity onPress={handleImageSelect} style={styles.imageSelectButton}>
        <Text style={styles.imageSelectText}>Select Tournament Image</Text>
      </TouchableOpacity>
      {imagePreview && (
        <Image
          source={{ uri: imagePreview }}
          style={styles.imagePreview}
        />
      )}

      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter start date"
        value={formData.date}
        onChangeText={(value) => handleInputChange('date', value)}
      />

      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter end date"
        value={formData.enddate}
        onChangeText={(value) => handleInputChange('enddate', value)}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={formData.location}
        onChangeText={(value) => handleInputChange('location', value)}
      />

      <Text style={styles.label}>Teams/Participants</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter teams participants"
        value={formData.teamsparticipants}
        onChangeText={(value) => handleInputChange('teamsparticipants', value)}
      />

      <Text style={styles.label}>Sport Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter sport type"
        value={formData.sporttype}
        onChangeText={(value) => handleInputChange('sporttype', value)}
      />

      <Text style={styles.label}>Number of Teams</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter number of teams"
        value={formData.numberofteams}
        onChangeText={(value) => handleInputChange('numberofteams', value)}
      />

      <Text style={styles.label}>Tournament Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tournament type"
        value={formData.tournamenttype}
        onChangeText={(value) => handleInputChange('tournamenttype', value)}
      />

      <Text style={styles.label}>Contact Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact information"
        value={formData.contactinformation}
        onChangeText={(value) => handleInputChange('contactinformation', value)}
      />

      <Text style={styles.label}>Prizes</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter prizes"
        value={formData.prizes}
        onChangeText={(value) => handleInputChange('prizes', value)}
      />

      <Text style={styles.label}>Rules</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter rules"
        value={formData.rules}
        onChangeText={(value) => handleInputChange('rules', value)}
      />

      <Text style={styles.label}>Sponsor</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter sponsor"
        value={formData.sponsor}
        onChangeText={(value) => handleInputChange('sponsor', value)}
      />

      <Button title="Create Tournament" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  imageSelectButton: {
    backgroundColor: '#008CBA',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  imageSelectText: {
    color: '#fff',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
});

export default TournamentForm;

