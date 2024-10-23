import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios'; // Assuming you are using axios for API requests
import { useAuth } from '../Context/authContext';

const Notifications = () => {
  const { auth } = useAuth(); // Get auth context
  console.log('Auth Object:', auth);
  const managerId = auth?.managerId; // Access managerId safely

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const managerId = auth?.id;
    console.log('Manager ID:', managerId);
    if (managerId) {

      // Fetch the notifications for the manager
      axios.get(`http://192.168.0.141:5050/api/managers/${managerId}/notifications`)
        .then(response => {
          console.log('Fetched notifications:', response.data.notifications);
          setNotifications(response.data.notifications || []);
        })
        .catch(error => {
          console.error('Error fetching notifications:', error);
        });
    }
  }, [managerId]);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.icon}>
        <Text style={styles.iconText}></Text>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.TextContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.time}>{new Date(item.time).toLocaleString()}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No notifications available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
    color: '#007AFF',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    color: '#7E57C2',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  TextContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#606060',
  },
  time: {
    fontSize: 12,
    color: '#909090',
  },
});

export default Notifications;

