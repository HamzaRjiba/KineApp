import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Iconn from 'react-native-vector-icons/Feather';
import { RadioButton, Avatar, Button } from 'react-native-paper';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import SuperAlert from 'react-native-super-alert';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';




// Composant de séparation entre les sections
const Separator = () => (
  <View style={styles.separatorContainer}>
    <View style={styles.separatorLine} />
  </View>
);

const AccountManagementScreen = () => {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [kineData, setKineData] = useState([]);

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isCabinetModalVisible, setCabinetModalVisible] = useState(false);
  const [isPhoneModalVisible, setPhoneModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isCodeModalVisible, setCodeModalVisible] = useState(false);

  const [userType, setUserType] = useState('patient');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);



  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(getRandomFourDigitInt());
    const [codev, setCodev] = useState([]);
    const [codever, setCodever] = useState(0);


  const [gender, setGender] = useState('');
  const [cabinetName, setCabinetName] = useState('');
  const [cabinetAddress, setCabinetAddress] = useState('');
  const [cabinetEmail, setCabinetEmail] = useState('');
  const [cabinetNumber, setCabinetNumber] = useState('');

  const setToastMsg = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const toggleDateTimePicker = () => {
    setDateTimePickerVisible(!isDateTimePickerVisible);
  };


  const permisionFunction = async () => {
    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    setGalleryPermission(imagePermission.status === 'granted');
    if (imagePermission.status !== 'granted') {
      setToastMsg('Permission for media access needed.');
    }
  };

  useEffect(() => {
    fetchDataFromAsyncStorage();
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

  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        axios.get(`http://192.168.1.9:8000/kine/${parsedData.userId}`)
          .then((response) => {
            const responseData = response.data;
            setKineData(responseData);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données:', error);
          });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };
  const updateData = {
    nom: name,
    prenom: prenom,
    date_naissance: dateOfBirth,
    genre: gender,
    telephone: phone,
    email: email,
    mdp: password,
    image: imageBase64, // Ajoutez l'image sous forme de chaîne base64
    cabinetname: cabinetName,
    cabinetaddress :cabinetAddress,
    cabinetmail :cabinetEmail,
    cabinetnumber: cabinetNumber,
  };
  const handleUpdateKine = async () => {
    try {
      // Remplacez l'URL par l'endpoint de votre API pour la modification du kiné
      const response = await axios.put('http://192.168.1.9:8000/modifier-kine/'+userData.userId, updateData);
      console.log(updateData);
      if (response.status === 200) {
        // Generate a random integer with exactly four digits (range: 1000 to 9999)

        // La mise à jour a réussi, vous pouvez afficher un message de succès ou effectuer d'autres actions
        alert('Les informations du kiné ont été mises à jour avec succès.');
        fetchDataFromAsyncStorage();
        setProfileModalVisible(false);
        setCabinetModalVisible(false);

      } else {
        // La mise à jour a échoué, affichez un message d'erreur
        alert('Erreur de mise à jour', 'La mise à jour du kiné a échoué.');
      }
    } catch (error) {
      // Gérez les erreurs, par exemple, affichez un message d'erreur
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour du kiné.');
      console.error(error);
    }
  };
  function getRandomFourDigitInt() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  const sendVerificationCodeEmail = async () => {
   

 
    try {
      const apiUrl = 'http://192.168.1.9:8000/send-code'; // Replace with your API URL
      const requestData = {
        code: code,
        mail: email,
      };
  
      const response = await axios.post(apiUrl, requestData);
  
      // Check the response status
      if (response.status === 200) {
        setCodeModalVisible(true);
        console.log(response.data.code);
        setCodev(response.data);
        console.log(codev.code);
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const modifierEmailKine = async (email, code1, code2) => {
    try {
      const apiUrl = 'http://192.168.1.9:8000/kinesitherapeutes/'+userData.userId+'/modifier-email'; // Remplacez par l'URL de votre API
      console.log(apiUrl);
      const data = {
        email: codev.email,
        code1: codev.code,
        code2: parseInt(codever),
      };
    console.log(data);
  
      // Effectuez la requête HTTP POST
      const response = await axios.post(apiUrl, data);
  
      if (response.status === 200) {
        // La modification de l'email a réussi
        alert('E-mail modifié avec succès');
      } else {
        // La modification de l'email a échoué
        console.error('Code de vérification invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'email :', error);
    }
  };
  const handleDeleteKine = (id) => {
    // Faites une requête DELETE pour supprimer le kinésithérapeute par son ID
    Axios.delete(`http://192.168.1.9:8000/admin/supp/${id}`)
      .then((response) => {
        alert('Votre Compte a été supprimé avec succès');
        navigation.navigation.navigate('LoginScreenKine');
        // Mettez à jour la liste des kinésithérapeutes en supprimant celui supprimé
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du kinésithérapeute : ', error);
      });
  };
  const handleConfirm =(id)=>{
    alert(
        'Confirmation', // This is a title
        "Etes vous sure de supprimer ce kiné ?", // This is a alert message
        {
            textConfirm: 'Confirm', // Label of button confirm
            textCancel: 'Cancel', // Label of button cancel
            onConfirm: () => handleDeleteKine(id) ,// Call your confirm function 
            onCancel: () => cancelClick() // Call your cancel function 
        }
    )
  }

  cancelClick = () => {
    console.log('Cancel Action')
  }
  return (
    <ScrollView style={styles.container}>
      {/* Barre d'application existante */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Mon compte</Text>
      </View>

      {/* Section "Identité" */}
      <View style={styles.identitySection}>
        <Text style={styles.sectionTitle}>Identité</Text>
        <TouchableOpacity onPress={() => setProfileModalVisible(true)} style={styles.listItem}>
          <Icon name="user" size={18} color="#555" style={styles.icon} />
          <Text style={styles.listItemTitle}>Mon profil</Text>
          <Text style={styles.listItemDescription}>{kineData.nom} {kineData.prenom}</Text>
          <View style={styles.pill}>
            <Icon name="pen" size={16} color="white" style={styles.editIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCabinetModalVisible(true)} style={styles.listItem}>
          <Icon name="building" size={18} color="#555" style={styles.icon} />
          <Text style={styles.listItemTitle}>Cabinet</Text>
          <Text style={styles.listItemDescription}>{kineData.nom_cabinet}</Text>
          <View style={styles.pill}>
            <Icon name="pen" size={16} color="white" style={styles.editIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Séparateur */}
      <Separator />

      {/* Section "Connexion" */}
      <View style={styles.identitySection}>
        <Text style={styles.sectionTitle}>Connexion</Text>
        <TouchableOpacity onPress={() => setPhoneModalVisible(true)} style={styles.listItem}>
          <Icon name="phone" size={18} color="#555" style={styles.icon} />
          <Text style={styles.listItemTitle}>Téléphone</Text>
          <Text style={styles.listItemDescription}>+216 29 870 469</Text>
          <View style={styles.pill}>
            <Icon name="pen" size={16} color="white" style={styles.editIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEmailModalVisible(true)} style={styles.listItem}>
          <Icon name="envelope" size={18} color="#555" style={styles.icon} />
          <Text style={styles.listItemTitle}>E-mail</Text>
          <Text style={styles.listItemDescription}>{kineData.email}</Text>
          <View style={styles.pill}>
            <Icon name="pen" size={16} color="white" style={styles.editIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPasswordModalVisible(true)} style={styles.listItem}>
          <Icon name="lock" size={18} color="#555" style={styles.icon} />
          <Text style={styles.listItemTitle}>Mot de passe</Text>
          <Text style={styles.listItemDescription}>•••••••••••••••</Text>
          <View style={styles.pill}>
            <Icon name="pen" size={16} color="white" style={styles.editIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Séparateur */}
      <Separator />

      {/* Section "Confidentialité" */}
      <View style={styles.identitySection}>
        <Text style={styles.sectionTitle}>Confidentialité</Text>
        <TouchableOpacity style={styles.listItem}>
          <Icon name="cogs" size={18} color="#555" style={styles.icon} />
          <Text style={styles.listItemDescription}>Mes préférences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <Icon name="info-circle" size={18} color="#555" style={styles.icon} />
          <Text style={styles.listItemDescription}>Informations légales</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Avatar.Image size={120} source={{ uri: imageUri }} />
          <View style={styles.iconContainer}>
            <Icon name="plus" size={24} color="#000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.pieceJustificative}>Modifier photo de profil</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleConfirm(kineData.id)} >
        <Text style={styles.buttonText}>Supprimer compte</Text>
      </TouchableOpacity>

      {/* Modaux pour chaque fonctionnalité de modification */}
      <Modal
        transparent={true}
        visible={isProfileModalVisible}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Contenu du modal pour le profil */}
            <Text>Modifier le profil</Text>
            
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
    <TouchableOpacity style={styles.buttonModal} onPress={() => handleUpdateKine()}>
      <Text style={styles.buttonText}>Enregistrer Le modifciations</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonModalAnuller} onPress={() => setProfileModalVisible(false)}>
      <Text style={styles.buttonText}>Annuler</Text>
    </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isCabinetModalVisible}
        animationType="slide"
        onRequestClose={() => setCabinetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Contenu du modal pour le cabinet */}
            <Text>Modifier le cabinet</Text>
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
    <TouchableOpacity style={styles.buttonModal} onPress={() => handleUpdateKine()}>
      <Text style={styles.buttonText}>Enregistrer Le modifciations</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonModalAnuller} onPress={() => setCabinetModalVisible(false)}>
      <Text style={styles.buttonText}>Annuler</Text>
    </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isPhoneModalVisible}
        animationType="slide"
        onRequestClose={() => setPhoneModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Contenu du modal pour le téléphone */}
            <Text>Modifier le téléphone</Text>
            <Button title="Fermer" onPress={() => setPhoneModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isEmailModalVisible}
        animationType="slide"
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Contenu du modal pour l'e-mail */}
            <Text>Modifier l'e-mail</Text>
            <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
            <TouchableOpacity style={styles.buttonModal} onPress={() => sendVerificationCodeEmail()}>
      <Text style={styles.buttonText}>Confirmer</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonModalAnuller} onPress={() => setEmailModalVisible(false)}>
      <Text style={styles.buttonText}>Annuler</Text>
    </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isCodeModalVisible}
        animationType="slide"
        onRequestClose={() => setCodeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Contenu du modal pour l'e-mail */}
            <Text>Nous avons envoyé un code de vérification à votre eamil:</Text>
            <Text style={styles.label}>Code:</Text>
      <TextInput
        style={styles.input}
        placeholder="Code vérification"
        value={codever}
        onChangeText={setCodever}
      />
            <TouchableOpacity style={styles.buttonModal} onPress={() => modifierEmailKine()}>
      <Text style={styles.buttonText}>Confirmer</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonModalAnuller} onPress={() => setCodeModalVisible(false)}>
      <Text style={styles.buttonText}>Annuler</Text>
    </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isPasswordModalVisible}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Contenu du modal pour le mot de passe */}
            <Text>Modifier le mot de passe</Text>
            <Button title="Fermer" onPress={() => setPasswordModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Styles améliorés
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  appBar: {
    paddingTop: 20,
    backgroundColor: '#e61c28',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 80,
    marginBottom: 20,
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
  identitySection: {
    paddingHorizontal: 25,
    paddingTop: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginRight: 20,
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  listItemDescription: {
    flex: 1,
    fontSize: 12,
    color: '#555',
  },
  pill: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    color: 'white',
    fontSize: 16,
  },
  separatorContainer: {
    paddingHorizontal: 25,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#ddd',
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
  editIcon: {
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalBtn:{
    color:'red',
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
  buttonModal: {
    alignSelf: 'center',
    backgroundColor: '#067618',
    paddingVertical: 10,
    borderRadius: 5,
    width: 205,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonModalAnuller: {
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    width: 205,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AccountManagementScreen;
