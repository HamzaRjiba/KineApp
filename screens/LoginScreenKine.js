import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuperAlert from 'react-native-super-alert';
import { BackHandler } from 'react-native';








 

const LoginScreenKine = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const exitApp = () => {
    BackHandler.exitApp();
  };

  useEffect(() => {
    fetchDataFromAsyncStorage();
    console.log(userData);
    const onBackPress = () => {
      // Empêchez le retour en arrière en renvoyant true
      return true;
    };

    // Ajoutez le gestionnaire d'événements BackHandler uniquement sur cet écran
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Nettoyez le gestionnaire lors du démontage de l'écran
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
    
  }, []);

  

  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      console.log(userData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
       
        setUserData(parsedData);
        
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const handleLogin = () => {
    const requestData = {
      email: email,
      password: password,
    };
  
    axios
      .post('http://192.168.1.8:8000/api/loginKine', requestData)
      .then(response => {
        // Connexion réussie, enregistrez les données dans AsyncStorage
        let userInfo = response.data.Kinesitherapeutes;
        let admin =response.data.admin;
        console.log(userInfo);
        console.log(admin);
        if(userInfo==null && admin==null) {
          userInfo = response.data.patients;
          const updatedData = { ...userData, firstName: userInfo.nom, lastName: userInfo.prenom, userId:userInfo.id };
          AsyncStorage.setItem('userData', JSON.stringify(updatedData));
          setUserData(updatedData);
         }
         else if (userInfo!=null && admin==null) {
          const updatedData = { ...userData, firstName: userInfo.nom, lastName: userInfo.prenom, userId:userInfo.id };
          AsyncStorage.setItem('userData', JSON.stringify(updatedData));
          setUserData(updatedData);
         }
         else if (admin!=null) {
          userInfo = response.data.admin;
          const updatedData = { ...userData, firstName: userInfo.email, lastName: userInfo.email, userId:userInfo.id };
          AsyncStorage.setItem('userData', JSON.stringify(updatedData));
          setUserData(updatedData);
         }
      
        
       
         if(admin!=null)  {
          navigation.navigate('KinesitherapeuteList');
  
         }
    
       else if(response.data.Kinesitherapeutes==null) {
       
           navigation.navigate('HomePatient');
       }
       else if(response.data.Kinesitherapeutes!=null)  {
        navigation.navigate('Rdv');

       }
      
           
      })
      .catch(error => {
     
                alert("données incorrectes")
      });
  };
  

  const handleForgotPassword = () => {
    // Gérer la logique pour réinitialiser le mot de passe
    // ...
  };

  const handleSignUp = () => {
    navigation.navigate('SignupKineScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <View style={styles.appBarc}>
        <Image source={require('../assets/log.png')} style={styles.logo} />
        <Text style={styles.appBarTitle}>Identification</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/logoapp.png')} style={styles.welcomeLogo} />
        <Text style={styles.title}>Bienvenue !</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          placeholderTextColor="#aaa"
        />
        <Button title="Se connecter" onPress={handleLogin} color="#e61c28" />
        <Text style={styles.forgotPassword} onPress={handleForgotPassword}>Mot de passe oublié ?</Text>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SuperAlert
        visible={showAlert}
        title="Alerte personnalisée"
        message="Ceci est un message d'alerte personnalisée."
        type="error"
        onBackdropPress={handleCloseAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  appBar: {
    backgroundColor: '#e61c28',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarc: {
    backgroundColor: '#e61c28',
    paddingVertical: 30,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  logo: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  welcomeLogo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  forgotPassword: {
    marginTop: 8,
    color: '#666',
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  signUpText: {
    color: '#666',
    marginRight: 8,
  },
  signUpLink: {
    color: '#e61c28',
    textDecorationLine: 'underline',
  },
});

export default LoginScreenKine;
