// Home.js

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Navbar from './ManagerNavbar'; 
import { useAuth } from "../Context/authContext";

const Home = () => {
  
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();
  const  auth  = useAuth();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Roboto: require("../assets/Fonts/Roboto (1)/Roboto-Black.ttf"), // Adjust the path as necessary
        "Roboto-Bold": require("../assets/Fonts/Roboto (1)/Roboto-Bold.ttf"), // For bold weight
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  useEffect(() => {
    console.log(auth); // Check if auth contains the name field
  }, [auth]);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }
  
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
      <Navbar />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.text}>Hello, {auth.auth?.name || "name"}</Text>
            <Text style={styles.text1}>You’ve Got</Text>
            <Text style={styles.text2}>4 Tasks Today</Text>
          </View>

          <View style={styles.container1}>
            <Text style={styles.event}>Upcoming Event</Text>
          </View>

          <View style={styles.container2}>
            {/* Top row with Tournament and Court */}
            <View style={styles.topRow}>
              <TouchableOpacity style={styles.tournamentButton}>
                <Text style={styles.tournamentText}>Tournament 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.courtButton}>
                <Text style={styles.courtText}>Court 2</Text>
              </TouchableOpacity>

              {/* Bell icon container */}
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.bellIcon}>
                  <Icon name="notifications" size={24} color="#333" />
                  <Text style={styles.iconText}></Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Middle row with Team icons and match info */}
            <View style={styles.middleRow}>
              {/* Team Bcs */}
              <View style={styles.teamContainers}>
                <Text style={styles.teamText}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.teamImage}
                />
              </View>

              {/* Time info */}
              <View style={styles.timeContainers}>
                <Text style={styles.timeText}>07:30</Text>
                <Text style={styles.timeSubText}>1 Dec</Text>
              </View>

              {/* Team Besto */}
              <View style={styles.teamContainers}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.teamImage}
                />
                <Text style={styles.teamText}>Besto</Text>
              </View>
            </View>

            {/* Bottom row with match type */}
            <View style={styles.bottomRow}>
              <Text style={styles.matchTypeText}>Double Elimination</Text>
            </View>
          </View>
          <View style={styles.container2}>
            {/* Top row with Tournament and Court */}
            <View style={styles.topRow}>
              <TouchableOpacity style={styles.tournamentButton}>
                <Text style={styles.tournamentText}>Tournament 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.courtButton}>
                <Text style={styles.courtText}>Court 2</Text>
              </TouchableOpacity>

              {/* Bell icon container */}
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.bellIcon}>
                  <Icon name="notifications" size={24} color="#333" />
                  <Text style={styles.iconText}></Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Middle row with Team icons and match info */}
            <View style={styles.middleRow}>
              {/* Team Bcs */}
              <View style={styles.teamContainers}>
                <Text style={styles.teamText}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.teamImage}
                />
              </View>

              {/* Time info */}
              <View style={styles.timeContainers}>
                <Text style={styles.timeText}>07:30</Text>
                <Text style={styles.timeSubText}>1 Dec</Text>
              </View>

              {/* Team Besto */}
              <View style={styles.teamContainers}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.teamImage}
                />
                <Text style={styles.teamText}>Besto</Text>
              </View>
            </View>

            {/* Bottom row with match type */}
            <View style={styles.bottomRow}>
              <Text style={styles.matchTypeText}>Double Elimination</Text>
            </View>
          </View>
          <View style={styles.NextMatchcontainer}>
            <Text style={styles.NextMatch}>Next Match</Text>
            <Text style={styles.NextMatchElimination}>
              Single Elimination (Court 3)
            </Text>
          </View>
          <View style={styles.containerMatchschedule}>
            <View style={styles.matchschedulerow}>
              {/* Team Bcs */}
              <View style={styles.teamContainers}>
                <Text style={styles.teamText}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.teamImage}
                />
              </View>

              {/* Time info */}
              <View style={styles.timeContainer}>
                <Text style={styles.timeTexts}>VS</Text>
              </View>

              {/* Team Besto */}
              <View style={styles.teamContainers}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.teamImage}
                />
                <Text style={styles.teamText}>Besto</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.matchDate}>15 Dec</Text>
                <Text style={styles.matchTime}>07:30</Text>
              </View>
            </View>
            <View style={styles.matchschedulerow}>
              {/* Team Bcs */}
              <View style={styles.teamContainers}>
                <Text style={styles.teamText}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.teamImage}
                />
              </View>

              {/* Time info */}
              <View style={styles.timeContainer}>
                <Text style={styles.timeTexts}>VS</Text>
              </View>

              {/* Team Besto */}
              <View style={styles.teamContainers}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.teamImage}
                />
                <Text style={styles.teamText}>Besto</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.matchDate}>15 Dec</Text>
                <Text style={styles.matchTime}>07:30</Text>
              </View>
            </View>
            <View style={styles.matchschedulerow}>
              {/* Team Bcs */}
              <View style={styles.teamContainers}>
                <Text style={styles.teamText}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.teamImage}
                />
              </View>

              {/* Time info */}
              <View style={styles.timeContainer}>
                <Text style={styles.timeTexts}>VS</Text>
              </View>

              {/* Team Besto */}
              <View style={styles.teamContainers}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.teamImage}
                />
                <Text style={styles.teamText}>Besto</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.matchDate}>15 Dec</Text>
                <Text style={styles.matchTime}>07:30</Text>
              </View>
            </View>
          </View>

          <View style={styles.containercourt2}>
            <Text style={styles.robin}>Round Robin (Court 2)</Text>
          </View>

          <View style={styles.containerMatchschedule}>
            <View style={styles.matchschedulerow}>
              {/* Team Bcs */}
              <View style={styles.teamContainer}>
                <Text style={styles.teamText}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.teamImage}
                />
              </View>

              {/* Time info */}
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>VS</Text>
              </View>

              {/* Team Besto */}
              <View style={styles.teamContainer}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.teamImage}
                />
                <Text style={styles.teamText}>Besto</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.matchDate}>15 Dec</Text>
                <Text style={styles.matchTime}>07:30</Text>
              </View>
            </View>
            <View style={styles.matchschedulerow}>
              {/* Team Bcs */}
              <View style={styles.teamContainer}>
                <Text style={styles.teamText}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.teamImage}
                />
              </View>

              {/* Time info */}
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>VS</Text>
              </View>

              {/* Team Besto */}
              <View style={styles.teamContainer}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.teamImage}
                />
                <Text style={styles.teamText}>Besto</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.matchDate}>15 Dec</Text>
                <Text style={styles.matchTime}>07:30</Text>
              </View>
            </View>
          </View>
          <View style={styles.pendingRequestSection}>
            {/* Pending Request Title */}
            <Text style={styles.pendingRequestText}>Pending Request</Text>

            {/* Participants Row */}
            <View style={styles.participantRow}>
              {/* Participant Images */}
              <Image
                source={require("../assets/India.png")}
                style={styles.participantImage}
              />
              <Image
                source={require("../assets/India.png")}
                style={styles.participantImage}
              />
              <Image
                source={require("../assets/India.png")}
                style={styles.participantImage}
              />

              {/* +6 Circle */}
              <View style={styles.participantCircle}>
                <Text style={styles.participantCount}>+6</Text>
              </View>

              {/* Participant Waiting Text */}
              <Text style={styles.participantWaitingText}>
                Participant Waiting
              </Text>
            </View>
          </View>

          {/* Slots Available Section */}
          <View style={styles.slotsAvailableSection}>
            <Text style={styles.slotsAvailableText}>Slots Available</Text>
            <View style={styles.slots}>
              <View style={styles.row}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateText}>06 October</Text>
                  <Text style={styles.todayText}>Today</Text>
                </View>

                <TouchableOpacity
                  style={styles.addTaskButton}
                  onPress={() => navigation.navigate("Slot_Bookings")} // Navigate to Create Event screen
                >
                  <Text style={styles.addTaskButtonText}>+ Add Event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.daysRow}>
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
              (day, index) => (
                <View
                  key={index}
                  style={index === 0 ? styles.selectedDay : styles.day}
                >
                  <Text
                    style={
                      index === 0 ? styles.selectedDayText : styles.dayText
                    }
                  >
                    {day}
                  </Text>
                  <Text
                    style={
                      index === 0 ? styles.selectedDateText : styles.dateText
                    }
                  >
                    {7 + index}
                  </Text>
                </View>
              )
            )}
          </View>

          {/* <View style={styles.matchContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>9:30 PM</Text>
            <Text style={styles.subTime}>10:20</Text>
          </View>
          <View style={styles.timeline}>
            
          <View style={styles.outerCircle}>
  <View style={[styles.circle, styles.activeCircle]} />
</View>
            <View style={styles.line} />
          </View>
          <View style={[styles.matchInfo, styles.activeMatch]}>
            <View style={styles.matchDetails}>
              <Text style={styles.courtText}>Court 3</Text>
              <Text style={styles.tournamentText}>Tournament 2</Text>
            </View>
            <View style={styles.teamContainer}>
              <View style={styles.team}>
              <Text style={styles.teamName}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.flag}
                />
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.team}>
                <Image
                  source={require("../assets/canada.png")}
                  style={styles.flag}
                />
                <Text style={styles.teamName}>Besto</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.matchContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>11:00 PM</Text>
            <Text style={styles.subTime}>11:50</Text>
          </View>
          <View style={styles.timeline}>
            <View style={styles.circles} />
            <View style={styles.line} />
          </View>
          <View style={styles.matchInfo}>
          <View style={styles.matchDetails}>
  <Text style={styles.courtText}>Court 3</Text>
  <Text style={styles.tournamentText}>Tournament 2</Text>
</View>
            <View style={styles.teamContainer}>
              <View style={styles.team}>
              <Text style={styles.teamName}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.flag}
                />
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.team}>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.flag}
                />
                <Text style={styles.teamName}>Besto</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.matchContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>12:00 PM</Text>
            <Text style={styles.subTime}>12:50</Text>
          </View>
          <View style={styles.timeline}>
            <View style={styles.circles} />
          </View>
          <View style={styles.matchInfo}>
            <View style={styles.matchDetails}>
              <Text style={styles.courtText}>Court 3</Text>
              <Text style={styles.tournamentText}>Tournament 2</Text>
            </View>
            <View style={styles.teamContainer}>
              <View style={styles.team}>
              <Text style={styles.teamName}>Bcs</Text>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.flag}
                />
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.team}>
                <Image
                  source={require("../assets/India.png")}
                  style={styles.flag}
                />
                <Text style={styles.teamName}>Besto</Text>
              </View>
            </View>
          </View>
        </View> */}
          <View style={styles.timelineContainer}>
            {/* First Event */}
            <View style={styles.eventRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.startTime}>9:30 PM</Text>
                <Text style={styles.endTime}>10:20</Text>
              </View>
              <View style={styles.connectorColumn}>
                {/* Outer Circle containing the Filled Circle */}
                <View style={styles.outerCircle}>
                  <View style={styles.circleFilled} />
                </View>
                <View style={styles.lineFilled} />
              </View>
              <View
                style={[styles.eventDetails, { backgroundColor: "#E5F1FF" }]}
              >
                {/* Court and Tournament buttons */}
                <View style={styles.eventButtons}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Court 3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tournament 2</Text>
                  </TouchableOpacity>
                </View>

                {/* Updated Images with Names and VS between them */}
                <View style={styles.eventImages}>
                  {/* Team 1 Name */}
                  <View style={styles.contestents}>
                    <Text style={styles.teamName}>BCS</Text>
                    <Image
                      source={require("../assets/India.png")}
                      style={styles.teamImage}
                    />
                  </View>
                  <Text style={styles.vsText}>VS</Text>
                  <View style={styles.contestents}>
                    <Image
                      source={require("../assets/India.png")}
                      style={styles.teamImage}
                    />
                    <Text style={styles.teamName}>Besto</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Second Event */}
            <View style={styles.eventRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.startTime}>11:00 PM</Text>
                <Text style={styles.endTime}>11:50</Text>
              </View>
              <View style={styles.connectorColumn}>
                <View style={styles.circleEmpty} />
                <View style={styles.lineFilleds} />
              </View>
              <View style={styles.eventDetails}>
                <View style={styles.eventButtons}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Court 3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tournament 2</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.eventImages}>
                  {/* Team 1 Name */}
                  <View style={styles.contestents}>
                    <Text style={styles.teamName}>BCS</Text>
                    <Image
                      source={require("../assets/India.png")}
                      style={styles.teamImage}
                    />
                  </View>
                  <Text style={styles.vsText}>VS</Text>
                  <View style={styles.contestents}>
                    <Image
                      source={require("../assets/India.png")}
                      style={styles.teamImage}
                    />
                    <Text style={styles.teamName}>Besto</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Third Event */}
            {/* Third Event */}
            <View style={styles.eventRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.startTime}>12:00 PM</Text>
                <Text style={styles.endTime}>12:50</Text>
              </View>
              <View style={styles.connectorColumn}>
                {/* Empty Circle at the top */}
                <View style={styles.circleEmpty} />
                {/* Invisible line to match the height of the others */}
                <View style={styles.invisibleLine} />
              </View>
              <View style={styles.eventDetails}>
                <View style={styles.eventButtons}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Court 3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tournament 2</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.eventImages}>
                  {/* Team 1 Name */}
                  <View style={styles.contestents}>
                    <Text style={styles.teamName}>BCS</Text>
                    <Image
                      source={require("../assets/India.png")}
                      style={styles.teamImage}
                    />
                  </View>
                  <Text style={styles.vsText}>VS</Text>
                  <View style={styles.contestents}>
                    <Image
                      source={require("../assets/India.png")}
                      style={styles.teamImage}
                    />
                    <Text style={styles.teamName}>Besto</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: 20,
  },
  text: {
    fontSize: 17,
    color: "#666",
    marginBottom: 0,
  },
  text1: {
    fontSize: 28,
    color: "#000",
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text2: {
    fontSize: 28,
    color: "#48B482",
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container1: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: 30,
  },
  event: {
    color: "#000",
    fontSize: 22,
    fontWeight: 'bold',
  },
  container2: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 21,
    padding: 10,
    position: "relative",
  },
  topRow: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tournamentButton: {
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 30,
  },
  courtButton: {
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 30,
  },

  tournamentText: {
    fontSize: 16,
  },
  courtText: {
    fontSize: 16,
  },
  iconContainer: {
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 2,
    position:'relative',
    marginLeft:100,
  },
  bellIcon: {},
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginHorizontal: 20,
    gap: 30,
  },
  teamContainers: {
    gap: 10,
    flexDirection: "row",
  },
  teamImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teamText: {
    fontSize: 17,
    marginTop: 10,
  },
  timeContainer: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 17,
    color: "#EB2630",
  },
  timeSubText: {
    textAlign: "center",
    fontSize: 11,
    color: "#999",
  },
  bottomRow: {
    marginTop: 20,
    alignItems: "center",
  },
  matchTypeText: {
    fontSize: 11,
    color: "#464646",
    textAlign: "center",
    justifyContent: "center",
    marginRight: 35,
  },
  NextMatchcontainer: {
    marginLeft: 15,
    textAlign: "left",
    marginTop:30,
  },
  timeTexts:{
    fontSize:17,
    color:'#000',
  },
  NextMatch: {
    color: "#000",
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  NextMatchElimination: {
    color: "#464646",
    fontSize: 15,
    lineHeight: 28,
  },
  NextMatchSchedulerow: {
    marginLeft: 15,
    textAlign: "left",
  },
  matchDate: {
    fontSize: 11,
    color: "#464646",
    textAlign: "center",
  },
  matchDate: {
    color: "#464646",
    fontSize: 11,
  },
  matchTime: {
    fontSize: 17,
    color: "#000",
  },
  matchschedulerow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  containerMatchschedule: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    gap: 20,
  },
  containercourt2: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: 10,
  },
  robin: {
    fontSize: 15,
    color: "#464646",
  },
  pendingRequestSection: {
    padding: 16,
  },
  pendingRequestText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    borderColor:'#fff',
    borderWidth:2,
    alignItems: 'center',
    marginLeft: 4, 
    marginRight:-18,
  },
  firstImage: {
    marginRight: 0, // Slightly less negative margin for the first image
  },
  participantCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    borderColor:'#fff',
    borderWidth:2,
    alignItems: 'center',
    marginLeft: 4, // Space between images and +6 circle
    marginRight:-18,
  },
  participantCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  participantWaitingText: {
    fontSize: 16,
    color: '#000',
    marginLeft:30,
  },
  // Slots Available Section

  slotsAvailableSection: {
    display: "flex",

    padding: 20,
  },
  dateRow: {
    marginBottom: 10,
  },
  slotsAvailableText: {
    fontSize: 22,
    paddingBottom: 15,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    marginRight: 10,
  },
  todayText: {
    marginRight: 10,
  },
  slots: {
    display: "flex",
  },

  addTaskButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  addTaskButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  day: {
    alignItems: "center",
  },
  selectedDay: {
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#007BFF",
  },
  dayText: {
    fontSize: 14,
    color: "#666",
  },
  selectedDayText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  selectedDateText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  matchContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  timeContainer: {
    paddingHorizontal: 30,
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTime: {
    fontSize: 12,
    color: "#888",
  },
  timeline: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  activeCircle: {
    backgroundColor: "#2196f3",
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: "#ccc",
  },
  matchInfo: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  activeMatch: {
    backgroundColor: "#e0f7fa",
  },
  matchDetails: {
    marginBottom: 10,
    height: 28,
  },
  courtText: {
    fontSize: 12,
    padding: 5,
    marginRight: 0,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },

  tournamentText: {
    fontSize: 12,
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },

  teamContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  timelineContainer: {
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  eventRow: {
    marginTop: 20,
    flexDirection: "row",
    marginBottom: 20,
  },
  timeColumn: {
    width: 60,
    alignItems: "flex-end",
    paddingRight: 10,
  },
  startTime: {
    fontSize: 16,
    fontWeight: "bold",
  },
  endTime: {
    fontSize: 12,
    color: "gray",
  },
  connectorColumn: {
    alignItems: "center",
    width: 30,
    marginRight: 10,
    justifyContent: "flex-start",
  },
  outerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  circleFilled: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    zIndex: 1,
  },
  circleEmpty: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  lineFilled: {
    width: 2,
    flex: 1,
    backgroundColor: "#007AFF",
    marginTop: -2,
    marginBottom: -40,
  },
  lineFilleds: {
    width: 2,
    flex: 1,
    backgroundColor: "#007AFF",
    marginTop: 4,
    marginBottom: -40,
  },
  lineGrey: {
    width: 2,
    flex: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 0,
    marginBottom: -70,
  },

  invisibleLine: {
    width: 2,
    flex: 1,
    backgroundColor: "transparent",
    marginTop: -2,
    marginBottom: -54,
  },
  eventDetails: {
    marginHorizontal: 0,
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  eventButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#EFEFF4",
  },
  buttonText: {
    fontSize: 12,
    color: "#333",
  },
  eventImages: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  teamImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  vsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventMeta: {
    fontSize: 12,
    color: "gray",
  },
  contestents: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 25,
    gap: 10,
  },
});

export default Home;
