import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Image, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Use @expo/vector-icons for icons
import Toast from 'react-native-toast-message'; // Correct import for Toast
import config from "./config";
import { Picker } from '@react-native-picker/picker';

const RegistrationForm = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validate = () => {
    let validationErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$#!%*?&]{8,}$/;

    if (!emailPattern.test(formData.email)) {
      validationErrors.email = "Invalid email address";
    }

    if (!mobilePattern.test(formData.mobile)) {
      validationErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!passwordPattern.test(formData.password)) {
      validationErrors.password =
        "Password must be at least 8 characters long and contain both letters and numbers";
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post(`${config.backendUrl}/register`, {
        role: selectedRole,
        ...formData,
      });
      Toast.show({ type: 'success', text1: response.data.message });

      setSelectedRole("");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });
      navigation.navigate("Login");
    } catch (error) {
      if (error.response) {
        Toast.show({ type: 'error', text1: error.response.data.message });
      } else {
        Toast.show({ type: 'error', text1: "An error occurred during registration." });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        keyboardType="Enter email"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={[styles.input, errors.mobile && styles.inputError]}
        placeholder="Enter mobile"
        keyboardType="numeric"
        value={formData.mobile}
        onChangeText={(value) => handleInputChange("mobile", value)}
        maxLength={10}
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

      <Text style={styles.label}>Confirm Password</Text>

      <View style={styles.passwordContainer}>
  <View style={styles.passwordInputContainer}>
    <TextInput
      style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
      placeholder="Confirm Password"
      secureTextEntry={!showConfirmPassword}
      value={formData.confirmPassword}
      onChangeText={(value) => handleInputChange("confirmPassword", value)}
    />
    <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
      <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={24} color="black" />
    </TouchableOpacity>
  </View>
</View>


      <Text style={styles.label}>Select Role*</Text>
      <View style={styles.roleContainer}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRole}
          onValueChange={(itemValue) => handleRoleChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a role..." value="Select a role..." />
          <Picker.Item label="Player" value="Player" />
          <Picker.Item label="Organization" value="Organization" />
          <Picker.Item label="Club" value="Club" />
          <Picker.Item label="Team" value="Team" />
          <Picker.Item label="Trainer" value="Trainer" />
        </Picker>
        </View>
      </View>

      <Button title="Submit" onPress={handleSubmit} />
      <Toast />
      <Text style={styles.linkText}>
        Already registered? Please <Text style={styles.link} onPress={() => navigation.navigate("Login")}>LOGIN</Text>
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
    marginBottom: 15
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    //borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden", // Prevent the icon from overflowing
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    //marginBottom: 15,
    paddingHorizontal: 10,
    paddingRight: 10,
  },
  eyeIcon: {
    position: "absolute", 
    right: 10, 
    zIndex: 1,
  },
  roleContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    borderColor: "#ccc", 
    borderWidth: 1, 
    borderRadius: 5, 
    overflow: "hidden", 
    backgroundColor: "#fff", 
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff8dc",
  },
  linkText: {
    textAlign: "center",
    paddingTop: 20,
  },
  link: {
    color: "red",
  },
});

export default RegistrationForm;

