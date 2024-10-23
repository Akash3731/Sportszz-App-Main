/*import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { useNavigation } from "@react-navigation/native";
import config from "./config";
import PlayerForm from "./PlayerForm";
import ClubAdminForm from "./ClubAdminForm";
import TrainerForm from "./TrainerForm";
import OrganizerForm from "./OrganizerForm";
import ClubManagerForm from "./ClubManagerForm";
import TeamsForm from "./TeamsForm";

const TopMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updateProfileModalVisible, setUpdateProfileModalVisible] =
    useState(false);
  const [addManagerVisible, setAddManagerVisible] = useState(false);
  const [viewManagersVisible, setViewManagersVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [managerDetails, setManagerDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [managers, setManagers] = useState([]);
  const { logout, auth } = useAuth();
  const navigation = useNavigation();
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleUpdateProfileModal = () => {
    setUpdateProfileModalVisible(!updateProfileModalVisible);
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
  };

  const handleAddManager = () => {
    setAddManagerVisible(true);
    setModalVisible(false);
  };

  const handleViewManagers = () => {
    fetchManagers();
    setViewManagersVisible(true);
    setModalVisible(false);
  };

  const handleManagerInputChange = (field, value) => {
    setManagerDetails({ ...managerDetails, [field]: value });
  };

  const handleSubmitManager = async () => {
    try {
      const managerExists = auth?.managers?.some(
        (manager) => manager.email === managerDetails.email
      );

      if (managerExists) {
        // If the email already exists, show an alert and stop the process
        alert(
          "User with this email already exists. Please choose another one."
        );
        return; // Prevent further execution
      }

      const response = await axios.post(`${config.backendUrl}/managers`, {
        name: managerDetails.name,
        email: managerDetails.email,
        password: managerDetails.password,
      });
      console.log(response.data);
      setAddManagerVisible(false);
      setManagerDetails({ name: "", email: "", password: "" });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        // Handle other errors
        alert(
          "Error in handleSubmitManager: " +
            (error.response?.data || error.message)
        );
      }
    }
  };

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.backendUrl}/club-admin/managers`
      );
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivation = async (managerId, isActive) => {
    try {
      const response = await axios.put(
        `${config.backendUrl}/managers/${managerId}/activate`,
        {
          isActive,
        }
      );
      console.log(response.data.message);
      fetchManagers();
    } catch (error) {
      console.error("Error updating manager status:", error);
    }
  };

  const handleAddTask = (managerId) => {
    setSelectedManagerId(managerId);
    setTaskModalVisible(true);
    console.log("Add task for manager with ID:", managerId);
  };

  const handleSubmitTask = async () => {
    try {
      if (taskDescription.length > 1000) {
        alert("Task description exceeds 1000 words limit.");
        return;
      }
      // Submit the task to the backend (replace with your API endpoint)
      const response = await axios.post(
        `${config.backendUrl}/managers/${selectedManagerId}/tasks`,
        {
          managerId: selectedManagerId,
          description: taskDescription,
        }
      );
      console.log(response.data);
      setTaskDescription("");
      setTaskModalVisible(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteManager = async (managerId) => {
    try {
      await axios.delete(`${config.backendUrl}/managers/${managerId}`);
      fetchManagers();
    } catch (error) {
      console.error("Error deleting manager:", error);
    }
  };


  // Function to toggle notification screen
  const openNotificationScreen = () => {
    navigation.navigate('Notification');
  };

  const goBack = () => {
    setShowNotifications(false);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sportszz</Text>
      <TouchableOpacity style={styles.iconContainer} onPress={openNotificationScreen }>
        <Icon name="bell" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={toggleModal}>
        <Icon name="user" size={24} color="#fff" />
      </TouchableOpacity>

      {showNotifications && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Notifications</Text>
            <Text>No new notifications.</Text> 
          </View>
        </View>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Welcome, {auth?.name || "User"}
            </Text>
            <Text style={styles.modalTitle}>
              Login as: {auth?.role || "User"}
            </Text>

            {auth?.role?.toLowerCase() === "club" && (
              <>
                <TouchableOpacity
                  onPress={handleAddManager}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Add Manager</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleViewManagers}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>View Managers</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={toggleUpdateProfileModal}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleModal}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={updateProfileModalVisible}
        animationType="fade"
        onRequestClose={toggleUpdateProfileModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {auth?.role === "Player" && (
              <PlayerForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Club" && (
              <ClubAdminForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Manager" && (
              <ClubManagerForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Organization" && (
              <OrganizerForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Team" && (
              <TeamsForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Trainer" && (
              <TrainerForm onSuccess={toggleUpdateProfileModal} />
            )}

            <TouchableOpacity
              onPress={toggleUpdateProfileModal}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={addManagerVisible}
        animationType="slide"
        onRequestClose={() => setAddManagerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{ width: "100%" }}>
              <Text style={styles.modalTitle}>Add Manager</Text>

              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#888"
                value={managerDetails.name}
                onChangeText={(text) => handleManagerInputChange("name", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={managerDetails.email}
                onChangeText={(text) => handleManagerInputChange("email", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={true}
                value={managerDetails.password}
                onChangeText={(text) =>
                  handleManagerInputChange("password", text)
                }
              />

              <TouchableOpacity
                onPress={handleSubmitManager}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAddManagerVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      
      <Modal
        transparent={true}
        visible={viewManagersVisible}
        animationType="slide"
        onRequestClose={() => setViewManagersVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{ width: "100%" }}>
              <Text style={styles.modalTitle}>Managers List</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : managers.length > 0 ? (
                managers.map((manager) => (
                  <View key={manager._id} style={styles.managerContainer}>
                    <Text style={styles.managerText}>Name: {manager.name}</Text>
                    <Text style={styles.managerText}>
                      Email: {manager.email}
                    </Text>
                    <Text style={styles.managerText}>
                      Status: {manager.isActive ? "Active" : "Inactive"}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        handleToggleActivation(manager._id, !manager.isActive)
                      }
                      style={styles.modalButton}
                    >
                      <Text style={styles.modalButtonText}>
                        {manager.isActive ? "Deactivate" : "Activate"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAddTask(manager._id)}
                      style={styles.addTaskButton}
                    >
                      <Text style={styles.addTaskButtonText}>Add Task</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteManager(manager._id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No managers found.</Text>
              )}

              <TouchableOpacity
                onPress={() => setViewManagersVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={taskModalVisible} // This controls the visibility of the task modal
        animationType="slide"
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput
              style={styles.taskInput}
              placeholder="Enter task (up to 1000 words)"
              multiline={true}
              numberOfLines={10}
              value={taskDescription}
              onChangeText={(text) => setTaskDescription(text)}
            />
            <TouchableOpacity
              onPress={handleSubmitTask}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Submit Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTaskModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingTop: 30,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingTop: 10,
    paddingRight: 170,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  iconText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 18,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  backText: {
    color: '#000',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    width: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalCloseButton: {
    padding: 10,
    marginTop: 15,
    width: "100%",
    backgroundColor: "#f44336",
    borderRadius: 5,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
  },


  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#4CAF50",
    marginBottom: 20,
    width: "100%",
    padding: 10,
    color: "#333",
  },
  managerContainer: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  managerText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  addTaskButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  addTaskButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TopMenu;*/


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { useNavigation } from "@react-navigation/native";
import config from "./config";
import PlayerForm from "./PlayerForm";
import ClubAdminForm from "./ClubAdminForm";
import TrainerForm from "./TrainerForm";
import OrganizerForm from "./OrganizerForm";
import ClubManagerForm from "./ClubManagerForm";
import TeamsForm from "./TeamsForm";

const TopMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updateProfileModalVisible, setUpdateProfileModalVisible] =
    useState(false);
  const [addManagerVisible, setAddManagerVisible] = useState(false);
  const [viewManagersVisible, setViewManagersVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [managerDetails, setManagerDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [managers, setManagers] = useState([]);
  const { logout, auth } = useAuth();
  const navigation = useNavigation();
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleUpdateProfileModal = () => {
    setUpdateProfileModalVisible(!updateProfileModalVisible);
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
  };

  const handleAddManager = () => {
    setAddManagerVisible(true);
    setModalVisible(false);
  };

  const handleViewManagers = () => {
    fetchManagers();
    setViewManagersVisible(true);
    setModalVisible(false);
  };

  const handleManagerInputChange = (field, value) => {
    setManagerDetails({ ...managerDetails, [field]: value });
  };

  const handleSubmitManager = async () => {
    try {
      const managerExists = auth?.managers?.some(
        (manager) => manager.email === managerDetails.email
      );

      if (managerExists) {
        // If the email already exists, show an alert and stop the process
        alert(
          "User with this email already exists. Please choose another one."
        );
        return; // Prevent further execution
      }

      const response = await axios.post(`${config.backendUrl}/managers`, {
        name: managerDetails.name,
        email: managerDetails.email,
        password: managerDetails.password,
      });
      console.log(response.data);
      setAddManagerVisible(false);
      setManagerDetails({ name: "", email: "", password: "" });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        // Handle other errors
        alert(
          "Error in handleSubmitManager: " +
            (error.response?.data || error.message)
        );
      }
    }
  };

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.backendUrl}/club-admin/managers`
      );
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivation = async (managerId, isActive) => {
    try {
      const response = await axios.put(
        `${config.backendUrl}/managers/${managerId}/activate`,
        {
          isActive,
        }
      );
      console.log(response.data.message);
      fetchManagers();
    } catch (error) {
      console.error("Error updating manager status:", error);
    }
  };

  const handleAddTask = (managerId) => {
    setSelectedManagerId(managerId);
    setTaskModalVisible(true);
    console.log("Add task for manager with ID:", managerId);
  };

  const handleSubmitTask = async () => {
    try {
      if (taskDescription.length > 1000) {
        alert("Task description exceeds 1000 words limit.");
        return;
      }
  
      if (!taskTitle) {
        alert("Task title is required.");
        return;
      }
  
      // Submit the task to the backend
      const response = await axios.post(
        `${config.backendUrl}/managers/${selectedManagerId}/tasks`,
        {
          managerId: selectedManagerId,
          title: taskTitle, // Include the title
          description: taskDescription,
        }
      );
      console.log(response.data);
      setTaskDescription("");
      setTaskTitle(""); // Clear the title after submission
      setTaskModalVisible(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  

  const handleDeleteManager = async (managerId) => {
    try {
      await axios.delete(`${config.backendUrl}/managers/${managerId}`);
      fetchManagers();
    } catch (error) {
      console.error("Error deleting manager:", error);
    }
  };


  // Function to toggle notification screen
  const openNotificationScreen = () => {
    navigation.navigate('Notification');
  };

  const goBack = () => {
    setShowNotifications(false);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sportszz</Text>
      <TouchableOpacity style={styles.iconContainer} onPress={openNotificationScreen }>
        <Icon name="bell" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={toggleModal}>
        <Icon name="user" size={24} color="#fff" />
      </TouchableOpacity>

      {showNotifications && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Notifications</Text>
            <Text>No new notifications.</Text> 
          </View>
        </View>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Welcome, {auth?.name || "User"}
            </Text>
            <Text style={styles.modalTitle}>
              Login as: {auth?.role || "User"}
            </Text>

            {auth?.role?.toLowerCase() === "club" && (
              <>
                <TouchableOpacity
                  onPress={handleAddManager}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Add Manager</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleViewManagers}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>View Managers</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={toggleUpdateProfileModal}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleModal}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={updateProfileModalVisible}
        animationType="fade"
        onRequestClose={toggleUpdateProfileModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {auth?.role === "Player" && (
              <PlayerForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Club" && (
              <ClubAdminForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Manager" && (
              <ClubManagerForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Organization" && (
              <OrganizerForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Team" && (
              <TeamsForm onSuccess={toggleUpdateProfileModal} />
            )}
            {auth?.role === "Trainer" && (
              <TrainerForm onSuccess={toggleUpdateProfileModal} />
            )}

            <TouchableOpacity
              onPress={toggleUpdateProfileModal}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={addManagerVisible}
        animationType="slide"
        onRequestClose={() => setAddManagerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{ width: "100%" }}>
              <Text style={styles.modalTitle}>Add Manager</Text>

              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#888"
                value={managerDetails.name}
                onChangeText={(text) => handleManagerInputChange("name", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={managerDetails.email}
                onChangeText={(text) => handleManagerInputChange("email", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={true}
                value={managerDetails.password}
                onChangeText={(text) =>
                  handleManagerInputChange("password", text)
                }
              />

              <TouchableOpacity
                onPress={handleSubmitManager}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAddManagerVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      
      <Modal
        transparent={true}
        visible={viewManagersVisible}
        animationType="slide"
        onRequestClose={() => setViewManagersVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{ width: "100%" }}>
              <Text style={styles.modalTitle}>Managers List</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : managers.length > 0 ? (
                managers.map((manager) => (
                  <View key={manager._id} style={styles.managerContainer}>
                    <Text style={styles.managerText}>Name: {manager.name}</Text>
                    <Text style={styles.managerText}>
                      Email: {manager.email}
                    </Text>
                    <Text style={styles.managerText}>
                      Status: {manager.isActive ? "Active" : "Inactive"}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        handleToggleActivation(manager._id, !manager.isActive)
                      }
                      style={styles.modalButton}
                    >
                      <Text style={styles.modalButtonText}>
                        {manager.isActive ? "Deactivate" : "Activate"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAddTask(manager._id)}
                      style={styles.addTaskButton}
                    >
                      <Text style={styles.addTaskButtonText}>Add Task</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteManager(manager._id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No managers found.</Text>
              )}

              <TouchableOpacity
                onPress={() => setViewManagersVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={taskModalVisible} // This controls the visibility of the task modal
        animationType="slide"
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput
        style={styles.taskInput}
        placeholder="Enter task title"
        value={taskTitle}
        onChangeText={(text) => setTaskTitle(text)}
      />
            <TextInput
              style={styles.taskInput}
              placeholder="Enter task (up to 1000 words)"
              multiline={true}
              numberOfLines={10}
              value={taskDescription}
              onChangeText={(text) => setTaskDescription(text)}
            />
            <TouchableOpacity
              onPress={handleSubmitTask}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Submit Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTaskModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingTop: 30,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingTop: 10,
    paddingRight: 170,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  iconText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 18,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  backText: {
    color: '#000',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    width: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalCloseButton: {
    padding: 10,
    marginTop: 15,
    width: "100%",
    backgroundColor: "#f44336",
    borderRadius: 5,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
  },


  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#4CAF50",
    marginBottom: 20,
    width: "100%",
    padding: 10,
    color: "#333",
  },
  managerContainer: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  managerText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  addTaskButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  addTaskButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TopMenu;


