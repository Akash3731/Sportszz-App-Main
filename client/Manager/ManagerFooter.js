import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
  const [selected, setSelected] = useState("Home"); // default selection
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    setSelected(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigateTo("Home")}
        >
          <View
            style={[
              styles.iconWrapper,
              selected === "Home" && styles.selectedIconWrapper,
            ]}
          >
            <MaterialIcons
              name="home"
              size={24}
              color={selected === "Home" ? "#fff" : "#494f45"}
            />
          </View>
          <Text
            style={[
              styles.iconText,
              selected === "Home" && styles.selectedText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigateTo("Profile")}
      >
        <View
          style={[
            styles.iconWrapper,
            selected === "Profile" && styles.selectedIconWrapper,
          ]}
        >
          <MaterialIcons
            name="calendar-today"
            size={24}
            color={selected === "Profile" ? "#fff" : "#494f45"}
          />
        </View>
        <Text
          style={[
            styles.iconText,
            selected === "Profile" && styles.selectedText,
          ]}
        >
          Slots
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigateTo("Score")} // Update this line
      >
        <View
          style={[
            styles.iconWrapper,
            selected === "Score" && styles.selectedIconWrapper,
          ]}
        >
          <MaterialIcons
            name="scoreboard"
            size={24}
            color={selected === "Score" ? "#fff" : "#494f45"}
          />
        </View>
        <Text
          style={[styles.iconText, selected === "Score" && styles.selectedText]}
        >
          Score
        </Text>
      </TouchableOpacity>

      {/* Group Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigateTo("Group")}
      >
        <View
          style={[
            styles.iconWrapper,
            selected === "Group" && styles.selectedIconWrapper,
          ]}
        >
          <MaterialIcons
            name="groups"
            size={24}
            color={selected === "Group" ? "#fff" : "#494f45"}
          />
        </View>
        <Text
          style={[styles.iconText, selected === "Group" && styles.selectedText]}
        >
          Group
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigateTo("ManagerTournament")} // Navigate to Tournament page
      >
        <View
          style={[
            styles.iconWrapper,
            selected === "Matches" && styles.selectedIconWrapper,
          ]}
        >
          <FontAwesome5
            name="flag-checkered"
            size={24}
            color={selected === "Matches" ? "#fff" : "#494f45"}
          />
        </View>
        <Text
          style={[
            styles.iconText,
            selected === "Matches" && styles.selectedText,
          ]}
        >
          Matches
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 14,
    marginTop: 1,
    color: "#032B66",
  },
  selectedText: {
    color: "#032B66",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#032B66",
  },
});

export default Footer;
