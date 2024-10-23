import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import config from './config'; // Ensure you have your backend URL in this file
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Context/authContext'; 
import { useNavigation } from '@react-navigation/native'; 

const TrainerForm = ({ onSuccess }) => {
  const { auth } = useAuth(); 
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    trainerID: '', 
    trainerName: '', 
    dateOfBirth: '', 
    age: '', 
    sex: '', 
    sports: '', 
    clubNames: '', 
    contactNumber: '', 
    emergencyContactNumber: '', 
    email: '', 
    photo: '', 
    address: '', 
    rank: '', 
    certificates: '',
    achievements: '', 
    identityCardType: '', 
    identityID: '', 
    locations: '',
    authorization: '', 
    referralCode: '', 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('playerData');
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading player data:', error);
      }
    };

    loadPlayerData();
  }, []);

  const handleChange = (name, value) => {
    if (name === 'dateOfBirth') {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      // Format the date to ISO format (YYYY-MM-DD)
      const isoDate = birthDate.toISOString().split('T')[0];
      setFormData({ ...formData, [name]: isoDate, age: age.toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validate for empty fields
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
    if (emptyFields.length) {
      Alert.alert('Error', 'Please fill in all fields.');
      setLoading(false);
      return;
    }

    // Validate specific fields
    const validSexOptions = ['Male', 'Female', 'Other'];
    if (!validSexOptions.includes(formData.sex)) {
      Alert.alert('Error', 'Please select a valid sex option.');
      setLoading(false);
      return;
    }

    const validEmail = /\S+@\S+\.\S+/;
    if (!validEmail.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      setLoading(false);
      return;
    }

    const validPhone = /^[0-9]{10}$/;
    if (!validPhone.test(formData.contactNumber) || !validPhone.test(formData.emergencyContactNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit contact number.');
      setLoading(false);
      return;
    }

    // Prepare data to send to the backend
    const data = new FormData();
    for (const key in formData) {
      if (key === 'dateOfBirth') {
        data.append('dob', formData.dateOfBirth); // Change to match the expected key
      } else {
        data.append(key, formData[key]);
      }
    }
    data.append('role', auth.role); // Append role and user ID
    data.append('id', auth.id);

    try {
      console.log('Sending data to backend:');
      for (let pair of data._parts) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.post(`${config.backendUrl}/update/${auth.role}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Player registered successfully');
      await AsyncStorage.setItem('playerData', JSON.stringify(formData));

      // Reset form after submission
      setFormData({
        trainerID: '',
        trainerName: '',
        dateOfBirth: '',
        age: '',
        sex: '',
        sports: '',
        clubNames: '',
        contactNumber: '',
        emergencyContactNumber: '',
        email: '',
        photo: '',
        address: '',
        rank: '',
        certificates: '',
        achievements: '',
        identityCardType: '',
        identityID: '',
        locations: '',
        authorization: '',
        referralCode: '',
      });

      onSuccess(); // Call the onSuccess prop to close the modal
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to register player. Please try again.');
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.heading}>Trainer Registration</Text>
      {Object.keys(formData).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <TextInput
            placeholder={key.replace(/([A-Z])/g, ' $1')}
            value={formData[key]}
            onChangeText={(value) => handleChange(key, value)}
            style={styles.input}
          />
        </View>
      ))}
      <Button
        title={loading ? 'Submitting...' : 'Submit'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default TrainerForm;
