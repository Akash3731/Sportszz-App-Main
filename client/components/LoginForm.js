import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import config from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Context/authContext';

const LoginForm = () => {
  const navigation = useNavigation();
  const { login } = useAuth(); // Access the login function from AuthContext
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    let validationErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      validationErrors.email = "Invalid email address";
    }

    if (formData.password.trim().length === 0) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post(`${config.backendUrl}/login`, formData);
      Toast.show({ type: 'success', text1: response.data.message });
      
      // Store manager ID in AsyncStorage
      const managerId = response.data.user.id; // Assuming the correct ID is returned as `id`
      await AsyncStorage.setItem("manager-id", managerId); // Save to AsyncStorage

      // Use the login function from AuthContext
      const userData = { ...response.data.user, token: response.data.token }; // Assuming token is returned from the backend
      await login(userData); // Call the login function with user data

      navigation.navigate("Home"); 
    } catch (error) {
      if (error.response) {
        Toast.show({ type: 'error', text1: error.response.data.message });
      } else {
        console.error('Login error:', error.message);
        Toast.show({ type: 'error', text1: "An error occurred during login." });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Login</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, errors.password && styles.inputError]}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
          <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Button title="Login" onPress={handleSubmit} />
      <Toast />
      <Text style={styles.linkText}>
        Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate("Register")}>Register</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff8dc",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: "red",
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingRight: 10,
  },
  eyeIcon: {
    position: "absolute", 
    right: 10, 
    zIndex: 1,
  },
  linkText: {
    textAlign: "center",
    paddingTop: 20,
  },
  link: {
    color: "red",
  },
});

export default LoginForm;






