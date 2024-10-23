import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationForm from "./components/RegistationForm";
import Login from "./components/LoginForm";
import Home from "./components/Home";
import Blog from "./Screens/Blog";
import Club from "./Screens/Club";
import ManagerDashboard from "./Screens/ManagerDashboard";
import Event from "./Screens/Event";
import Sport from "./Screens/Sport";
import Tournament from "./Screens/Tournment";
import CreateTournament from "./Screens/CreateTournament";
import EditTournament from "./components/EditTournament";
import ManageTeams from "./components/ManageTeams";
import Notification from "./Manager/Notifications";
import { AuthProvider } from "./Context/authContext";
import ManagerTournament from "./Manager/ManagerTournament";
import Create_Group from "./Manager/Create_Group";
import Create_Tournament from "./Manager/Create_Tournament";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Register"
            component={RegistrationForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Blog" component={Blog} />
          <Stack.Screen name="Club" component={Club} />
          <Stack.Screen name="Event" component={Event} />
          <Stack.Screen name="Sport" component={Sport} />
          <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />
          <Stack.Screen name="ManageTeams" component={ManageTeams} />
          <Stack.Screen name="Tournament" component={Tournament} />
          <Stack.Screen name="CreateTournament" component={CreateTournament} />
          <Stack.Screen name="EditTournament" component={EditTournament} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Create_Group" component={Create_Group} />
          <Stack.Screen
            name="Create_Tournament"
            component={Create_Tournament}
          />
          <Stack.Screen
            name="ManagerTournament"
            component={ManagerTournament}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
