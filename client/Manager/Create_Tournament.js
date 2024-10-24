import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from "react-native";
import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import config from "../components/config";

const Create_Tournament = () => {
  const [selectedValue, setSelectedValue] = useState("Select an option");
  const [selectedTime, setSelectedTime] = useState("09:00 AM");
  const [selectedTab, setSelectedTab] = useState("AM");
  const [selectedCourt, setSelectedCourt] = useState("Court 1");
  const [selectedDate, setSelectedDate] = useState("07 October");
  const [isAllDay, setIsAllDay] = useState(false);
  const [courts, setCourts] = useState([
    "Court 1",
    "Court 2",
    "Court 3",
    "Court 4",
    "Court 5",
  ]);
  const dates = ["07", "08", "09", "10", "11", "12"];
  const times = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];
  const [tournamentName, setTournamentName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState("");
  const [isOrganizationEnabled, setIsOrganizationEnabled] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [cancellationPolicy, setCancellationPolicy] = useState("");

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedTime(tab === "AM" ? "09:00 AM" : "01:00 PM");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const toggleAllDay = () => {
    setIsAllDay(!isAllDay);
  };

  const addCourt = () => {
    const newCourtNumber = courts.length + 1;
    setCourts([...courts, `Court ${newCourtNumber}`]);
  };

  // Function to fetch Manager ID
  // Function to fetch Manager ID
  const fetchManagerId = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/managerId`);
      const result = await response.json();

      if (result.success) {
        return result.managerId; // Return the managerId directly
      } else {
        console.error(result.message);
        return null; // Return null if fetching fails
      }
    } catch (error) {
      console.error("Error fetching manager ID:", error);
      return null; // Return null on error
    }
  };

  // Updated handleImageUpload function to use Expo Image Picker
  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Slightly reduced quality for better performance
        base64: false, // We don't need base64 as we're using FormData
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        // Get file information
        const fileInfo = await FileSystem.getInfoAsync(uri);

        // Check file size (5MB limit)
        if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert("Error", "Image size must be less than 5MB");
          return;
        }

        setImageUri(uri);
        console.log("Selected image:", uri);
      } else {
        console.log("Image selection canceled.");
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting tournament creation form...");

      // Validate the form before proceeding
      if (!validateForm()) {
        console.log("Form validation failed.");
        Alert.alert("Validation Error", "Please fill in all required fields.");
        return;
      }

      console.log("Form validation passed.");

      // Fetch the manager ID
      const managerId = await fetchManagerId(); // Get the managerId directly
      if (!managerId) {
        console.log("Manager ID could not be retrieved.");
        Alert.alert(
          "Error",
          "Could not retrieve Manager ID. Please try again."
        );
        return; // Stop if manager ID cannot be fetched
      }

      // Create a new FormData object
      const formData = new FormData();

      // Append basic text fields to formData
      formData.append("tournamentname", tournamentName);
      formData.append("tournamenttype", selectedValue);
      formData.append("eventdescription", eventDescription);
      formData.append("cancellationpolicy", cancellationPolicy);
      formData.append("eventlocation", eventLocation);
      formData.append("selectcourt", JSON.stringify({ name: selectedCourt }));
      formData.append("managerId", managerId);

      console.log("Manager id: ", managerId);
      // Format and append time data
      const timeData = {
        timeSlot: selectedTime.split(" ")[0],
        period: selectedTab,
      };
      formData.append("selecttime", JSON.stringify(timeData));
      formData.append("allday", isAllDay.toString());

      // Handle image upload with proper MIME type detection
      if (imageUri) {
        const fileExtension = imageUri.split(".").pop().toLowerCase();
        const mimeType =
          {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
          }[fileExtension] || "image/jpeg";

        formData.append("image", {
          uri:
            Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
          name: `tournament-${Date.now()}.${fileExtension}`,
          type: mimeType,
        });
      }

      // Send the form data to the server, including managerId in the URL
      const response = await fetch(
        `${config.backendUrl}/tournaments?managerId=${managerId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // "Content-Type" header can be omitted for FormData
          },
          body: formData,
        }
      );

      // Process the server response
      const result = await response.json();

      if (response.ok) {
        console.log("Tournament created successfully:", result);
        Alert.alert("Success", "Tournament created successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Reset the form after successful submission
              resetForm();
              // Navigate or perform other actions as needed
            },
          },
        ]);
      } else {
        throw new Error(result.message || "Failed to create tournament");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create tournament. Please try again."
      );
    }
  };

  // Helper function to reset the form fields
  const resetForm = () => {
    setImageUri(null);
    setTournamentName("");
    setSelectedValue("");
    setEventDescription("");
    setCancellationPolicy("");
    setEventLocation("");
    setSelectedCourt("");
    setSelectedTime("");
    setIsAllDay(false);
  };

  const validateForm = () => {
    if (!tournamentName?.trim()) {
      Alert.alert("Error", "Please enter a tournament name");
      return false;
    }

    if (!selectedValue) {
      Alert.alert("Error", "Please select a tournament type");
      return false;
    }

    if (!selectedCourt) {
      Alert.alert("Error", "Please select a court");
      return false;
    }

    if (!isAllDay && !selectedTime) {
      Alert.alert("Error", "Please select a time or enable all-day");
      return false;
    }

    if (!cancellationPolicy) {
      Alert.alert("Error", "Please select a cancellation policy");
      return false;
    }

    if (!eventLocation?.trim()) {
      Alert.alert("Error", "Please enter an event location");
      return false;
    }

    return true;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.text}>Add Photo / Team Logo</Text>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image style={styles.image} source={{ uri: imageUri }} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              {/* Use the same style as the image */}
              <Text>No Image Selected</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={handleImageUpload} // This opens the image picker
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          {/* Title Input with Border */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name your Tournament / League"
              value={tournamentName}
              onChangeText={setTournamentName}
            />
          </View>

          {/* Dropdown (Picker) with Border */}
          <View style={styles.inputContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              items={[
                { label: "Single Elimination", value: "Single Elimination" },
                { label: "Double Elimination", value: "Double Elimination" },
                { label: "Round Robin", value: "Round Robin" },
                { label: "Group Stage", value: "Group Stage" },
              ]}
              placeholder={{
                label: "Type", // Set the placeholder name here
                value: null,
              }}
              style={pickerSelectStyles}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Event Description"
              value={eventDescription} // Updated
              onChangeText={setEventDescription} // Updated
            />
          </View>

          <View style={styles.inputContainer}>
            <RNPickerSelect
              onValueChange={(value) => setCancellationPolicy(value)}
              items={[
                { label: "Strict", value: "Strict" },
                { label: "Flexible", value: "Flexible" },
              ]}
              placeholder={{
                label: "Cancellation Policy", // Set the placeholder name here
                value: null,
              }}
              style={pickerSelectStyles}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Event Location"
              value={eventLocation} // Updated
              onChangeText={setEventLocation} // Updated
            />
            <MaterialIcons
              name="location-on"
              size={24}
              color="gray"
              style={styles.icon}
            />
          </View>
        </View>

        {/* Toggle for Organization */}
        <View style={styles.allDayContainer}>
          <Text style={styles.allDayText}>Organization</Text>
          <Switch
            value={isOrganizationEnabled}
            onValueChange={() =>
              setIsOrganizationEnabled(!isOrganizationEnabled)
            }
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isOrganizationEnabled ? "#F8F8F8" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            style={{ transform: [{ scale: 1.3 }] }}
          />
        </View>

        {/* Conditionally Render the Player List, Group List, Save and Shuffle Buttons */}
        {isOrganizationEnabled && (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Number of Teams / Player"
                value={numberOfTeams} // Updated
                onChangeText={setNumberOfTeams} // Updated
              />
            </View>

            <View style={styles.players}>
              <View style={styles.playersrow}>
                <Image source={{ uri: "" }} style={styles.teamImage} />
                <Text style={styles.teamText}>Player 1</Text>
              </View>
              <View style={styles.playersrow}>
                <Image source={{ uri: "" }} style={styles.teamImage} />
                <Text style={styles.teamText}>Player 1</Text>
              </View>
            </View>
            <View style={styles.players}>
              <View style={styles.playersrow}>
                <Image source={{ uri: "" }} style={styles.teamImage} />
                <Text style={styles.teamText}>Player 1</Text>
              </View>
              <View style={styles.playersrow}>
                <Image source={{ uri: "" }} style={styles.teamImage} />
                <Text style={styles.teamText}>Player 1</Text>
              </View>
            </View>
            <View style={styles.players}>
              <View style={styles.playersrow}>
                <Image source={{ uri: "" }} style={styles.teamImage} />
                <Text style={styles.teamText}>Player 1</Text>
              </View>
              <View style={styles.playersrow}>
                <Image source={{ uri: "" }} style={styles.teamImage} />
                <Text style={styles.teamText}>Player 1</Text>
              </View>
            </View>
            <View style={styles.buttonscontainer}>
              <View style={styles.buttonrowrow}>
                <Icon
                  name="groups"
                  size={24}
                  color="#000"
                  style={styles.teamIcon}
                />
                <TouchableOpacity>
                  <Text style={styles.teamText}>Group List</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonrowrow}>
                <Icon
                  name="save"
                  size={24}
                  color="#000"
                  style={styles.teamIcon}
                />
                <TouchableOpacity>
                  <Text style={styles.teamText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.shuffle}>
              <Icon
                name="shuffle"
                size={24}
                color="#000"
                style={styles.teamIcon}
              />
              <TouchableOpacity>
                <Text style={styles.shufflebtn}>Shuffle</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.Court}>
          <Text style={styles.sectionTitle}>Select Court</Text>
          <View style={styles.courtRow}>
            {courts.map((court) => (
              <TouchableOpacity
                key={court}
                style={[
                  styles.courtButton,
                  selectedCourt === court && styles.courtButtonSelected,
                ]}
                onPress={() => setSelectedCourt(court)}
              >
                <Text
                  style={[
                    styles.courtButtonText,
                    selectedCourt === court && styles.selectedButtonText,
                  ]}
                >
                  {court}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addCourtButton} onPress={addCourt}>
              <Text style={styles.addCourtText}>+ Add Court</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time of Day</Text>
          <View style={styles.timeTabsContainer}>
            <TouchableOpacity
              style={[
                styles.timeTab,
                selectedTab === "AM"
                  ? styles.timeTabActive
                  : styles.timeTabInactive,
              ]}
              onPress={() => handleTabChange("AM")}
            >
              <Text
                style={
                  selectedTab === "AM"
                    ? styles.timeTabTextActive
                    : styles.timeTabText
                }
              >
                AM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeTab,
                selectedTab === "PM"
                  ? styles.timeTabActive
                  : styles.timeTabInactive,
              ]}
              onPress={() => handleTabChange("PM")}
            >
              <Text
                style={
                  selectedTab === "PM"
                    ? styles.timeTabTextActive
                    : styles.timeTabText
                }
              >
                PM
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeRow}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === `${time} ${selectedTab}` &&
                    styles.timeButtonSelected,
                ]}
                onPress={() => handleTimeSelect(`${time} ${selectedTab}`)}
              >
                <Text style={styles.timeButtonText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Day Switch */}
        <View style={styles.allDayContainer}>
          <Text style={styles.allDayText}>All Day</Text>
          <Switch
            value={isAllDay}
            onValueChange={toggleAllDay}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isAllDay ? "#F8F8F8" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            style={{ transform: [{ scale: 1.3 }] }} // Adjust the scale factor as needed
          />
        </View>

        {/* Generate Tournament Button */}
        <TouchableOpacity style={styles.generateButton} onPress={handleSubmit}>
          <Text style={styles.generateButtonText}>Generate Tournament</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#333", // Text color for iOS
    paddingRight: 30, // Adjust padding for dropdown arrow
  },
  inputAndroid: {
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#333", // Text color for Android
    paddingRight: 30, // Adjust padding for dropdown arrow
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  text: {
    fontSize: 17,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 35,
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    bottom: 5, // Positioning the icons at the bottom
    left: "13%", // Adjust to your desired position
    backgroundColor: "#000", // Semi-transparent background
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
  },
  image: {
    height: 88,
    width: 88,
    borderRadius: 44,
    backgroundColor: "#D9D9D9",
  },
  form: {
    marginTop: 20,
    width: "100%",
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  icon: {
    paddingLeft: 90,
    position: "absolute",
    left: "80%",
  },

  input: {
    height: 50,
    paddingLeft: 20,
    borderRadius: 5,
    fontSize: 16,
    color: "#333", // Input text color
  },
  picker: {
    height: 50, // Match input height
    width: "100%",
  },
  players: {
    width: "100%",
    flexDirection: "row",
    marginTop: 35,

    gap: 60,
    justifyContent: "space-between",
  },
  buttonscontainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: 35,
    justifyContent: "space-between",
  },
  shuffle: {
    marginTop: 15,
    height: 48,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  shufflebtn: {
    fontSize: 16,
  },
  playersrow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  buttonrowrow: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  teamImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
  },
  teamText: {
    fontSize: 16,
  },
  Court: {
    marginTop: 35,
    marginBottom: 15,
  },
  selectcourt: {
    fontSize: 17,
    textAlign: "left",
    alignItems: "flex-start",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  courtRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  courtButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 10,
  },
  courtButtonSelected: {
    backgroundColor: "#1E90FF",
    color: "#fff",
  },
  courtButtonText: {
    color: "#333",
  },
  addCourtButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#ddd",
    height: 40,
  },
  addCourtText: {
    color: "#000",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  dateButtonSelected: {
    backgroundColor: "#1E90FF",
  },
  dateText: {
    color: "#333",
  },
  timeTabsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    width: "50%",
  },
  timeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  timeTabActive: {
    backgroundColor: "#1E90FF",
  },
  timeTabInactive: {
    backgroundColor: "#E0E0E0",
  },
  timeTabText: {
    color: "#333",
  },
  timeTabTextActive: {
    color: "#FFF",
  },
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "25%",
    marginBottom: 10,
    alignItems: "center",
  },
  timeButtonSelected: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  timeButtonText: {
    color: "#333",
  },
  allDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  allDayText: {
    fontSize: 16,
  },
  generateButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    width: "100%",
  },
  generateButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
  selectedButtonText: {
    color: "#fff",
  },
  switchStyle: {
    width: 52,
    height: 32,
  },
  icon: {
    marginRight: 10, // Adds spacing between the icon and the input field
  },
});

export default Create_Tournament;
