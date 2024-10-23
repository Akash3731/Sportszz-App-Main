import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Notification from "./Notifications";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (screen) => {
    setIsOpen(false);
    navigation.navigate(screen);
  };


  const openNotificationScreen = () => {
    navigation.navigate('Notification');
    setHasNotification(false);
    setNewNotification(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications arriving every 10 seconds for demonstration
      
      setNewNotification(true);
      setHasNotification(true);
    }, 10000); // Adjust the interval as needed

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const goBack = () => {
    setShowNotifications(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {/* Toggle Button */}
        {/* <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.toggleButton}>
            {isOpen ? '✖' : '☰'}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons
            name={isOpen ? "close" : "menu"}
            size={24}
            color="#494f45"
            style={styles.toggleButton}
          />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color="#494f45"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Players....."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        {/* Notification Icon with Badge */}
        <TouchableOpacity style={styles.iconContainer} onPress={openNotificationScreen }>
          <View>
            <MaterialIcons name="notifications" size={24} color="#494f45" />
            {newNotification && hasNotification && <View style={styles.badge} />}
          </View>
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
      </View>

      {/* Toggleable Menu Items */}
      {isOpen && (
        <View style={styles.menu}>
          {/* <TouchableOpacity onPress={() => navigateTo('Home')}>
            <Text style={styles.menuItem}>Home</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigateTo("Profile")}>
            <Text style={styles.menuItem}>Create_Event</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigateTo('Settings')}>
            <Text style={styles.menuItem}>Slot_Booking</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigateTo("Logout")}>
            <Text style={styles.menuItem}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("Player")}>
            <Text style={styles.menuItem}>Player</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("Groups")}>
            <Text style={styles.menuItem}>Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("Tournament")}>
            <Text style={styles.menuItem}>Tournament</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("Scoreboard")}>
            <Text style={styles.menuItem}>Scoreboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    // paddingLeft:20,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#EFEFF4",
    height: 64,
    paddingLeft: 20,
  },
  toggleButton: {
    fontSize: 24,
    color: "#494f45",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 3,
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#F60000",
  },
  menu: {
    backgroundColor: "#e1e1e1",
    padding: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
  },
});

export default Navbar;
