import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import config from "./config"; // Ensure you have your backend URL in this file
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing data locally

const OrganizerForm = ({ onSuccess }) => { // Accept onSuccess as a prop
  const { auth } = useAuth(); // Assuming auth contains user details like role and id
  const [formData, setFormData] = useState({
    clubName: "",
    organizerName: "",
    address: "",
    city: "",
    registrationID: "",
    typeOfRegistration: "",
    registrationDate: "",
    sports: "",
    noOfPlayers: "",
    contactPersonName: "",
    designation: "",
    contactNumber: "",
    locations: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrganizerData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("organizerData");
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading organizer data:", error);
      }
    };

    loadOrganizerData();
  }, []);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validate for empty fields and proper data formats
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
    if (emptyFields.length) {
      Alert.alert("Error", "Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Check for numeric fields
    const { contactNumber, noOfPlayers } = formData;
    if (isNaN(contactNumber) || isNaN(noOfPlayers)) {
      Alert.alert("Error", "Contact number and number of players must be numeric.");
      setLoading(false);
      return;
    }

    try {
      const updatedFormData = {
        ...formData,
        id: auth.id,
        role: auth.role, // Include user role
      };

      console.log("Submitting data:", updatedFormData); // Log the data being sent

      const response = await axios.post(
        `${config.backendUrl}/update/${auth.role}`,
        updatedFormData,
        {
          headers: {
            'Content-Type': 'application/json', // Ensure the correct content type is set
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Organizer registered successfully");
        await AsyncStorage.setItem("organizerData", JSON.stringify(formData));

        // Reset form after submission
        setFormData({
          clubName: "",
          organizerName: "",
          address: "",
          city: "",
          registrationID: "",
          typeOfRegistration: "",
          registrationDate: "",
          sports: "",
          noOfPlayers: "",
          contactPersonName: "",
          designation: "",
          contactNumber: "",
          locations: "",
        });

        onSuccess(); // Call the onSuccess prop to close the modal
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        // Server responded with a status other than 200
        Alert.alert("Error", `Failed to register organizer: ${error.response.data.message || 'Please try again.'}`);
      } else if (error.request) {
        // Request was made but no response received
        Alert.alert("Error", "No response from the server. Please check your network connection.");
      } else {
        // Something happened in setting up the request
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.heading}>Organizer Registration</Text>
      {Object.keys(formData).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <TextInput
            placeholder={key.replace(/([A-Z])/g, " $1")}
            value={formData[key]}
            onChangeText={(value) => handleChange(key, value)}
            style={styles.input}
          />
        </View>
      ))}
      <Button
        title={loading ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
});

export default OrganizerForm;

