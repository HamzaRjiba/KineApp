import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { RadioButton, Avatar, Button } from 'react-native-paper';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import SuperAlert from 'react-native-super-alert';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';






const SignupKine = () => {
  const [userType, setUserType] = useState('patient');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const navigation = useNavigation();
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);



  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageUri2, setImageUri2] = useState(null);

  const [galleryPermission, setGalleryPermission] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);

  const [cabinetName, setCabinetName] = useState('');
  const [cabinetAddress, setCabinetAddress] = useState('');
  const [cabinetEmail, setCabinetEmail] = useState('');
  const [cabinetNumber, setCabinetNumber] = useState('');
  
  const handleLogin = () => {
    navigation.navigate('LoginScreenKine');
  };
 const toggleDateTimePicker = () => {
    setDateTimePickerVisible(!isDateTimePickerVisible);
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);
    // Réinitialiser l'étape à 1 lors du changement de type d'utilisateur
    setStep(1);
  };
  const handleNextStep = () => {
    if(step === 1) {
      if (!name || !email || !dateOfBirth || !password || !phone || !gender || !imageUri){
        alert('Veuiller remplir tous les champs');
      }
      else if (validate(email)==false){
        alert('veuillez saisiir un email valide');
      }
      else{
        setStep(step + 1);
      }
         }

         if(step === 2) {
          if (!cabinetName || !cabinetAddress || !cabinetEmail || !cabinetNumber ){
            alert('Veuiller remplir tous les champs');
          }
          else{
            setStep(step + 1);
          }
             }
         
   
  };

  const handlePreviousStep = () => {
    if(step>1){
    setStep(step - 1);
  }
  else {
    navigation.navigate('LoginScreenKine');
  }
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

  const pickPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImageUri2(selectedAsset.uri);
      setPhotoBase64(result.base64);
     
  
     
    }
    
    
  };
  const registerUser = async () => {
    try {
      // Vérifier si tous les champs sont remplis
      if (!name || !email || !dateOfBirth || !password || !phone || !gender || !imageUri) {
       
        alert('Veuillez remplir tous les champs.');
      }

      
      else{
      // Créer un objet avec les données de l'utilisateur
      const userData = {
        nom: name,
        prenom: prenom,
        date_naissance: dateOfBirth,
        genre: gender,
        telephone: phone,
        email: email,
        mdp: password,
        image: imageBase64, // Ajoutez l'image sous forme de chaîne base64
        photo:photoBase64,
        cabinetname: cabinetName,
        cabinetaddress :cabinetAddress,
        cabinetmail :cabinetEmail,
        cabinetnumber: cabinetNumber,
      };

      // Envoyer les données à l'API Symfony
      const response = await axios.post('http://192.168.1.9:8000/api/kinesitherapeutes/register', userData);
      console.log(response.data);
      // Vérifier si l'inscription a réussi
      if (response.status === 201) {
        // Afficher un message de succès
        alert('Inscription réussie !');
        navigation.navigate('LoginScreenKine');


      } else {
        // Afficher un message d'erreur en cas d'échec
        console.log(response.data);
      }}
    } catch (error) {
      // Gérer les erreurs
      console.log(error);
    }
  };
  //******************** *///
  const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase())
}
//inscription patient
  const registerPatient = async () => {
    console.log(validate(email));
    try {
      // Vérifier si tous les champs sont remplis
      if (!name || !prenom|| !email || !dateOfBirth || !password || !phone || !gender || !adresse ) {
       
        alert('Veuillez remplir tous les champs.');
      }
      else if (validate(email)==false){
        alert('veuillez saisiir un email valide');
      }

      else {

      // Créer un objet avec les données de l'utilisateur
      const userData = {
        nom: name,
        prenom: prenom,
        date_naissance: dateOfBirth,
        genre: gender,
        adresse: adresse,
        telephone: phone,   
        email: email,
        mdp: password,
        image: imageBase64, // Ajoutez l'image sous forme de chaîne base64
      };

      // Envoyer les données à l'API Symfony
      const response = await axios.post('http://192.168.1.9:8000/register_patient', userData);
      console.log(response.data);
      // Vérifier si l'inscription a réussi
      if (response.status === 201) {
        // Afficher un message de succès
        alert('Inscription réussie !');
        navigation.navigate('LoginScreenKine');


      } else {
        // Afficher un message d'erreur en cas d'échec
        alert('cet email existe!');
        console.log(response.data);
      }}
    } catch (error) {
      alert('cet email existe!');
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
        <Text style={styles.title}>Inscription {userType === 'patient' ? 'Patient' : 'Kiné'}</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>type d'utilisateur :</Text>
          <Picker
            selectedValue={userType}
            style={styles.picker}
            onValueChange={(itemValue) => handleUserTypeChange(itemValue)}
          >
            <Picker.Item label="Patient" value="patient" />
            <Picker.Item label="Kiné" value="kiné" />
          </Picker>
        </View>

  {userType === 'patient' && step === 1 && (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Renseigner votre identité</Text>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        placeholder="prénom"
        value={prenom}
        onChangeText={setPrenom}
      />
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
    </View>

    <View style={styles.inputContainer}>
   
      <Text style={styles.label}>Date de naissance</Text>
      <TouchableOpacity onPress={toggleDateTimePicker}>
            <TextInput
              style={styles.input}
              placeholder="Cliquez pour choisir une date"
              editable={false}
              value={format(dateOfBirth, 'yyyy-MM-dd')}
            />
          </TouchableOpacity>
          {/* Affichage du TimePicker */}
          {isDateTimePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, dateOfBirth) => {
                setDateOfBirth(dateOfBirth);
                toggleDateTimePicker();
              }}
            />
          )}
   
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
      />
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Adresse</Text>
      <TextInput
        style={styles.input}
        placeholder="Adresse"
        value={adresse}
        onChangeText={setAdresse}
      />
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
    </View>

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
      <Text style={styles.pieceJustificative}>Choisir photo de profil(optionnel)</Text>
    </View>

    <TouchableOpacity style={styles.button}
    onPress={registerPatient}>
      <Text style={styles.buttonText}>S'inscrire</Text>
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



        {userType === 'kiné' && step === 1 && (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Renseigner votre identité</Text>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        placeholder="prénom"
        value={prenom}
        onChangeText={setPrenom}
      />
    </View>


    <View style={styles.inputContainer}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
    </View>

    <View style={styles.inputContainer}>
     
    <Text style={styles.label}>Date de naissance</Text>
      <TouchableOpacity onPress={toggleDateTimePicker}>
            <TextInput
              style={styles.input}
              placeholder="Cliquez pour choisir une date"
              editable={false}
              value={format(dateOfBirth, 'yyyy-MM-dd')}
            />
          </TouchableOpacity>
          {/* Affichage du TimePicker */}
          {isDateTimePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, dateOfBirth) => {
                setDateOfBirth(dateOfBirth);
                toggleDateTimePicker();
              }}
            />
          )}
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
      />
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
    </View>

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
      <Text style={styles.pieceJustificative}>Choisir photo de profil</Text>
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

