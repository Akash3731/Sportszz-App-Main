// Layout.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Footer from "./ManagerFooter"; // Adjust the path based on your file structure

const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
