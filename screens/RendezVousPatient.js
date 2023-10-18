import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import NavBarPatient from './NavBarPatient';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';




const RendezVousPatient = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [idrdv, setIdRdv] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRendezVous, setFilteredRendezVous] = useState([]);

 

  const handleButtonPress = () => {
    navigation.navigate('Rdv');
  };

const toggleModal = () => {
  setModalVisible(!isModalVisible);
};

 


  const [currentSection, setCurrentSection] = useState('aVenir');
  const [rendezVousData, setRendezVousData] = useState([]);
const [rendezVousDataHist, setRendezVousDataHist] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRendezVous, setSelectedRendezVous] = useState({});
  const [editingRendezVous, setEditingRendezVous] = useState([]);
  const [statut, setstatut] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false); // État pour gérer la visibilité du modal de confirmation
  const [selectedRdvId, setSelectedRdvId] = useState(null); // État pour stocker l'ID du rendez-vous sélectionné
  const [selectedImage, setSelectedImage] = useState(null); // État pour stocker l'image sélectionnée
  const [selectedMotif, setSelectedMotif] = useState('');
  const [isMotifSelected, setIsMotifSelected] = useState(false);
  const [isdeleteModalVisible, setDeleteModalVisible] = useState(false); // État pour gérer la visibilité du modal de confirmation

  const handleConfirm = (rdv) => {
    setIdRdv(rdv);
    
    // Fermer le modal de confirmation
    setDeleteModalVisible(true);
  };
  const handleAnuuler = (rdv) => {
    
    // Fermer le modal de confirmation
    setDeleteModalVisible(false);
  };

  const rendezVousPerPage = 2;
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageH, setCurrentPageH] = useState(0);


  const getVenirRendezVous = () => {
    const startIndex = currentPage * rendezVousPerPage;
    const endIndex = startIndex + rendezVousPerPage;
    return rendezVousData.slice(startIndex, endIndex);
  };
  const getHistRendezVous = () => {
    const startIndex = currentPageH * rendezVousPerPage;
    const endIndex = startIndex + rendezVousPerPage;
    return rendezVousDataHist.slice(startIndex, endIndex);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = rendezVousData.filter((rendezVous) =>
      rendezVous.patient.nom.toLowerCase().includes(text.toLowerCase()) ||
      rendezVous.patient.prenom.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRendezVous(filtered);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * rendezVousPerPage < rendezVousData.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleNextPageH = () => {
    if ((currentPageH + 1) * rendezVousPerPage < rendezVousDataHist.length) {
      setCurrentPageH(currentPageH + 1);


    }
  };
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePrevPageH = () => {
    if (currentPageH > 0) {
      setCurrentPageH(currentPageH - 1);
    }
  };

  const deleteRendezVousById = async (rendezVousId) => {
    try {
      // Utilisez Axios pour effectuer une requête DELETE à votre API Symfony
      const response = await axios.delete(`http://192.168.1.9:8000/rendez-vous-supp/${rendezVousId}`);
  
      // Vérifiez si la suppression a réussi
      if (response.status === 200) {
        
        alert('Rendez-vous supprimé avec succès');
       setDeleteModalVisible(false);

        fetchDataFromAsyncStorage();

      } else {
        alert('Erreur lors de la suppression du rendez-vous');
      }
    } catch (error) {
      alert('Vous ne puvez pas supprimé ce rendez avant 12 heures ');
    }
  };
 

  const handleAddDocument = (rdvId) => {
    // Stocker l'ID du rendez-vous sélectionné
    setSelectedRdvId(rdvId);
    
    // Logique pour sélectionner une image ici
    pickImage();
  };

  const handleConfirmSendImage = () => {
    handleDocument();
    // Fermer le modal de confirmation
    setConfirmationModalVisible(false);
  };

  const handleCancelSendImage = () => {
    // Annuler l'envoi de l'image

    // Fermer le modal de confirmation
    setConfirmationModalVisible(false);
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
      setSelectedImage(selectedAsset.uri);

      // Afficher le modal de confirmation
      setConfirmationModalVisible(true);
    }
  };
  const documentData = {
    document: imageBase64, // Remplacez par la valeur souhaitée
    rdvId: selectedRdvId,
    type:selectedMotif,
  };
  const handleDocument = async () => {
    try {
      const response = await axios.post('http://192.168.1.9:8000/insertdocument', documentData);
      console.log('Réponse de l\'API :', response.data);
      // Vous pouvez effectuer des actions supplémentaires en fonction de la réponse de l'API
    } catch (error) {
      console.error('Erreur lors de la requête vers l\'API :', error);
    }
  };

  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        console.log(parsedData.userId);
        axios
          .get('http://192.168.1.9:8000/api/patients/' + parsedData.userId + '/rendez-vous')
          .then((response) => {
            setRendezVousData(response.data.rendezVousAVenir);
            setRendezVousDataHist(response.data.rendezVousRestants)
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
          });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const sendStatut = (rdv) => {
    // Préparez les données à envoyer à l'API
    const rendezVousData = {
      id:rdv,
     
    };
    
    // Effectuez une requête HTTP POST vers l'API
    axios
      .post('http://192.168.1.9:8000/editstat', rendezVousData)
      .then((response) => {
        alert('Rendez-vous confirmé', response.data);
        // Vous pouvez effectuer des actions supplémentaires ici, comme fermer la modal
        
      })
      .catch((error) => {
        console.error('Erreur lors de la création du rendez-vous :', error);
      });
      fetchDataFromAsyncStorage();
      
  };


  useEffect(() => {
    fetchDataFromAsyncStorage();
  }, []);

  const historiqueRendezVousList = [];

  

  const getCurrentRendezVous = () => {
    const startIndex = currentPage * rendezVousPerPage;
    const endIndex = startIndex + rendezVousPerPage;
    return rendezVousData.slice(startIndex, endIndex);
  };

  return (
    <View style={styles.container}>
     <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} 
          onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Rendez-Vous</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.sectionToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, currentSection === 'aVenir' && styles.activeButton]}
            onPress={() => setCurrentSection('aVenir')}
          >
            <Text style={[styles.toggleButtonText, currentSection === 'aVenir' && styles.activeButtonText]}>
              A venir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, currentSection === 'historique' && styles.activeButton]}
            onPress={() => setCurrentSection('historique')}
          >
            <Text style={[styles.toggleButtonText, currentSection === 'historique' && styles.activeButtonText]}>
              Historique
            </Text>
          </TouchableOpacity>
        </View>

        {currentSection === 'aVenir' && (
          <View style={styles.column}>
            <Text style={styles.columnTitle}>A venir</Text>

            
            <FlatList 
              data={searchTerm ? filteredRendezVous : getVenirRendezVous()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
        
        
          <View style={styles.rendezVous}>
            <View style={styles.infoBar}>
              <Icon name="calendar" size={20} color="white" />
              <Text style={styles.infoText}>{item.date_rendez_vous}</Text>
              <View style={{ flex: 1 }}>
              <Icon style={{ alignSelf: 'flex-end' }} name="clock" size={20} color="white" />
              </View>
              <Text style={styles.infoText}>{item.horaire}</Text>
            </View>

            <View style={styles.kineBar}>
              <Image source={{ uri: 'https://gudule-api.azurewebsites.net/images/profiles/user_profile_picture_52d6f6ad-b976-4416-a12c-fd16f9234e0d_1679826459.jpg' }} style={styles.kineImage} />
              <View style={styles.kineInfo}>
                <Text style={styles.kineName}>{item.patient.nom} {item.patient.prenom}</Text>
                <Text style={styles.kineJob}>{item.statut}</Text>
                
              </View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleAddDocument(item.id)}
              >
                <Text style={styles.detailsButtonText}>+document</Text>
              </TouchableOpacity>
              
            </View>

            {item.statut === 'reported' && (
          <View style={styles.iconButtonsContainer}>
            <TouchableOpacity style={styles.confirmationButton} onPress={() => sendStatut(item.id)}>
              <Icon name="check" size={20} color="green" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={()=> handleConfirm(item.id)}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
            
          </View>
        )}
        
        {item.statut === 'en attente' && (
          <View style={styles.iconButtonsContainer}>
           
            <TouchableOpacity style={styles.deleteButton} onPress={()=> handleConfirm(item.id)}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
            
          </View>
        )}
          </View>
        )}
      />

