import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button,TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';


const Edit = () => {
  const [emploi, setEmploi] = useState([]);
  const [userData, setUserData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMotif, setSelectedMotif] = useState('');
  const [selectedHoraire, setSelectedHoraire] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();


  const motifs = ['Motif1', 'Motif2', 'Motif3', 'Motif4'];
  const handleButtonKine= () => {
    navigation.navigate('RendezVousPatient');
    
  };
  const handleBack = () => {
    navigation.goBack();
  };
  

  const fetchUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        setUserData(userData);
        console.log(userData);
        
        axios
          .get('http://192.168.1.10:8000/api/kine/'+userData.idmod+'/emp')
          .then((response) => {
            setEmploi(response.data);
          })
          .catch((error) => {
            console.error(
              'Erreur lors de la récupération de l\'emploi du kiné :',
              error
            );
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const openModal = (horaire, date) => {
    setSelectedHoraire(horaire);
    setSelectedDate(date);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleMotifChange = (motif) => {
    setSelectedMotif(motif);
  };

  const sendRendezVous = () => {
    // Préparez les données à envoyer à l'API
    const rendezVousData = {
      datenew: selectedDate,
      horairenew: selectedHoraire,
      date:userData.datemod,
      horaire:userData.horairemod,
    };
    console.log(userData.datemod);
    console.log(userData.horairemod);

    // Effectuez une requête HTTP POST vers l'API
    axios
      .post('http://192.168.1.10:8000/'+userData.idmod+'/editrend', rendezVousData)
      .then((response) => {
        alert('Rendez-vous modifié avec succès', response.data);
        // Vous pouvez effectuer des actions supplémentaires ici, comme fermer la modal
        navigation.navigate('RendezVousPatient');

        closeModal();
      })
      .catch((error) => {
        console.error('Erreur lors de la création du rendez-vous :', error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.dateContainer}>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.horaireContainer}>
        {item.horaires.map((horaire, index) => (
          <Text
            key={index}
            style={styles.horaire}
            onPress={() => openModal(horaire, item.date)}
          >
            {horaire}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View>
       <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} onPress={handleBack} />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier Rendez-Vous</Text>
      </View>
      <FlatList
        data={emploi}
        keyExtractor={(item) => item.date}
        renderItem={renderItem}
      />

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text>Date : {selectedDate}</Text>
          <Text>Horaire : {selectedHoraire}</Text>
          <Text>Motif sélectionné : {selectedMotif}</Text>
          <Picker
            selectedValue={selectedMotif}
            onValueChange={(itemValue) => handleMotifChange(itemValue)}
            style={{ height: 50, width: 200 }}
          >
            {motifs.map((motif, index) => (
              <Picker.Item key={index} label={motif} value={motif} />
            ))}
          </Picker>
          <Button style={styles.rdv} title="Créer Rendez-vous" onPress={sendRendezVous} />
          <Button title="Fermer" style={styles.rdv} onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 16,
  },
  rdv:{
        
    marginTop:30,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  horaireContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  horaire: {
    margin: 4,
    backgroundColor: '#11BD60',
    padding: 4,
    borderRadius: 4,
    color: 'white',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  appBar: {
    backgroundColor: '#11BD60',
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

export default Edit;
