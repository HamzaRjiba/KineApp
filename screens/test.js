import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { RadioButton, Avatar, Button } from 'react-native-paper';
import axios from 'axios';

const SignupKine = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const setToastMsg = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const permisionFunction = async () => {
    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    setGalleryPermission(imagePermission.status === 'granted');
    if (imagePermission.status !== 'granted') {
      setToastMsg('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
      setImageBase64(result.base64);
     
  
     
    }
    
      
    
  };
  const registerUser = async () => {
    try {
      // Vérifier si tous les champs sont remplis
      if (!name || !email || !dateOfBirth || !password || !phone || !gender || !imageUri) {
       
        console.log('Veuillez remplir tous les champs.');
      }

      

      // Créer un objet avec les données de l'utilisateur
      const userData = {
        nom: name,
        prenom: name,
        date_naissance: dateOfBirth,
        genre: gender,
        adresse: "4454545",
        telephone: phone,
        
        email: email,
        mdp: password,
        image: imageBase64, // Ajoutez l'image sous forme de chaîne base64
      };

      // Envoyer les données à l'API Symfony
      const response = await axios.post('http://127.0.0.1:8000/api/kinesitherapeutes/register', userData);
      console.log(response.data);
      // Vérifier si l'inscription a réussi
      if (response.status === 201) {
        // Afficher un message de succès
        console.log('Inscription réussie !');

      } else {
        // Afficher un message d'erreur en cas d'échec
        console.log(response.data);
      }
    } catch (error) {
      // Gérer les erreurs
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        {step > 0 && (
          <TouchableOpacity onPress={handlePreviousStep} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Inscription Kiné</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Renseigner votre identité</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Date de naissance"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <View style={styles.genderContainer}>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="feminin"
                  status={gender === 'feminin' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('feminin')}
                />
                <Text style={styles.radioButtonLabel}>Féminin</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="masculin"
                  status={gender === 'masculin' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('masculin')}
                />
                <Text style={styles.radioButtonLabel}>Masculin</Text>
              </View>
            </View>

            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                <Avatar.Image
                  size={120}
                  source={{ uri: imageUri }}
                />
                <View style={styles.iconContainer}>
                  <Icon name="plus" size={24} color="#000" />
                </View>
              </TouchableOpacity>
              <Text style={styles.pieceJustificative}>Entrez votre pièce justificative</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((step - 1) / 3) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}

{step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Définir votre mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((step - 1) / 3) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Entrer votre numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={phone}
              onChangeText={setPhone}
            />

           

            <TouchableOpacity style={styles.button} onPress={() => {
        
        registerUser();
        handleNextStep();
      }}>
              <Text style={styles.buttonText}>Terminer</Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((step - 1) / 3) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  genderContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 18,
    padding: 4,
    width: 150,
  },
  radioButtonLabel: {
    fontSize: 16,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#F2F2F2',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#11BD60',
  },
  button: {
    backgroundColor: '#11BD60',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageButton: {
    padding: 5,
    backgroundColor: '#F2F2F2',
    borderRadius: 60,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 3,
  },
  pieceJustificative: {
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default SignupKine;
