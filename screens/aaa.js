import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage depuis le bon package

const StoreDataScreen = () => {
  const handleStoreData = async () => {
    try {
      // Simuler des données utilisateur
      const userData = {
        firstName: '',
        lastName: '',
        userId: '',
        kineId: '',
        nomK:'',
        prenomK:'', 
        photoK:'',
        dateNaissanceK: '', 
        genreK: '', 
        adresseK: '', 
        telephoneK: '', 
        pieceK: '', 
        emailK: '' ,
        ip: '192.168.1.8', 
        mardi: '', 
        mercredi: '', 
        jeudi: '', 
        vendredi: '', 
        samedi: '', 
        dimanche: '', 
        datemod:'',
        horairemod:'',
        idmod:'',

      };

      // Stocker les données dans AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      console.log('Données stockées avec succès.');
    } catch (error) {
      console.error('Erreur lors du stockage des données :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Appuyez sur le bouton pour stocker les données dans AsyncStorage.</Text>
      <Button title="Stocker les données" onPress={handleStoreData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoreDataScreen;
