import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet,TouchableOpacity } from 'react-native';
import axios from 'axios';
import Iconn from 'react-native-vector-icons/FontAwesome5'; 
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';


const ListPatients = () => {
  const [patients, setPatients] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    // Remplacez l'URL par l'URL de votre API Symfony
    const apiUrl = 'http://192.168.1.9:8000/api/patients/6'; // Exemple avec l'ID du kiné

    axios.get(apiUrl)
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des patients :', error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.patientContainer}>
      <Image
        source={{ uri: 'http://192.168.1.9:8000/uploads/' + item.patient.photo }} // Remplacez par l'URL de l'image du patient
        style={styles.patientImage}
      />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>Nom: {item.patient.nom}</Text>
        <Text style={styles.patientName}>Prénom: {item.patient.prenom}</Text>
        <Text>Rendez-vous manqués: {item.nombre_reported}</Text>
      </View>
      <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.detailsButton}>
      <Iconn name="eye" size={20} color="white" style={styles.icon} />

        <Text style={styles.detailsButtonText}>Détails</Text>
      </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} 
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Mes patients</Text>
      </View>
      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={(item) => item.patient.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
   
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  patientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginLeft:30,
    marginRight:30,
   
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  patientInfo: {
    marginLeft: 10,
  },
  patientName: {
    fontWeight: 'bold',
  },
  appBar: {
    paddingTop: 20,
    backgroundColor: '#e61c28',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 80,
  },
  backButton: {
    marginRight: 16,
    borderRadius: 20,
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row', // Pour aligner l'icône et le texte horizontalement
    alignItems: 'center',
    width:100,
    alignSelf:'flex-end',
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8, 
  },
});

export default ListPatients;