<View style={styles.paginationButtons}>
              <TouchableOpacity
                style={styles.prevPageButton}
                onPress={handlePrevPage}
                disabled={currentPage === 0}
              >
                <Text style={styles.buttonText}>Précédent</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageNumberText}>
                Page {currentPage + 1} de {Math.ceil(rendezVousData.length / rendezVousPerPage)}
              </Text>

              <TouchableOpacity
                style={styles.nextPageButton}
                onPress={handleNextPage}
                disabled={(currentPage + 1) * rendezVousPerPage >= rendezVousData.length}
              >
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

        {currentSection === 'historique' && (
           <View style={styles.column}>
           <Text style={styles.columnTitle}>A venir</Text>

           
           <FlatList 
             data={searchTerm ? filteredRendezVous : getHistRendezVous()}
             keyExtractor={(item, index) => index.toString()}
             renderItem={({ item }) => (
       
       
         <View style={styles.rendezVous}>
           <View style={styles.infoBar}>
             <Icon name="calendar" size={20} color="white" />
             <Text style={styles.infoText}>{item.date_rendez_vous}</Text>
             <View style={{ flex: 1 }}>
             <Icon style={{ alignSelf: 'flex-end' }} name="clock" size={20} color="white" />
             </View>
             <Text style={styles.infoText}>{item.horaire}</Text>
           </View>

           <View style={styles.kineBar}>
             <Image source={{ uri: 'https://gudule-api.azurewebsites.net/images/profiles/user_profile_picture_52d6f6ad-b976-4416-a12c-fd16f9234e0d_1679826459.jpg' }} style={styles.kineImage} />
             <View style={styles.kineInfo}>
               <Text style={styles.kineName}>{item.patient.nom} {item.patient.prenom}</Text>
               <Text style={styles.kineJob}>{item.statut}</Text>
               
             </View>
             <TouchableOpacity
               style={styles.detailsButton}
               onPress={() => handleAddDocument(item.id)}
             >
               <Text style={styles.detailsButtonText}>+document</Text>
             </TouchableOpacity>
             
           </View>

           {item.statut === 'reported' && (
         <View style={styles.iconButtonsContainer}>
           <TouchableOpacity style={styles.confirmationButton} onPress={() => sendStatut(item.id)}>
             <Icon name="check" size={20} color="green" />
           </TouchableOpacity>
           <TouchableOpacity style={styles.deleteButton} onPress={()=> handleConfirm(item.id)}>
             <Icon name="trash" size={20} color="red" />
           </TouchableOpacity>
           
         </View>
       )}
       
       {item.statut === 'en attente' && (
         <View style={styles.iconButtonsContainer}>
          
           <TouchableOpacity style={styles.deleteButton} onPress={()=> handleConfirm(item.id)}>
             <Icon name="trash" size={20} color="red" />
           </TouchableOpacity>
           
         </View>
       )}
         </View>
       )}
     />

<View style={styles.paginationButtons}>
              <TouchableOpacity
                style={styles.prevPageButton}
                onPress={handlePrevPageH}
                disabled={currentPageH === 0}
              >
                <Text style={styles.buttonText}>Précédent</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageNumberText}>
                Page {currentPageH + 1} de {Math.ceil(rendezVousDataHist.length / rendezVousPerPage)}
              </Text>

              <TouchableOpacity
                style={styles.nextPageButton}
                onPress={handleNextPageH}
                disabled={(currentPageH + 1) * rendezVousPerPage >= rendezVousDataHist.length}
              >
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            </View>

          </View>
       )}

    
  </View>
  <NavBarPatient />
  <Modal  style={styles.modalContainer} isVisible={isConfirmationModalVisible}>
        <View style={styles.modalContent}>
        {!isMotifSelected && (
  <Text style={styles.errorText}>Veuillez sélectionner un motif.</Text>
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
          <Text style={styles.modalTitle}>Confirmer l'envoi de l'image ?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleConfirmSendImage}
            >
              <Text style={styles.modalButtonText}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCancelSendImage}
            >
              <Text style={styles.modalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal  style={styles.deletemodalContainer} isVisible={isdeleteModalVisible}>
        <View style={styles.deletemodalContent}>
       
          <Text style={styles.deletemodalTitle}>Voulez-vous confirmer la suppression du rendez-vous ?</Text>
          <View style={styles.deletemodalButtons}>
            <TouchableOpacity
              style={styles.deletemodalButton}
              onPress={() =>deleteRendezVousById(idrdv)}
            >
              <Text style={styles.deletemodalButtonText}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity

              style={styles.deletemodalButton}
             onPress={handleAnuuler}
            >
              <Text style={styles.deletemodalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
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
  sectionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toggleButtonText: {
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: 'black',
    borderColor: '#e61c28',
  },
  activeButtonText: {
    color: 'white',
  },
  column: {
    marginTop: 20,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rendezVous: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor:'#333333',
  },
  infoText: {
    marginLeft: 2,
    color:'white',
  },
  kineBar: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kineImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  kineInfo: {
    flex: 1,
    marginLeft: 10,
  },
  kineName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  kineJob: {
    fontSize: 14,
    color: '#757575',
  },
  detailsButton: {
    backgroundColor: '#e61c28',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    backgroundColor: '#D9D9D9',
  },
  activeDot: {
    backgroundColor: '#e61c28',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // ... (Styles précédents) ...
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  detailsBox: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  closeButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: 300, // Largeur du modal
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#e61c28',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc', // Bordure grise
    borderRadius: 5,
    backgroundColor: 'white', // Fond blanc
    
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  confirmationButton: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  deleteButton: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  deletemodalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  deletemodalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: 300, // Largeur du modal
  },
  deletemodalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deletemodalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deletemodalButton: {
    backgroundColor: '#e61c28',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  deletemodalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  prevPageButton: {
    backgroundColor: '#333333',
    paddingVertical: 8, // Ajustez la hauteur du bouton ici
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  nextPageButton: {
    backgroundColor: '#333333',
    paddingVertical: 8, // Ajustez la hauteur du bouton ici
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  pageNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#067618', // Couleur du texte du numéro de page
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default RendezVousPatient;
