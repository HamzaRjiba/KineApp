import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const AppointmentScreen = () => {
  const appointments = [
    { id: 1, date: '2023-05-24', time: '10:00', location: 'Cabinet A' },
    { id: 2, date: '2023-05-26', time: '14:30', location: 'Cabinet B' },
    { id: 3, date: '2023-05-28', time: '16:00', location: 'Cabinet C' },
  ];

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentDate}>{item.date}</Text>
        <Text style={styles.appointmentTime}>{item.time}</Text>
      </View>
      <Text style={styles.appointmentLocation}>{item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes rendez-vous</Text>
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentTime: {
    fontSize: 16,
    color: '#666',
  },
  appointmentLocation: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default AppointmentScreen;
