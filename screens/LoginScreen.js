import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchDataFromAsyncStorage();
  }, []);

  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
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
      .post('http://192.168.1.10:8000/api/login', requestData)
      .then(response => {
        const userInfo = response.data.patient;
     
         const updatedData = { ...userData, firstName: userInfo.nom, lastName: userInfo.prenom, userId:userInfo.id };
          AsyncStorage.setItem('userData', JSON.stringify(updatedData));
          setUserData(updatedData);

          
         
     
      console.log(userData.firstName);
      console.log(userData.lastName);
      console.log(userData.userId);
      navigation.navigate('HomePatient');


      

      })
      .catch(error => {
        // Gestion des erreurs
        console.error(error);
      });
  };

  const handleKine = () => {
    navigation.navigate('LoginScreenKine');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUpScreen');
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
        <Image source={require('../assets/aaa.png')} style={styles.welcomeLogo} />
        <Text style={styles.title}>Bienvenue ! </Text>
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
        <Button title="Se connecter" onPress={handleLogin} color="#11BD60" />
        <Text style={styles.forgotPassword} >Mot de passe oublié ?</Text>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>S'inscrire</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleKine}>
            <Text style={styles.signUpLink}>kiné</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  appBar: {
    backgroundColor: '#11BD60',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarc: {
    backgroundColor: '#11BD60',
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
    width: 200,
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
    color: '#11BD60',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
