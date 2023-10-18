// CustomNavigationBar.js
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importer FontAwesome5 pour les icônes


const CustomNavigationBar = () => {
  const navigation = useNavigation(); // Utilisez useNavigation() pour accéder à l'objet de navigation

  const handleButtonPress = () => {
    navigation.navigate('Rdv'); // Naviguez vers l'interface "rdv" en utilisant son nom dans la navigation
  };
  const handleButtonRdv= () => {
    navigation.navigate('RendezVous',{ forceReload: true }); // Naviguez vers l'interface "rdv" en utilisant son nom dans la navigation

  };

  const handleButtonProg= () => {
    navigation.navigate('ProgramScreen'); // Naviguez vers l'interface "rdv" en utilisant son nom dans la navigation
    
  };
  
  const handleButtonPaiement= () => {
    navigation.navigate('PaymentListScreen'); // Naviguez vers l'interface "rdv" en utilisant son nom dans la navigation
    
  };


  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity style={styles.navItem} onPress={handleButtonPress}>
        <Icon name="home" size={25} color="black" style={styles.navIcon} />
        <Text style={styles.navText}>Accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={handleButtonRdv}>
        <Icon name="calendar" size={25} color="black" style={styles.navIcon} />
        <Text style={styles.navText}>Rendez-vous</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={handleButtonProg}>
        <Icon name="walking" size={25} color="black" style={styles.navIcon} />
        <Text style={styles.navText}>Programmes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={handleButtonPaiement}>
      <FontAwesome5 name="money-bill-wave"   size={25} color="black" style={styles.navIcon} />
        <Text style={styles.navText}>paiement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor:'#D9D9D9',
        marginTop:16,
      },
      navItem: {
        alignItems: 'center',
      },
      navIcon: {
        width: 30,
        height: 30,
        marginBottom: 5,
        
      },
      navText: {
        color: 'black',
      },
    });

export default CustomNavigationBar;
