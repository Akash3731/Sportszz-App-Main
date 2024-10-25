// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
// import React, { useState } from "react";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from '@react-navigation/native';

// const createScoreCardUsers = [
//   {
//     id: 1,
//     name: "BCS Legends",
//     status: "",
//     description: "Double Elimination",
//     added: false,
//     image: require("../assets/India.png"),
//   },
//   {
//     id: 2,
//     name: "BCS Legends",
//     status: "",
//     description: "Double Elimination",
//     added: true,
//     image: require("../assets/India.png"),
//   },
//   {
//     id: 3,
//     name: "BCS Legends",
//     status: "Win Last match",
//     description: "Double Elimination",
//     added: true,
//     image: require("../assets/India.png"),
//   },
// ];

// const Tournament = () => {
//   const [userData, setUserData] = useState(createScoreCardUsers);
//   const navigation = useNavigation();

//   const navigateToCreateTournament = () => {
//     navigation.navigate('Create_Tournament');
//   };

//   const navigateToUserDetails = (Create_Group) => {
//     navigation.navigate('Create_Group', { Create_Group }); // Pass user data to the next screen
//   };

//   const toggleUserAdded = (userId) => {
//     setUserData((prevData) =>
//       prevData.map((user) =>
//         user.id === userId ? { ...user, added: !user.added } : user
//       )
//     );
//   };

//   const UserItem = ({ user }) => (
//     <TouchableOpacity onPress={() => navigateToUserDetails(user)}>
//       <View style={styles.userItem}>
//         <Image source={user.image} style={styles.avatar} />
//         <View style={styles.info}>
//           <View style={styles.containers}>
//             <Text style={styles.name}>{user.name}</Text>
//             <Text style={styles.status}>{user.status}</Text>
//           </View>
//           <Text style={styles.description}>{user.description}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <View style={styles.container}>
//         <View style={styles.Btndata}>
//           <TouchableOpacity style={styles.buttonContainer} onPress={navigateToCreateTournament}>
//             <Icon name="add" size={18} color="#007AFF" style={styles.icon} />
//             <Text style={styles.buttonText}>Create Tournament</Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.historyText}>Tournament History</Text>
//       </View>
//       <View style={styles.container}>
//         <FlatList
//           data={userData}
//           renderItem={({ item }) => (
//             <UserItem user={item} />
//           )}
//           keyExtractor={(item) => item.id.toString()}
//         />
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#F8F8F8',
//     textAlign: 'center',
//   },
//   Btndata: {
//     flexDirection: "row",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//     borderWidth: 1,
//     borderColor: "#007AFF",
//     borderRadius: 100,
//     paddingHorizontal:10,
//   },
//   buttonText: {
//     fontSize: 14,
//     color: "#007AFF",
//     padding:10,
//   },
//   historyText: {
//     marginTop: 30,
//     fontSize: 20,
//     color: "#000",
//   },
//   containers: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   status: {
//     fontSize: 11,
//     color: '#6e6e6e',
//   },
//   userItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   info: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   description: {
//     fontSize: 14,
//     color: "#6e6e6e",
//   },
//   icon: {
//     color: "#007AFF",
//     marginLeft:10,
//   },
// });

// export default Tournament;

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles/Manager_Tournament";
import config from "../components/config";

const teamHistory = [
  {
    id: 1,
    name: "BCS Legends",
    status: "Win Last match",
    description: "Double Elimination",
    added: false,
    image: require("../assets/India.png"),
  },
  {
    id: 2,
    name: "BCS Legends",
    status: "",
    description: "Double Elimination",
    added: true,
    image: require("../assets/India.png"),
  },
  {
    id: 3,
    name: "BCS Legends",
    status: "",
    description: "Double Elimination",
    added: false,
    image: require("../assets/India.png"),
  },
];

const Tournament = () => {
  const [teamData, setTeamData] = useState(teamHistory);
  const [tournamentData, setTournamentData] = useState([]);
  const [tournamentId, setTournamentId] = useState(null);
  const navigation = useNavigation();

  const navigateToCreateTournament = () => {
    navigation.navigate("Create_Tournament");
  };

  const navigateToUserDetails = (Create_Group) => {
    navigation.navigate("Create_Group", {
      Create_Group,
      id: tournamentId,
    });
  };

  const toggleTeamAdded = (teamId) => {
    setTeamData((prevData) =>
      prevData.map((team) =>
        team.id === teamId ? { ...team, added: !team.added } : team
      )
    );
  };

  // Tournament.js React Native Component
  const TournamentItem = ({ tournament }) => {
    // Use the base64 image data from the tournament data
    const imageSource = tournament.imageBase64
      ? { uri: tournament.imageBase64 }
      : null;

    return (
      <TouchableOpacity onPress={() => navigateToUserDetails(tournament)}>
        <View style={styles.userItem}>
          {imageSource ? (
            <Image source={imageSource} style={styles.avatar} />
          ) : (
            <Text style={styles.noImageText}>No Image Available</Text>
          )}
          <View style={styles.info}>
            <View style={styles.containers}>
              <Text style={styles.name}>{tournament.tournamentname}</Text>
              <Text style={styles.status}>{tournament.tournamenttype}</Text>
            </View>
            <Text style={styles.description}>
              {tournament.eventdescription}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const TeamItem = ({ team }) => (
    <View style={styles.teamItem}>
      <Image source={team.image} style={styles.avatar} />
      <View style={styles.info}>
        <View style={styles.containers}>
          <Text style={styles.name}>{team.name}</Text>
          <Text style={styles.status}>{team.status}</Text>
        </View>
        <Text style={styles.description}>{team.description}</Text>
      </View>

      <TouchableOpacity
        style={team.added ? styles.addedButton : styles.addButton}
        onPress={() => toggleTeamAdded(team.id)}
      >
        {team.added ? (
          <>
            <Icon name="check" size={16} color="#007AFF" />
            <Text style={styles.addedText}> Added</Text>
          </>
        ) : (
          <>
            <Icon name="add" size={16} color="#fff" />
            <Text style={styles.addText}> Add</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const fetchTournamentHistory = async () => {
      try {
        console.log("Fetching tournament history...");
        const response = await fetch(
          `${config.backendUrl}/get-tournament-history`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Response received:", data);

        if (data.success) {
          console.log("Tournament data:", data.data);
          setTournamentData(data.data);

          // Assuming data.data[0] has the tournamentId if it exists
          if (data.data.length > 0) {
            setTournamentId(data.data[0]._id); // Set the tournament ID here
          }

          console.log("Tournament data set successfully:", data.data);
        } else {
          console.error("Failed to fetch tournament history:", data.message);
        }
      } catch (error) {
        console.error("Error fetching tournament history:", error);
      }
    };

    fetchTournamentHistory();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.Btndata}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={navigateToCreateTournament}
          >
            <Icon name="add" size={18} color="#007AFF" style={styles.icon} />
            <Text style={styles.buttonText}>Create Tournament</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.historyText}>Tournament History</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={tournamentData}
          renderItem={({ item }) => <TournamentItem tournament={item} />}
          keyExtractor={(item) => item._id} // Assuming _id is the unique identifier from MongoDB
        />
      </View>

      {/* Team History Section */}
      <View style={styles.container}>
        <Text style={styles.historyText}>Team History</Text>
        <FlatList
          data={teamData}
          renderItem={({ item }) => <TeamItem team={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
};

export default Tournament;
