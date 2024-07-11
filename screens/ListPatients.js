import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import Iconn from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ListPatients = () => {
  const [patients, setPatients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState({});
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});


  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        const apiUrl = 'http://192.168.1.8:8000/api/patients/'+parsedData.userId; // Exemple avec l'ID du kiné

    axios.get(apiUrl)
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des patients :', error);
      });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    fetchDataFromAsyncStorage();
    
  }, []);

  const handleChat =async (id) => {

    const updatedData = { ...userData, kineId:id};
    AsyncStorage.setItem('userData', JSON.stringify(updatedData));
    console.log(userData.kineId);
    navigation.navigate('ConversationScreenKine');
  }

  const openPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

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
        renderItem={({ item }) => (
          <View style={styles.patientContainer}>
            <Image
              source={{ uri: 'http://192.168.1.8:8000/uploads/' + item.patient.photo }} // Remplacez par l'URL de l'image du patient
              style={styles.patientImage}
            />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Nom: {item.patient.nom}</Text>
              <Text style={styles.patientName}>Prénom: {item.patient.prenom}</Text>
              <Text>Rendez-vous manqués: {item.nombre_reported}</Text>
            </View>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.chatButton} onPress={() => handleChat(item.patient.id)}>
            <Iconn name="envelope" size={30} color="#333333" />
              </TouchableOpacity>
            <TouchableOpacity style={styles.detailsButton} onPress={() => openPatientDetails(item.patient)}>
              <Iconn name="eye" size={20} color="white" style={styles.icon} />
              <Text style={styles.detailsButtonText}>Détails</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.patient.id.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Détails du patient</Text>
          <Text style={styles.modalText}>Adresse: {selectedPatient.adresse}</Text>
          <Text style={styles.modalText}>Téléphone: {selectedPatient.tel}</Text>
          <Text style={styles.modalText}>E-mail: {selectedPatient.email}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginLeft: 20,
    marginRight: 20,
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
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
    alignSelf: 'flex-end',
    marginLeft:15,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
  modalContainer: {
    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginLeft:20,
    width:50,
    marginBottom:7,
  },
});

export default ListPatients;
