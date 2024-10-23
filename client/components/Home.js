/*import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper"; // Ensure you install react-native-paper
import tennis from "./Images/tennis.jpeg";
import banner from "./Images/banner-img.jpeg";
import basketball from "./Images/basketball.jpeg";
import football from "./Images/football.jpeg"; // Corrected file extension
import cri from "./Images/cri.jpg";
import FooterMenu from "./FooterMenu";
import ManagerFooter from "./ManagerFooter";
import TopMenu from "./TopMenu";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TopMenu />
    <ScrollView>
      <View style={styles.bannerContainer}>
        <Image source={banner} style={styles.bannerImage} />
      </View>

      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Cover source={football} />
          <Card.Title title="Football" />
        </Card>
        <Card style={styles.card}>
          <Card.Cover source={basketball} />
          <Card.Title title="Basketball" />
        </Card>
        <Card style={styles.card}>
          <Card.Cover source={cri} />
          <Card.Title title="Cricket" />
        </Card>
        <Card style={styles.card}>
          <Card.Cover source={tennis} />
          <Card.Title title="Tennis" />
        </Card>
      </View>
    </ScrollView>
    <FooterMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    height: 300,
    justifyContent: "flex-end",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  bannerTextContainer: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    alignItems: "center",
  },
  bannerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  card: {
    width: "45%",
    marginBottom: 20,
  },
});

export default Home;*/

import React from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper"; // Ensure you install react-native-paper
import tennis from "./Images/tennis.jpeg";
import banner from "./Images/banner-img.jpeg";
import basketball from "./Images/basketball.jpeg";
import football from "./Images/football.jpeg"; // Corrected file extension
import cri from "./Images/cri.jpg";
import FooterMenu from "./FooterMenu";
import ManagerFooter from "../Manager/ManagerFooter";
import ManagerHome from "../Manager/ManagerHome";
import TopMenu from "./TopMenu";
import { useAuth } from "../Context/authContext"; // Import the useAuth hook

const Home = ({ navigation }) => {
  const { auth } = useAuth(); // Access the auth context

  // Debugging: Log auth to ensure the role is set correctly
  console.log(auth);

  return (
    <View style={styles.container}>
      <TopMenu />

      {/* Conditionally render ManagerHome if the user is a Manager */}
      {auth?.role === "Manager" ? (
        <ManagerHome navigation={navigation} />
      ) : (
        <ScrollView>
          <View style={styles.bannerContainer}>
            <Image source={banner} style={styles.bannerImage} />
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Cover source={football} />
              <Card.Title title="Football" />
            </Card>
            <Card style={styles.card}>
              <Card.Cover source={basketball} />
              <Card.Title title="Basketball" />
            </Card>
            <Card style={styles.card}>
              <Card.Cover source={cri} />
              <Card.Title title="Cricket" />
            </Card>
            <Card style={styles.card}>
              <Card.Cover source={tennis} />
              <Card.Title title="Tennis" />
            </Card>
          </View>
        </ScrollView>
      )}

      {/* Conditionally render the appropriate footer based on user's role */}
      {auth?.role === "Manager" ? (
        <ManagerFooter navigation={navigation} />
      ) : (
        <FooterMenu navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    height: 300,
    justifyContent: "flex-end",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  card: {
    width: "45%",
    marginBottom: 20,
  },
});

export default Home;
