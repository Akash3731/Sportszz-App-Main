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
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker"; // Use expo-image-picker to select images
import axios from "axios";
import config from "../components/config.cjs";
import * as FileSystem from "expo-file-system";

const TournamentScreen = ({ navigation, route }) => {
  const [groupName, setgroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // const deleteGroup = (index) => {
  //   const newGroups = groups.filter((_, i) => i !== index);
  //   setGroups(newGroups);
  // };

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

  // Update the uploadImage function to use the new caching system
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
        `${config.backendUrl}/add-groups`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const imageUrl = response.data.group.image;
        console.log("Image uploaded successfully:", imageUrl);

        // Try to cache the image
        const cachedUri = await cacheImage(imageUrl);
        if (cachedUri) {
          setImageUri(imageUrl); // Set the remote URL for future reference
          console.log("Image cached at:", cachedUri);
        }
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
  // Frontend changes - Update the caching function
  const cacheImage = async (imageUrl) => {
    try {
      // Create a unique filename for the cached image
      const filename = `cached_${imageUrl.split("/").pop()}`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      console.log("Attempting to cache image from:", imageUrl);

      // First check if the file already exists in cache
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        console.log("Image already cached at:", fileUri);
        return fileUri;
      }

      // Download the image with proper error handling
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status === 200) {
        console.log("Image cached successfully at:", fileUri);
        return fileUri;
      } else {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }
    } catch (error) {
      console.error("Error during caching image:", error);

      // Provide more specific error messages
      if (error.response?.status === 404) {
        Alert.alert(
          "Cache Failed",
          "The image could not be found on the server. Please try uploading again."
        );
      } else {
        Alert.alert(
          "Cache Failed",
          "An error occurred while caching the image. Please check your connection and try again."
        );
      }
      return null;
    }
  };

  const addGroup = async () => {
    setLoading(true); // Start loading
    if (groupName === "") {
      Alert.alert("Error", "Please provide a group name.");
      setLoading(false); // Stop loading on error
      return;
    }

    console.log("Before Adding Group: ", { groupName, groups });
    await new Promise((resolve) => setTimeout(resolve, 100));

    const formData = new FormData();
    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const fileType = filename.split(".").pop();
      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: `image/${fileType}`,
      });
    }

    formData.append("name", groupName);
    formData.append("tournamentId", tournamentId);

    try {
      const response = await axios.post(
        `${config.backendUrl}/add-groups`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Group added successfully!");
        setImageUri(null);
        setgroupName("");

        // Update local state with the newly added group
        setGroups((prevGroups) => {
          const groupExists = prevGroups.some(
            (group) => group.groupname === groupName
          );
          if (!groupExists) {
            return [
              ...prevGroups,
              { groupname: groupName, _id: response.data.group._id, teams: [] },
            ];
          }
          return prevGroups; // If it exists, return previous groups
        });

        // Optionally refetch groups to ensure all data is up-to-date
        // fetchGroups(); // Uncomment this if you want to fetch again
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error adding group:", error);
      Alert.alert(
        "Upload Failed",
        "Could not add the group. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading in both success and error cases
    }
  };

  const deleteGroup = async (tournamentId, groupId) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.delete(
        `${config.backendUrl}/tournaments/${tournamentId}/groups/${groupId}`
      );
      if (response.data.success) {
        console.log(response.data.message);
        fetchGroups(); // Re-fetch groups after deletion
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      Alert.alert("Error", "Could not delete group. Please try again.");
    } finally {
      setLoading(false); // Stop loading in both success and error cases
    }
  };

  const fetchGroups = async () => {
    if (!tournamentId) {
      console.error("Tournament ID is not available for fetching groups.");
      return; // Exit the function if tournamentId is null
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await axios.get(
        `${config.backendUrl}/tournaments/${tournamentId}/groups`
      );
      if (response.data.success) {
        setGroups(response.data.groups); // Set groups from the response
        console.log("Fetched groups:", response.data.groups);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Could not fetch groups. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    console.log("Current tournamentId:", tournamentId); // Log the current value
    if (tournamentId) {
      console.log("Fetching groups for tournament ID:", tournamentId);
      fetchGroups(); // Fetch groups whenever tournamentId changes
    } else {
      console.log("Tournament ID is not available yet.");
      setGroups([]); // Clear previous groups if tournamentId is not available
    }
  }, [tournamentId]); // This effect runs whenever tournamentId changes

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Upload Section */}
      <Text style={styles.text}>Add Group Logo</Text>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image style={styles.image} source={{ uri: imageUri }} />
        ) : (
          <View style={styles.image} /> // Use View for empty state
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
        onChangeText={(text) => setGroupName(text)}
      />
      <TouchableOpacity style={styles.createGroupButton} onPress={addGroup}>
        <Text style={styles.createGroupButtonText}>Create Group</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Dynamic Group Sections */}
      {groups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.groupContainer}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>
              Group Name: <Text style={styles.boldText}>{group.groupname}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirm Deletion",
                  "Are you sure you want to delete this group?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel", // Optional styling for the cancel button
                    },
                    {
                      text: "Delete",
                      onPress: async () => {
                        await deleteGroup(tournamentId, group._id);
                        fetchGroups(); // Re-fetch the groups after deletion
                      },
                    },
                  ],
                  { cancelable: true } // Allows dismissal by tapping outside
                );
              }}
            >
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
