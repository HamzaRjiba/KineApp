import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';




const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedKine, setSelectedKine] = useState(null);
  
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchDataFromAsyncStorage();
  }, []);

  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };
  const handleSearch = async () => {
    try {
      const response = await fetch('http://192.168.1.9:8000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchText }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        // Gérer les erreurs de requête ici
      }
    } catch (error) {
      // Gérer les erreurs de fetch ici
    }
  };

  const sendKineDataToApi = async (nom, prenom,photo) => {
    try {
      const response = await fetch('http://192.168.1.9:8000/api/send-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, prenom,photo }),
      });

      if (response.ok) {
        
        
        const ressponseData = await response.json();
      console.log(ressponseData.kinesitherapeute);
     
        const updatedData = { ...userData, nomK: ressponseData.kinesitherapeute.nom,
          kineId: ressponseData.kinesitherapeute.id,
           prenomK: ressponseData.kinesitherapeute.prenom, photoK:ressponseData.kinesitherapeute.photo,
           dateNaissanceK: ressponseData.kinesitherapeute.dateNaissance,
           genreK: ressponseData.kinesitherapeute.genre,
           adresseK: ressponseData.kinesitherapeute.adresse,
           telephoneK: ressponseData.kinesitherapeute.telephone,
           emailK: ressponseData.kinesitherapeute.email};
        AsyncStorage.setItem('userData', JSON.stringify(updatedData));
       
        console.log(userData.kineId);

        

        
      

        navigation.navigate('KineDetailsScreen');
       
      
        

      } else {
        // Gérer les erreurs d'envoi ici
      }
    } catch (error) {
      // Gérer les erreurs de fetch ici
    }
  };

  const handleSelectKine = (kine) => {
    setSelectedKine(kine);
    sendKineDataToApi(kine.nom, kine.prenom,kine.photo);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleSelectKine(item)}
      style={styles.searchResult}
    >
      <Image source={{ uri: `http://192.168.1.9:8000/uploads/${item.photo}` }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.text}>Nom: {item.nom}</Text>
        <Text style={styles.text}>Prénom: {item.prenom}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Recherche</Text>
      </View>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16 }}
        placeholder="Rechercher un kinésithérapeute"
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          handleSearch(text);
        }}
      />

      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default SearchScreen;