{userType === 'kiné' && step === 2 && (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Informations du cabinet</Text>
    <TextInput
      style={styles.input}
      placeholder="Nom du cabinet"
      value={cabinetName}
      onChangeText={setCabinetName}
    />
    <TextInput
      style={styles.input}
      placeholder="Adresse du cabinet"
      value={cabinetAddress}
      onChangeText={setCabinetAddress}
    />
    <TextInput
      style={styles.input}
      placeholder="Email du cabinet"
      value={cabinetEmail}
      onChangeText={setCabinetEmail}
    />
    <TextInput
      style={styles.input}
      placeholder="Numéro du cabinet"
      value={cabinetNumber}
      onChangeText={setCabinetNumber}
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

        {userType === 'kiné' && step === 3 && (
          <View>
         <View style={styles.imageContainer}>
         <TouchableOpacity onPress={pickPhoto} style={styles.imageButton}>
           <Avatar.Image
             size={120}
             source={{ uri: imageUri2 }}
           />
           <View style={styles.iconContainer}>
             <Icon name="plus" size={24} color="#000" />
           </View>
         </TouchableOpacity>
         <Text style={styles.pieceJustificative}>Piece Professionnelle justificative</Text>
       </View>

           

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
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    marginTop: 16,
    
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pickerContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 16,
  },
  picker: {
    flex: 1,
    height: 40,
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
    width:300,
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
    backgroundColor: '#e61c28',
  },
  button: {
    backgroundColor: '#e61c28',
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
  label: {
    fontSize: 16,
    marginBottom: 8, // Espace entre le label et l'input
  },
});


export default SignupKine;
