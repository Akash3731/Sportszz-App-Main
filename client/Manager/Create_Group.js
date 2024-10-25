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
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]); // State to hold multiple groups
  const [imageUri, setImageUri] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTournamentId = async () => {
      const tournamentId = route.params?.id; // Get the tournament ID from route params
      console.log("Navigated to TournamentScreen with ID:", tournamentId); // Debug log

      if (!tournamentId) {
        Alert.alert("Error", "Tournament ID is not available.");
        return; // Exit early if ID is not defined
      }

      try {
        console.log("Fetching tournament with ID:", tournamentId);
        const response = await axios.get(
          `${config.backendUrl}/tournaments/${tournamentId}`
        );

        console.log("Response from tournament fetch:", response.data); // Debug log

        if (response.data.success) {
          setTournamentId(response.data.tournamentId);
          console.log("Setting tournament ID:", response.data.tournamentId); // Debug log
          fetchGroups(response.data.tournamentId); // Fetch groups once tournamentId is set
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

  useEffect(() => {
    if (tournamentId) {
      fetchGroups(tournamentId); // Call fetchGroups when tournamentId is set
    }
  }, [tournamentId]);

  const handlegroupNameSubmit = () => {
    if (groupName !== "") {
      // Initialize with two teams (two input fields)
      setGroups([
        ...groups,
        { name: groupName, teams: [{ teamName: "" }, { teamName: "" }] },
      ]);
      setgroupName(""); // Clear the input after setting the name
    }
  };

  const addTeam = (index) => {
    const newGroups = [...groups];
    // Add only one additional team input
    newGroups[index].teams.push({ teamName: "" });
    setGroups(newGroups);
  };

  const removeTeam = (groupIndex, teamIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].teams.splice(teamIndex, 1); // Remove the specified team
    setGroups(newGroups);
  };

  const deleteGroups = (index) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
  };

  // Update your existing pickImage function
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
      // Remove the uploadImage call from here as it's causing duplicate group creation
      // await uploadImage(selectedImageUri);
    }
  };

  const handleImageUpload = () => {
    if (groupName.trim() === "") {
      Alert.alert(
        "Error",
        "Please enter a group name before uploading an image."
      );
      return;
    }
    pickImage();
  };

  // const uploadImage = async (uri) => {
  //   const formData = new FormData();
  //   const filename = uri.split("/").pop();
  //   const fileType = filename.split(".").pop();

  //   formData.append("image", {
  //     uri,
  //     name: filename,
  //     type: `image/${fileType}`,
  //   });
  //   formData.append("name", groupName.trim());
  //   formData.append("tournamentId", tournamentId);

  //   try {
  //     const response = await axios.post(
  //       `${config.backendUrl}/add-groups`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       const imageUrl = response.data.group.image;
  //       console.log("Image uploaded successfully:", imageUrl);

  //       const cachedUri = await cacheImage(imageUrl);
  //       if (cachedUri) {
  //         setImageUri(imageUrl);
  //         console.log("Image cached at:", cachedUri);
  //       }
  //     } else {
  //       Alert.alert("Upload Failed", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     Alert.alert(
  //       "Upload Failed",
  //       error.response?.data?.message ||
  //         "Could not upload the image. Please try again."
  //     );
  //   }
  // };

  const cacheImage = async (imageUrl) => {
    try {
      const filename = `cached_${imageUrl.split("/").pop()}`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      console.log("Attempting to cache image from:", imageUrl);

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        console.log("Image already cached at:", fileUri);
        return fileUri;
      }

      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status === 200) {
        console.log("Image cached successfully at:", fileUri);
        return fileUri;
      } else {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }
    } catch (error) {
      console.error("Error during caching image:", error);

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
    setLoading(true);
    console.log("Group Name:", groupName);

    const trimmedGroupName = groupName.trim();

    if (trimmedGroupName === "") {
      Alert.alert("Error", "Please provide a group name.");
      setLoading(false);
      return;
    }

    try {
      // Get current groups first
      const groupsResponse = await axios.get(
        `${config.backendUrl}/tournaments/${tournamentId}/groups`
      );

      const currentGroups = groupsResponse.data.groups || [];

      // Improved duplicate check with exact matching and proper string comparison
      const isDuplicate = currentGroups.some((group) => {
        const existingName = (group.groupname || group.name || "")
          .trim()
          .toLowerCase();
        const newName = trimmedGroupName.toLowerCase();
        return existingName === newName;
      });

      if (isDuplicate) {
        Alert.alert("Error", "A group with this name already exists.");
        setLoading(false);
        return;
      }

      // Prepare form data for new group
      const formData = new FormData();

      if (imageUri) {
        const filename = imageUri.split("/").pop();
        const fileType = filename.split(".").pop();
        const isLocalFile = imageUri.startsWith("file://");

        if (isLocalFile) {
          console.log("Appending local image:", {
            uri: imageUri,
            name: filename,
            type: `image/${fileType}`,
          });

          formData.append("image", {
            uri: imageUri,
            name: filename,
            type: `image/${fileType}`,
          });
        } else {
          console.log("Using existing remote image URL");
        }
      }

      formData.append("name", trimmedGroupName);
      formData.append("tournamentId", tournamentId);

      // Add the group
      const response = await axios.post(
        `${config.backendUrl}/add-groups`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from server:", response.data);

      if (response.data.success) {
        // Cache the image if it was part of the response
        if (response.data.group && response.data.group.image) {
          await cacheImage(response.data.group.image);
        }

        Alert.alert("Success", "Group added successfully!");
        setImageUri(null);
        setGroupName("");
        await fetchGroups(tournamentId);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error adding group:", error);
      Alert.alert(
        "Upload Failed",
        error.response?.data?.message ||
          "Could not add the group. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Add cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Clear the form state when component unmounts
      setImageUri(null);
      setGroupName("");
    };
  }, []);

  const deleteGroup = async (tournamentId, groupId) => {
    console.log(
      "Deleting group with Tournament ID:",
      tournamentId,
      "and Group ID:",
      groupId
    );

    try {
      const response = await axios.delete(
        `${config.backendUrl}/tournaments/${tournamentId}/groups/${groupId}`
      );

      if (response.data.success) {
        console.log("Group deleted successfully!");

        // Clear groupId after successful deletion
        setGroupId(null); // Clear groupId state

        // Fetch updated groups list after deletion
        await fetchGroups(tournamentId); // Ensure this is called after the group is successfully deleted
      } else {
        console.error("Failed to delete group:", response.data.message);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      Alert.alert(
        "Delete Failed",
        error.response?.data?.message ||
          "Could not delete group. Please try again."
      );
    }
  };

  // Function to fetch groups
  // Function to fetch groups
  const fetchGroups = async (tournamentId) => {
    try {
      const response = await axios.get(
        `${config.backendUrl}/tournaments/${tournamentId}/groups`
      );
      if (response.data.success) {
        setGroups(response.data.groups);
        console.log("Fetched groups:", response.data.groups);
      } else {
        console.error("Error in fetchGroups:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Could not fetch groups. Please try again.");
    }
  };

  // Use effect to fetch groups
  useEffect(() => {
    if (tournamentId) {
      fetchGroups(tournamentId); // Call fetchGroups with tournamentId
    }
  }, [tournamentId]);

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
                setGroupId(group._id); // Set groupId to the ID of the group being deleted
                deleteGroup(tournamentId, group._id); // Delete the group
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
    position: "relative",
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
  image: {
    height: 88,
    width: 88,
    borderRadius: 44,
    backgroundColor: "#D9D9D9",
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
