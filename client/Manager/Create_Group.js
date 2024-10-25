import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker"; // Use expo-image-picker to select images
import axios from "axios";
import config from "../components/config";
import * as FileSystem from "expo-file-system";

const TournamentScreen = ({ navigation, route }) => {
  const [groupName, setgroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);

  // Fetch tournament ID directly from the database using the provided ID from route params
  useEffect(() => {
    const fetchTournamentId = async () => {
      const tournamentId = route.params?.id; // Use optional chaining to avoid undefined error
      if (!tournamentId) {
        Alert.alert("Error", "Tournament ID is not available.");
        return; // Exit early if ID is not defined
      }

      try {
        console.log("Fetching tournament with ID:", tournamentId); // Log the ID being fetched
        const response = await axios.get(
          `${config.backendUrl}/tournaments/${tournamentId}`
        );
        if (response.data.success) {
          setTournamentId(response.data.tournamentId);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        console.error(
          "Error fetching tournament ID:",
          error.response ? error.response.data : error.message
        );
        Alert.alert("Error", "Could not fetch tournament ID.");
      }
    };

    fetchTournamentId();
  }, [route.params?.id]);

  const handlegroupNameSubmit = () => {
    if (groupName !== "") {
      const newGroup = {
        name: groupName,
        teams: [{ teamName: "" }, { teamName: "" }],
      };
      setGroups([...groups, newGroup]);
      console.log("New Group Added:", newGroup); // Log the new group being added
      setgroupName(""); // Reset the tournament name after submission
    }
  };

  const addTeam = (index) => {
    const newGroups = [...groups];
    newGroups[index].teams.push({ teamName: "" });
    setGroups(newGroups);
  };

  const removeTeam = (groupIndex, teamIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].teams.splice(teamIndex, 1);
    setGroups(newGroups);
  };

  const deleteGroup = (index) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
  };

  // Update your existing pickImage function
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      console.log("Image selected:", selectedImageUri);
      setImageUri(selectedImageUri);
      await uploadImage(selectedImageUri); // Pass only the image URI to the upload function
    }
  };

  const handleImageUpload = () => {
    if (groupName === "") {
      Alert.alert(
        "Error",
        "Please enter a group name before uploading an image."
      );
      return;
    }
    pickImage(); // Start the image picking and uploading process
  };

  // Upload function
  const uploadImage = async (uri) => {
    const formData = new FormData();
    const filename = uri.split("/").pop();
    const fileType = filename.split(".").pop();

    formData.append("image", {
      uri,
      name: filename,
      type: `image/${fileType}`,
    });
    formData.append("name", groupName);
    formData.append("tournamentId", tournamentId);

    try {
      const response = await axios.post(
        `${config.backendUrl}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("Image uploaded successfully:", response.data.group.image);
        setImageUri(response.data.group.image);

        // Cache the image after uploading
        await cacheImage(response.data.group.image);
      } else {
        Alert.alert("Upload Failed", response.data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert(
        "Upload Failed",
        "Could not upload the image. Please try again."
      );
    }
  };

  // Cache the image using expo-file-system
  const cacheImage = async (imageUrl) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${imageUrl
        .split("/")
        .pop()}`;
      console.log("Attempting to cache image from:", imageUrl);

      // Download the image
      const response = await FileSystem.downloadAsync(imageUrl, fileUri);

      // Check the response status
      if (response.status === 200) {
        console.log("Image cached successfully at:", fileUri);
        return fileUri; // Return the cached file URI
      } else {
        console.error("Failed to cache image, status:", response.status);
        Alert.alert("Cache Failed", "Could not cache the image.");
      }
    } catch (error) {
      console.error("Error during caching image:", error);
      Alert.alert("Cache Failed", "An error occurred while caching the image.");
    }
  };

  const addGroup = async () => {
    // Ensure groupName exists before submitting the group
    if (groups.length === 0 && groupName !== "") {
      handlegroupNameSubmit(); // Add the group using the current groupName
    }

    console.log("Before Adding Group: ", { groupName, groups });

    // Wait a moment to ensure state is updated before validation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Validate if group name and teams are present
    if (groups.length === 0) {
      Alert.alert(
        "Error",
        "Please provide a group name and at least one team."
      );
      console.log("Validation failed: group name or teams are missing.");
      return;
    }

    const formData = new FormData();

    // Prepare image data if an image was selected
    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const fileType = filename.split(".").pop();

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: `image/${fileType}`,
      });
      console.log("Image selected:", {
        uri: imageUri,
        name: filename,
        type: `image/${fileType}`,
      });
    } else {
      console.log("No image selected.");
    }

    // Append group name and tournament ID to form data
    formData.append("name", groupName); // Use 'name' for group name
    formData.append("tournamentId", tournamentId); // Use the tournament ID
    console.log("FormData after appending group name and tournament ID:", {
      name: groupName,
      tournamentId,
    });

    // Include teams in the form data
    groups.forEach((group) => {
      group.teams.forEach((team) => {
        formData.append("teams[]", JSON.stringify(team)); // Append each team
        console.log("Appending team to FormData:", JSON.stringify(team));
      });
    });

    try {
      console.log("Sending data to server...");
      const response = await axios.post(
        `${config.backendUrl}/add-groups`, // Ensure this endpoint exists on your server
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from server:", response.data); // Log the server response

      if (response.data.success) {
        Alert.alert("Success", "Group added successfully!");
        console.log("Group added successfully:", response.data.group);

        // Optionally reset state or navigate away
        setGroups([]); // Clear groups after successful submission
        setImageUri(null); // Clear the image
        setgroupName(""); // Clear the group name
      } else {
        Alert.alert("Error", response.data.message);
        console.log("Error from server:", response.data.message); // Log error message
      }
    } catch (error) {
      console.error("Error adding group:", error);
      Alert.alert(
        "Upload Failed",
        "Could not add the group. Please try again."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Upload Section */}
      <Text style={styles.text}>Add Group Logo</Text>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image style={styles.image} source={{ uri: imageUri }} />
        ) : (
          <Image style={styles.image} source={{ uri: "" }} />
        )}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleImageUpload}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tournament Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name your group"
        value={groupName}
        onChangeText={(text) => setgroupName(text)}
      />
      <TouchableOpacity style={styles.createGroupButton} onPress={addGroup}>
        <Text style={styles.createGroupButtonText}>Create Group</Text>
      </TouchableOpacity>

      {/* Dynamic Group Sections */}
      {groups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.groupContainer}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>
              Group Name: <Text style={styles.boldText}>{group.name}</Text>
            </Text>
            <TouchableOpacity onPress={() => deleteGroup(groupIndex)}>
              <MaterialIcons name="delete" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {group.teams.map((team, teamIndex) => (
            <View key={teamIndex} style={styles.teamRow}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.teamInput}
                  placeholder="Enter Team Name"
                  value={team.teamName}
                  onChangeText={(text) => {
                    const newGroups = [...groups];
                    newGroups[groupIndex].teams[teamIndex].teamName = text;
                    setGroups(newGroups);
                  }}
                />
                <MaterialIcons
                  name="visibility"
                  size={24}
                  color="gray"
                  style={styles.icon}
                />
                <Text
                  style={styles.view}
                  onPress={() => {
                    const playerName = team.teamName || "Player 1";
                    navigation.navigate("Player_Names", { playerName });
                  }}
                >
                  View Player
                </Text>

                {/* Only show minus button if there are more than 2 teams */}
                {group.teams.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removeTeam(groupIndex, teamIndex)}
                  >
                    <MaterialIcons
                      name="remove-circle-outline"
                      size={24}
                      color="red"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addTeamButton}
            onPress={() => addTeam(groupIndex)}
          >
            <Text style={styles.addTeamButtonText}>+ Add Team</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Match-ups Section */}
      <Text style={styles.matchupText}>Match-ups:</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#EFEFF4",
  },
  text: {
    fontSize: 17,
    textAlign: "center",
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 35,
    alignItems: "center",
  },
  image: {
    height: 88,
    width: 88,
    borderRadius: 44,
    backgroundColor: "#D9D9D9",
    position: "relative", // Position relative for absolute positioning of icon
  },
  iconContainer: {
    position: "absolute",
    bottom: 5, // Positioning the icons at the bottom
    right: "37%", // Adjust to your desired position
    backgroundColor: "#000", // Semi-transparent background
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
  },

  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  createGroupButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  createGroupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  groupContainer: {
    marginBottom: 20,
    marginTop: 30,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  groupName: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  teamRow: {
    flexDirection: "column",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  teamInput: {
    backgroundColor: "#fff",
    flex: 1,
    height: 50,
    borderColor: "#ddd",
    borderBottomWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  icon: {
    marginLeft: 10,
  },
  view: {
    marginLeft: 5,
    color: "gray",
    fontSize: 16,
  },
  addTeamButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  addTeamButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  matchupText: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default TournamentScreen;
