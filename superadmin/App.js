import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "../Sportszz/src/contexts/AuthContext";
import AppNavbar from "../Sportszz/src/components/AppNavbar";
import SuperadminLoginPage from "../Sportszz/src/components/SuperadminLoginPage";
import SuperadminHome from "../Sportszz/src/components/Superhome";
import ApprovedUsers from "../Sportszz/src/components/ApprovedUsers";
import PendingUsers from "../Sportszz/src/components/PendingUsers";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabContent = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="SuperadminHome"
        component={SuperadminHome}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ApprovedUsers"
        component={ApprovedUsers}
        options={{
          tabBarLabel: "Approved Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PendingUsers"
        component={PendingUsers}
        options={{
          tabBarLabel: "Pending Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainContent = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="HomeTabs"
        component={TabContent}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ApprovedUsers"
        component={ApprovedUsers}
        options={{
          drawerLabel: "Approved Users",
          drawerIcon: ({ color }) => (
            <Ionicons name="checkmark-done-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PendingUsers"
        component={PendingUsers}
        options={{
          drawerLabel: "Pending Users",
          drawerIcon: ({ color }) => (
            <Ionicons name="hourglass-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavbar />
        <Stack.Navigator>
          <Stack.Screen
            name="SuperadminLoginPage"
            component={SuperadminLoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainContent"
            component={MainContent}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
