import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import CustomNavigationBar from './CustomNavigationBar';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton, Avatar, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';






const apiUrl = 'http://192.168.1.8:8000/api/kineprog/6';

const ProgrammesScreen = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [selectedName, setSelectedName] = useState('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // Nouvel état pour la recherche
  const programsPerPage = 3;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [idProg, setIdProg] = useState(0);
  const [userData, setUserData] = useState({});
  const [nbSeance, setNbSeance] = useState('');
  const [temps, setTemps] = useState('');
  const [nbSeanceError, setNbSeanceError] = useState('');
  const [tempsError, setTempsError] = useState('');





  const handleAddProg = () => {
    navigation.navigate('AddProgramScreen');
  };

  const handleNbSeances = (text) => {
    if (!isNaN(text)) {
      setNbSeance(text);
      setNbSeanceError(''); // Réinitialisez l'erreur
    } else {
      // Afficher un message d'erreur en rouge
      setNbSeanceError('Veuillez entrer un nombre valide.');
    }
  };
  const handleTemps = (text) => {
    if (!isNaN(text)) {
      setTemps(text);
      setTempsError(''); // Réinitialisez l'erreur
    } else {
      // Afficher un message d'erreur en rouge
      setTempsError('Veuillez entrer un nombre valide.');
    }
  };

  
  const HandleDesc=()=>{
    const ProgramData = {
      description: imageBase64,
      nbSeance:nbSeance,
      temps:temps,
      
    };
    axios.put('http://192.168.1.8:8000/api/programmes/'+idProg, ProgramData)
    .then(response => {
      console.log(response.data);
      alert('programme modifié');
      fetchDataFromAsyncStorage();

      setModalVisible(false);
    })
    .catch(error => {
      // Gestion des erreurs
      console.error(error);
      
    });
  }
  handlesupp = (id) => {
    console.log(id);

    setIdProg(id);
    alert(
      'suppression', // This is a title
      "Etes vous sures de supprimer ce programme?", // This is a alert message
      {
          textConfirm: 'Confirm', // Label of button confirm
          textCancel: 'Cancel', // Label of button cancel
          onConfirm: () => deleteProgramme(id), // Call your confirm function 
          onCancel: () => cancelClick() // Call your cancel function 
      }
  )
  }
   cancelClick = () => {
    console.log('Cancel Action')
  }
  const deleteProgramme = async (programmeId) => {
    try {
      const response = await axios.delete(`http://192.168.1.8:8000/programme/supp/${programmeId}`);
      if (response.status === 200) {
       alert('Le programme a été supprimé avec succès.');
       fetchDataFromAsyncStorage();

        // Faites quelque chose après la suppression réussie, si nécessaire.
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la suppression du programme :', error);
      // Gérez l'erreur, affichez un message d'erreur, etc.
    }
  };

  const permisionFunction = async () => {
    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    setGalleryPermission(imagePermission.status === 'granted');
    if (imagePermission.status !== 'granted') {
    }
  };
  const toggleModal = (id) => {
    setIdProg(id);
    setModalVisible(!isModalVisible);
  };

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
        const fetchProgrammes = async () => {
          try {
            const response = await fetch('http://192.168.1.8:8000/api/kineprog/'+parsedData.userId);
            const data = await response.json();
            setProgrammes(data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
    
        fetchProgrammes();
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const handleDeleteEx= (id) => {
    // Faites une requête DELETE pour supprimer le kinésithérapeute par son ID
    axios.delete(`http://192.168.1.8:8000/ex/supp/${id}`)
      .then((response) => {
        alert('Excercice supprimé avec succès');
        fetchDataFromAsyncStorage();
        setSelectedProgramme(null);
        
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du kinésithérapeute : ', error);
      });
  };
  const handleConfirm =(id)=>{
    alert(
        'Confirmation', // This is a title
        "Etes vous sure de supprimer cet excercice ?", // This is a alert message
        {
            textConfirm: 'Confirm', // Label of button confirm
            textCancel: 'Cancel', // Label of button cancel
            onConfirm: () => handleDeleteEx(id) ,// Call your confirm function 
            onCancel: () => cancelClick() // Call your cancel function 
        }
    )
  }

  cancelClick = () => {
    console.log('Cancel Action')
  }
  useEffect(() => {
    permisionFunction();
    fetchDataFromAsyncStorage();
    
  }, []);

  const uniqueNames = [...new Set(programmes.map((programme) => programme.nom))];

  // Fonction de filtrage
  const filteredProgrammes = programmes.filter((programme) =>
    programme.nomprog.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item, index }) => {
    if (index < currentPage * programsPerPage && index >= (currentPage - 1) * programsPerPage) {
      return (
        <TouchableOpacity
          style={styles.programmeItem}
          onPress={() => setSelectedProgramme(item)}
        >
          <Text style={styles.programmeNom}>{item.nomprog} 
          <TouchableOpacity style={styles.deleteButton}
          onPress={() => handlesupp(item.id)} >
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity></Text>
          <Image
            source={{ uri: 'http://192.168.1.8:8000/uploads/' + item.description }}
            style={styles.image}
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="play-circle" size={20} color="#007AFF" />
              <Text style={{ marginLeft: 4 }}>{item.nbs} séances</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock" size={20} color="#007AFF" />
              <Text style={{ marginLeft: 4 }}>{item.temps} minutes</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton} onPress={() => toggleModal(item.id)}>
                      <Text style={styles.detailsButtonText}>Modifier</Text>
                    </TouchableOpacity>
                    
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} 
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Mes programmes</Text>
      </View>
      <LinearGradient
        colors={['#FFFFFF', '#FFFFFF']}
        style={styles.background}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un programme..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <Picker
          selectedValue={selectedName}
          onValueChange={(itemValue) => setSelectedName(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tous" value="Tous" />
          {uniqueNames.map((name) => (
            <Picker.Item label={name} value={name} key={name} />
          ))}
        </Picker>
        {selectedProgramme ? (
          <View style={styles.selectedProgrammeContainer}>
            <FlatList
              data={selectedProgramme.exercices}
              keyExtractor={(exercice) => exercice.id.toString()}
              renderItem={({ item: exercice }) => (
                <View style={styles.exerciceItem}>
                          <Text style={styles.exerciceNom}>{exercice.nom}
                          <TouchableOpacity style={styles.deleteButton}   onPress={() => handleConfirm(exercice.id)}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
                          </Text>


                  <View style={styles.containerDesc}>
     
      <View style={styles.box}>
        <Text style={styles.repetitions}>Répétitions: {exercice.repetitions}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.series}>Séries: {exercice.series}</Text>
      </View>
    </View>
                  
                  <Video
                    source={{
                      uri: 'http://192.168.1.8:8000/uploads/' + exercice.chemin,
                    }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    shouldPlay
                    useNativeControls
                    style={styles.video}
                    usePoster
                  />
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProgramme(null)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredProgrammes}
            keyExtractor={(programme) => programme.id.toString()}
            renderItem={renderItem}
          />
        )}
        <View style={styles.pagination}>
          {Array.from({ length: Math.ceil(filteredProgrammes.length / programsPerPage) }).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pageButton,
                currentPage === index + 1 ? styles.activePageButton : null,
              ]}
              onPress={() => setCurrentPage(index + 1)}
            >
              <Text style={styles.pageButtonText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddProg}
      >
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.space}></View>
      <CustomNavigationBar />
      <Modal style={styles.modalContainer }isVisible={isModalVisible}>
      <Text style={styles.label}>Nombre de séances</Text>

<TextInput
  style={styles.input}
  placeholder="Nombre de séances"
  value={nbSeance}
  onChangeText={handleNbSeances}
/>
      <Text style={styles.errorText}>{nbSeanceError}</Text>

<Text style={styles.label}>temps par séance</Text>

<TextInput
        style={styles.input}
        placeholder="temps par séance"
        value={temps}
        onChangeText={handleTemps}
      />
      <Text style={styles.errorText}>{tempsError}</Text>
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
      <TouchableOpacity style={styles.buttonModal} onPress={() => setModalVisible(false)}>
      <Text style={styles.buttonText}>Fermer</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonModal} onPress={HandleDesc}>
      <Text style={styles.buttonText}>Confimer</Text>
    </TouchableOpacity>
      </View>

      
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    paddingTop: 20,
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
  background: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  programmeItem: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  programmeNom: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Roboto',
  },
  image: {
    width: 300,
    height: 230,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonModal: {
    backgroundColor: '#067618',
    paddingVertical: 10,
    borderRadius: 5,
    width: 150,
    marginVertical: 10,
    
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
  pageButton: {
    backgroundColor: '#e61c28',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activePageButton: {
    backgroundColor: 'e61c28',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  exerciceItem: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginVertical: 4,
    borderRadius: 10,
  },
  exerciceNom: {
    fontSize: 18, // Par exemple, vous pouvez ajuster la taille de la police
    fontWeight: 'bold', // Vous pouvez ajouter d'autres styles ici
    alignSelf: 'center',
    marginBottom: 10,
  },
  repetitions: {
    fontSize: 16,
    color: 'green', // Couleur différente pour les répétitions
    // Autres styles pour les répétitions
  },
  series: {
    fontSize: 16,
    color: 'blue', // Couleur différente pour les séries
    // Autres styles pour les séries
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  selectedProgrammeContainer: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#e61c28',
    padding: 10,
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 5,
    marginBottom: 80,
    marginLeft:30,
    marginRight:30,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e61c28',
    borderRadius: 50,
    padding: 10,
    marginBottom: 80,
  },
  space: {
    marginBottom: 80,
  },
  detailsButton: {
    backgroundColor: '#e61c28',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop:10,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editModalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editModalInput: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  editModalImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  editModalButton: {
    backgroundColor: '#e61c28',
    padding: 10,
    borderRadius: 5,
  },
  editModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 8, // Espace entre le label et l'input
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  containerDesc: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Équitablement espacées
    alignItems: 'center', // Centrage vertical
  },
  box: {
    backgroundColor: '#F0F0F0', // Fond gris clair
    padding: 15, // Espacement intérieur
    margin: 10, // Marge entre les boîtes
    borderRadius: 10, // Coins arrondis
    elevation: 5, // Ombre
  },
  deleteButton: {
    marginRight: 10,

    borderRadius: 6,
    backgroundColor: 'transparent',
  },
});

export default ProgrammesScreen;
