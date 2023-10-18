import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';


import { Picker } from '@react-native-picker/picker';

import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import CustomNavigationBar from './CustomNavigationBar';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { format } from 'date-fns';

const KineDetailsScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHoraire, setSelectedHoraire] = useState('');
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedMotif, setSelectedMotif] = useState('');
  const [isMotifSelected, setIsMotifSelected] = useState(false);


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleDateTimePicker = () => {
    setDateTimePickerVisible(!isDateTimePickerVisible);
  };

  const toggleTimePicker = () => {
    setTimePickerVisible(!isTimePickerVisible);
  };

  const handleButtonChat = () => {
    navigation.navigate('ConversationScreen');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePrendreRendezVous = async () => {
    console.log('Date sélectionnée:', selectedDate);
    console.log('Horaire sélectionné:', selectedHoraire);
    console.log('Motif du rendez-vous:', motif);

    toggleModal();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const userData = JSON.parse(storedData);
          setUserData(userData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const sendRendezVous = () => {
    // Préparez les données à envoyer à l'API
    const rendezVousData = {
      date: selectedDate,
      horaire: selectedHoraire,
      motif: selectedMotif,
      patient:userData.userId,
      kine:userData.kineId,
    };
    console.log(rendezVousData);

    // Effectuez une requête HTTP POST vers l'API
    axios
      .post('http://192.168.1.9:8000/rendez-vous', rendezVousData)
      .then((response) => {
        alert('Rendez-vous créé avec succès');
        // Vous pouvez effectuer des actions supplémentaires ici, comme fermer la modal
        //navigation.navigate('RendezVousPatient');

      })
      .catch((error) => {
        console.error('Erreur lors de la création du rendez-vous :', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconLeft}>
          <Icon name="arrow-left" size={28} color="white" onPress={handleBack} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconRight} onPress={handleButtonChat}>
          <FontAwesome5 name="envelope" size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: `http://192.168.1.9:8000/uploads/${userData.photoK}` }} style={styles.photo} />
        <Text style={styles.name}>{userData.nomK} {userData.prenomK}</Text>
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>Prendre rendez-vous</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <View style={styles.detailContainer}>
          <View style={styles.detailItem}>
            <FontAwesome5 name="venus-mars" style={styles.icon} />
            <Text style={styles.detailText}>Genre:</Text>
          </View>
          <Text style={styles.detailValue}>{userData.genreK}</Text>
        </View>
        <View style={styles.detailContainer}>
    <View style={styles.detailItem}>
      <FontAwesome5 name="map-marker-alt" style={styles.icon} />
      <Text style={styles.detailText}>Adresse:</Text>
    </View>
    <Text style={styles.detailValue}>{userData.adresseK}</Text>
  </View>

  <View style={styles.detailContainer}>
    <View style={styles.detailItem}>
      <FontAwesome5 name="phone" style={styles.icon} />
      <Text style={styles.detailText}>Téléphone:</Text>
    </View>
    <Text style={styles.detailValue}>{userData.telephoneK}</Text>
  </View>

  <View style={styles.detailContainer}>
    <View style={styles.detailItem}>
      <FontAwesome5 name="envelope" style={styles.icon} />
      <Text style={styles.detailText}>Email:</Text>
    </View>
    <Text style={styles.detailValue}>{userData.emailK}</Text>
  </View>

  <View style={styles.detailContainer}>

  <View style={styles.detailItem}>
  <FontAwesome5 name="money-bill-wave" style={styles.icon} />
  <Text style={styles.detailText}>Moyens : </Text>
  </View>
  <Text style={styles.detailValue}>chèque,espèce</Text>
</View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Sélectionnez la date :</Text>
          {/* Utilisation de TouchableOpacity pour afficher le DateTimePicker */}
          <TouchableOpacity onPress={toggleDateTimePicker}>
            <TextInput
              style={styles.input}
              placeholder="Cliquez pour choisir une date"
              editable={false}
              value={format(selectedDate, 'yyyy-MM-dd')}
            />
          </TouchableOpacity>
          {/* Affichage du TimePicker */}
          {isDateTimePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setSelectedDate(selectedDate);
                toggleDateTimePicker();
              }}
            />
          )}
          {/* Utilisation de TouchableOpacity pour afficher le TimePicker */}
          <TouchableOpacity onPress={toggleTimePicker}>
            <TextInput
              style={styles.input}
              placeholder="Cliquez pour choisir l'horaire"
              editable={false}
              value={selectedHoraire}
            />
          </TouchableOpacity>
          {/* Affichage du TimePicker */}
          {isTimePickerVisible && (
            <DateTimePicker
              testID="timePicker"
              value={selectedDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      selectedTime.getHours(),
                      selectedTime.getMinutes()
                    )
                  );
                  setSelectedHoraire(format(selectedTime, 'HH:mm'));
                }
                toggleTimePicker();
              }}
            />
          )}
          <Picker
      selectedValue={selectedMotif}
      style={styles.picker}
      onValueChange={(itemValue, itemIndex) => {
        setSelectedMotif(itemValue);
        setIsMotifSelected(true); // Définissez l'état sur vrai lorsque l'utilisateur effectue une sélection
      }}
    >
      
      <Picker.Item label="Motif 1" value="motif1" />
      <Picker.Item label="Motif 2" value="motif2" />
      <Picker.Item label="Motif 3" value="motif3" />
    </Picker>
          <TouchableOpacity style={styles.buttonModal} onPress={sendRendezVous}>
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonModal} onPress={toggleModal}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e61c28',
    position: 'relative',
    marginTop: 30,
  },
  iconLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  iconRight: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  button: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 20,
    backgroundColor: '#067618',
    paddingVertical: 10,
    borderRadius: 5,
    width: 200,
    marginLeft: 80,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e61c28',
  },
  name: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#e61c28',
    color: '#FFFFFF',
  },
  details: {
    padding: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 20,
    color: '#333',
  },
  detailText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 18,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonModal: {
    backgroundColor: '#067618',
    paddingVertical: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default KineDetailsScreen;
