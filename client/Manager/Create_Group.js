import React, { useState } from "react";
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

const TournamentScreen = ({ navigation }) => {
  const [tournamentName, setTournamentName] = useState("");
  const [groups, setGroups] = useState([]);
  const [imageUri, setImageUri] = useState(null); // State for storing the image URI

  const handleTournamentNameSubmit = () => {
    if (tournamentName !== "") {
      setGroups([
        ...groups,
        { name: tournamentName, teams: [{ teamName: "" }, { teamName: "" }] },
      ]);
      setTournamentName("");
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

  const pickImage = async () => {
    // Ask the user for permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      console.log("Image selected:", selectedImageUri);
      setImageUri(selectedImageUri); // Set the selected image URI to state
      uploadImage(selectedImageUri); // Call the function to upload the image
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();

    // Extract the file extension
    const filename = uri.split("/").pop();
    const fileType = filename.split(".").pop();

    formData.append("image", {
      uri,
      name: filename, // Use the actual file name
      type: `image/${fileType}`, // Set the correct image MIME type
    });

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
      console.log("Image uploaded successfully:", response.data.imageUrl);
      setImageUri(response.data.imageUrl); // Update the state with the image URL
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Upload Failed",
        "Could not upload the image. Please try again."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Upload Section */}
      <Text style={styles.text}>Add Team Logo</Text>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image style={styles.image} source={{ uri: imageUri }} />
        ) : (
          <Image style={styles.image} source={{ uri: "" }} />
        )}
        <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tournament Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name your group"
        value={tournamentName}
        onChangeText={(text) => setTournamentName(text)}
      />
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={handleTournamentNameSubmit}
      >
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
