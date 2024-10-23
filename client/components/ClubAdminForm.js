import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from "react-native";
import axios from "axios";
import config from "./config"; // Ensure this points to your correct backend URL
import { useAuth } from "../Context/authContext";
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClubAdminForm = ({ onSuccess }) => {
  const { auth } = useAuth();
  
  const [formData, setFormData] = useState({
    sports: "",
    noOfPlayers: "",
    contacts: [
      { contactPersonName: "", designation: "", contactNumber: "" },
      { contactPersonName: "", designation: "", contactNumber: "" },
      { contactPersonName: "", designation: "", contactNumber: "" },
    ],
    locations: "",
  });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('clubAdminData');
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading club admin data:', error);
      }
    };

    loadFormData();
  }, []);

  const handleChange = (name, value) => {
    const [field, index] = name.split("-");

    if (index) {
      const updatedContacts = formData.contacts.map((contact, i) =>
        i === Number(index) ? { ...contact, [field]: value } : contact
      );
      setFormData({ ...formData, contacts: updatedContacts });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value && key !== 'contacts');
    const emptyContacts = formData.contacts.some(contact => 
      !contact.contactPersonName || !contact.designation || !contact.contactNumber
    );

    if (emptyFields.length || emptyContacts) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const data = new FormData();
    data.append('role', auth.role);
    data.append('id', auth.id);

    // Append non-contact fields
    data.append('sports', formData.sports);
    data.append('noOfPlayers', formData.noOfPlayers);
    data.append('locations', formData.locations);

    // Append contacts
    formData.contacts.forEach((contact, index) => {
      data.append(`contacts[${index}][contactPersonName]`, contact.contactPersonName);
      data.append(`contacts[${index}][designation]`, contact.designation);
      data.append(`contacts[${index}][contactNumber]`, contact.contactNumber);
    });

    try {
      const response = await axios.post(
        `${config.backendUrl}/update/${auth.role}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${auth.token}`, // Include your auth token if needed
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Form submitted successfully',
      });

      await AsyncStorage.setItem('clubAdminData', JSON.stringify(formData));

      // Reset form after submission
      setFormData({
        sports: "",
        noOfPlayers: "",
        contacts: [
          { contactPersonName: "", designation: "", contactNumber: "" },
          { contactPersonName: "", designation: "", contactNumber: "" },
          { contactPersonName: "", designation: "", contactNumber: "" },
        ],
        locations: "",
      });


      // You can define the onSuccess function here if needed
      onSuccess();
    } catch (error) {
      console.error('Error submitting forms:', error);

      // Handle network error
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        Alert.alert('Error', `Failed to submit form: ${error.response.data.message || 'Please try again.'}`);
      } else if (error.request) {
        console.error('Request data:', error.request);
        Alert.alert('Network Error', 'No response received from the server. Please check your network connection.');
      } else {
        console.error('Error message:', error.message);
        Alert.alert('Error', 'An error occurred while submitting the form. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.heading}>Club Admin Form</Text>

      <View style={styles.inputContainer}>
        <Text>Sport/s</Text>
        <TextInput
          style={styles.input}
          value={formData.sports}
          onChangeText={(text) => handleChange("sports", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Number of Players</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.noOfPlayers}
          onChangeText={(text) => handleChange("noOfPlayers", text)}
        />
      </View>

      {formData.contacts.map((contact, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text>Contact Person Name {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={contact.contactPersonName}
            onChangeText={(text) => handleChange(`contactPersonName-${index}`, text)}
          />

          <Text>Designation {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={contact.designation}
            onChangeText={(text) => handleChange(`designation-${index}`, text)}
          />

          <Text>Contact Number {index + 1}</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={contact.contactNumber}
            onChangeText={(text) => handleChange(`contactNumber-${index}`, text)}
          />
        </View>
      ))}

      <View style={styles.inputContainer}>
        <Text>Locations</Text>
        <TextInput
          style={styles.input}
          value={formData.locations}
          onChangeText={(text) => handleChange("locations", text)}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} />

      <Toast />
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

export default ClubAdminForm;
