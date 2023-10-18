import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#777',
  },
});

const ProgramItem = ({ title, description, sessions, duration }) => (
  <View style={styles.container}>
    <View style={styles.icon}>
      <Icon name="star" size={24} color="#FFD700" />
    </View>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="play-circle" size={20} color="#007AFF" />
        <Text style={{ marginLeft: 4 }}>{sessions} séances</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="clock" size={20} color="#007AFF" />
        <Text style={{ marginLeft: 4 }}>{duration} mins</Text>
      </View>
    </View>
  </View>
);

export default ProgramItem;
