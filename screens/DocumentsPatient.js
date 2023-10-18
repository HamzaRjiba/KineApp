import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';



const DocumentsPatient = () => {
  const [dossiersMedicaux, setDossiersMedicaux] = useState([]);
  const [userData, setUserData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const navigation = useNavigation();


  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        axios.post('http://192.168.1.9:8000/api/dossiers-medicaux-by-rendez-vous', {
          id: parsedData.userId,
          rendezvous: [20, 21, 22] // Remplacez par les ID de vos rendez-vous
        })
        .then((response) => {
          setDossiersMedicaux(response.data);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des dossiers médicaux :', error);
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    fetchDataFromAsyncStorage();
  }, []);

  const handleConsulter = (imageURL) => {
    setSelectedImage(imageURL);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes documents</Text>

        </View>
      <FlatList
        data={dossiersMedicaux}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.dossierMedical}>
            <Text>Type de document : {item.type}</Text>
            <Text>Date de création : {item.date_creation}</Text>
            <TouchableOpacity
              style={styles.consulterButton}
              onPress={() => handleConsulter(item.document)}
            >
              <Text style={styles.buttonText}>Consulter</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View style={styles.modalContent}>
          <Image
            source={{ uri: 'http://192.168.1.9:8000/uploads/' + selectedImage }}
            style={styles.modalImage}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dossierMedical: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
    marginLeft:16,
    marginRight:16,
  },
  consulterButton: {
    backgroundColor: '#067618',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    width:150,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
  closeButton: {
    backgroundColor: '#e61c28',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  appBar: {
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
});

export default DocumentsPatient;
