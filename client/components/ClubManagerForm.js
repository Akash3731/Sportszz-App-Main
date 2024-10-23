import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import config from "./config";
import { useAuth } from "../Context/authContext";
import Toast from 'react-native-toast-message';

const ClubManagerForm = () => {
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    sport: "",
    contactPersonName: "",
    designation: "",
    contactNumber: "",
    emailID: "",
    locations: "",
    roles: "",
    comments: "",
    idendtityname: "",
    idCard: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      id: auth.id,
    };

    try {
      const response = await axios.post(
        `${config.backendUrl}/update/${auth.role}`,
        updatedFormData
      );
      Toast.show({
        type: 'success',
        text1: 'Form submitted successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error submitting form',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text>Sport/s</Text>
        <TextInput
          style={styles.input}
          value={formData.sport}
          onChangeText={(text) => handleChange("sport", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Contact Person Name</Text>
        <TextInput
          style={styles.input}
          value={formData.contactPersonName}
          onChangeText={(text) => handleChange("contactPersonName", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Designation</Text>
        <TextInput
          style={styles.input}
          value={formData.designation}
          onChangeText={(text) => handleChange("designation", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Contact Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={formData.contactNumber}
          onChangeText={(text) => handleChange("contactNumber", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Email ID</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={formData.emailID}
          onChangeText={(text) => handleChange("emailID", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Locations</Text>
        <TextInput
          style={styles.input}
          value={formData.locations}
          onChangeText={(text) => handleChange("locations", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Roles</Text>
        <TextInput
          style={styles.input}
          value={formData.roles}
          onChangeText={(text) => handleChange("roles", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Comments</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={formData.comments}
          onChangeText={(text) => handleChange("comments", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Identity Name</Text>
        <TextInput
          style={styles.input}
          value={formData.idendtityname}
          onChangeText={(text) => handleChange("idendtityname", text)}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>ID Card</Text>
        <TextInput
          style={styles.input}
          value={formData.idCard}
          onChangeText={(text) => handleChange("idCard", text)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Toast />
    </ScrollView>
  );
};

const styles = {
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};

export default ClubManagerForm;
