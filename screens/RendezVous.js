import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView,Image, TouchableOpacity, FlatList, TextInput, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CustomNavigationBar from './CustomNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import Iconn from 'react-native-vector-icons/FontAwesome5'; 

const RendezVous = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHoraire, setSelectedHoraire] = useState('');
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [rdvDate, setRdvDate] = useState(new Date());
  const [rdvHoraire, setRdvHoraire] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRendezVous, setFilteredRendezVous] = useState([]);
  const [data, setData] = useState('Données initiales');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [isOtherModalVisible, setOtherModalVisible] = useState(false);
const [isDocumentModalVisible, setDocumentModalVisible] = useState(false);
const [currentDocumentPage, setCurrentDocumentPage] = useState(0);
const [idrdv, setIdRdv] = useState(0);
const [rendezVousAVenir, setRendezVousAVenir] = useState([]);
const [rendezVousHistorique, setRendezVousHistorique] = useState([]);
const [rendezVousData, setRendezVousData] = useState([]);
const [rendezVousDataHist, setRendezVousDataHist] = useState([]);
const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false); // État pour gérer la visibilité du modal de confirmation


const handleConfirm = (rdv) => {
  setIdRdv(rdv);
  
  // Fermer le modal de confirmation
  setConfirmationModalVisible(true);
};
const handleAnuuler = (rdv) => {
  
  // Fermer le modal de confirmation
  setConfirmationModalVisible(false);
};






  const handleButtonPress = () => {
    navigation.navigate('Rdv');
  };

  const toggleModal = (idr) => {
    setModalVisible(!isModalVisible);
    setIdRdv(idr);
  };

  const toggleDateTimePicker = () => {
    setDateTimePickerVisible(!isDateTimePickerVisible);
  };

  const toggleTimePicker = () => {
    setTimePickerVisible(!isTimePickerVisible);
  };

  const [currentSection, setCurrentSection] = useState('aVenir');

  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        axios.get(`http://192.168.1.9:8000/kine/${parsedData.userId}/rendez-vous`)
          .then((response) => {
            const responseData = response.data;
            const rendezVousAVenir = responseData.rendezVousAVenir;
            console.log(rendezVousAVenir);
            const rendezVousHistorique = responseData.rendezVousRestants;
            setRendezVousData(rendezVousAVenir);
            setRendezVousDataHist(rendezVousHistorique);
            setRefreshing(false);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
            setRefreshing(false);
          });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      setRefreshing(false);
    }
  };

  const sendConfirm = (rdv) => {
    // Préparez les données à envoyer à l'API
    const rendezVousData = {
      id:rdv,
      statut:'confirmé',
     
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchDataFromAsyncStorage();
   
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

  const sendRendezVous = () => {
    // Préparez les données à envoyer à l'API
    const rendezVousData = {
      datenew: selectedDate,
      horairenew: selectedHoraire,
    };
    // Effectuez une requête HTTP POST vers l'API
    axios
      .post('http://192.168.1.9:8000/' + idrdv + '/editrend', rendezVousData)
      .then((response) => {
        alert('Rendez-vous modifié avec succès', response.data);
        setIsRefreshing(true);

        toggleModal();
        fetchDataFromAsyncStorage();

      })
      .catch((error) => {
        console.error('Erreur lors de la création du rendez-vous :', error);
      });
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

  const sendStatut = (rdv) => {
    // Préparez les données à envoyer à l'API
    const rendezVousData = {
      id:rdv,
      statut:'absent',
     
    };
    
    // Effectuez une requête HTTP POST vers l'API
    axios
      .post('http://192.168.1.9:8000/editstat', rendezVousData)
      .then((response) => {
        alert('absence ajoutée', response.data);
        // Vous pouvez effectuer des actions supplémentaires ici, comme fermer la modal
        
      })
      .catch((error) => {
        console.error('Erreur lors de la création du rendez-vous :', error);
      });
      fetchDataFromAsyncStorage();
      
  };

  const HandleDocument = (id) => {
    axios
      .post('http://192.168.1.9:8000/api/document', {
        id: id,
        rendezvous: [20, 21, 22] // Remplacez par les ID de vos rendez-vous
      })
      .then((response) => {
        setDocumentData(response.data);
        setDocumentModalVisible(true); // Affichez le modal des données du document
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des dossiers médicaux :', error);
      });
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
        setConfirmationModalVisible(false);

        fetchDataFromAsyncStorage();

      } else {
        console.error('Erreur lors de la suppression du rendez-vous');
      }
    } catch (error) {
      console.error('Une erreur s\'est produite : ', error);
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
        <Text style={styles.title}>Mes Rendez-vous</Text>
      </View>

      <View style={styles.contentContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom ou prénom"
          value={searchTerm}
          onChangeText={handleSearch}
        />
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
                    <View>
                      <Text style={styles.infoText}>{item.date_rendez_vous}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Icon style={{ alignSelf: 'flex-end' }} name="clock" size={20} color="white" />
                    </View>
                    <View>
                      <Text style={styles.infoText}>{item.horaire}</Text>
                    </View>
                  </View>

                  <View style={styles.kineBar}>
                    <Image source={{ uri: 'http://192.168.1.9:8000/uploads/'+item.patient.photo }} style={styles.kineImage} />
                    <View style={styles.kineInfo}>
                      <Text style={styles.kineName}>{item.patient.nom} {item.patient.prenom}</Text>
                      <Text style={styles.kineJob}>{item.statut}</Text>
                    </View>
                    <TouchableOpacity style={styles.detailsButton} onPress={() => HandleDocument(item.id)}>
                      <Iconn name="eye" size={20} color="white" style={styles.icon} />
                      <Text style={styles.detailsButtonText}>Documents</Text>
                  </TouchableOpacity>
                  </View>
                  {item.statut === 'en attente' && (
                    <View style={styles.iconButtonsContainer} >
                      <TouchableOpacity style={styles.confirmationButton} onPress={()=> sendConfirm(item.id)}  >
                        <Icon name="check" size={20} color="green" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton} onPress={()=> handleConfirm(item.id)}>
                        <Icon name="trash" size={20} color="red" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.reportButton}onPress={() => toggleModal(item.id)}>
                        <Text style={styles.reportButtonText}>Reporter</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                
                </View>

              )}

              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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
            <Text style={styles.columnTitle}>Historique</Text>
            <FlatList 
              data={searchTerm ? filteredRendezVous : getHistRendezVous()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                
                <View style={styles.rendezVous}>
                  <View style={styles.infoBar}>
                    <Icon name="calendar" size={20} color="white" />
                    <View>
                      <Text style={styles.infoText}>{item.date_rendez_vous}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Icon style={{ alignSelf: 'flex-end' }} name="clock" size={20} color="white" />
                    </View>
                    <View>
                      <Text style={styles.infoText}>{item.horaire}</Text>
                    </View>
                  </View>

                  <View style={styles.kineBar}>
                    <Image source={{ uri: 'http://192.168.1.9:8000/uploads/'+item.patient.photo }} style={styles.kineImage} />
                    <View style={styles.kineInfo}>
                      <Text style={styles.kineName}>{item.patient.nom} {item.patient.prenom}</Text>
                      <Text style={styles.kineJob}>{item.statut}</Text>
                    </View>
                    <TouchableOpacity style={styles.detailsButton} onPress={() => HandleDocument(item.id)}>
                      <Iconn name="eye" size={20} color="white" style={styles.icon} />
                      <Text style={styles.detailsButtonText}>Documents</Text>
                  </TouchableOpacity>
                  </View>
                
                    <View style={styles.iconButtonsContainer} >
                      
                      <TouchableOpacity style={styles.deleteButton} onPress={()=> handleConfirm(item.id)}>
                        <Icon name="trash" size={20} color="red" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.reportButton} onPress={() => sendStatut(item.id)}>
                        <Text style={styles.reportButtonText}>Absent</Text>
                      </TouchableOpacity> 
                    </View>
                
                
                </View>

              )}

              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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

      <CustomNavigationBar />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Sélectionnez la date :</Text>
          <TouchableOpacity onPress={toggleDateTimePicker}>
            <TextInput
              style={styles.input}
              placeholder="Cliquez pour choisir une date"
              editable={false}
              value={format(selectedDate, 'yyyy-MM-dd')}
            />
          </TouchableOpacity>
          {isDateTimePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setSelectedDate(selectedDate);
                toggleDateTimePicker();
              }}
            />
          )}
          <TouchableOpacity onPress={toggleTimePicker}>
            <TextInput
              style={styles.input}
              placeholder="Cliquez pour choisir l'horaire"
              editable={false}
              value={selectedHoraire}
            />
          </TouchableOpacity>
          {isTimePickerVisible && (
            <DateTimePicker
              testID="timePicker"
              value={selectedDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      selectedTime.getHours(),
                      selectedTime.getMinutes()
                    )
                  );
                  setSelectedHoraire(format(selectedTime, 'HH:mm'));
                }
                toggleTimePicker();
              }}
            />
          )}

          <TouchableOpacity style={styles.buttonModal} onPress={() =>sendRendezVous()} >
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonModal} onPress={toggleModal}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isDocumentModalVisible}>
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Détails du Document</Text>
    
    {documentData.length > 0 ? (
      <View>
        <Image
          source={{ uri: 'http://192.168.1.9:8000/uploads/' + documentData[currentDocumentPage].document }}
          style={styles.modalImage}
        />
      </View>
    ) : (
      <Text style={styles.noDocumentsText}>Le patient n'a pas encore ajouté un document</Text>
    )}

    {documentData.length > 0 && (
      <View style={styles.documentPaginationButtons}>
        <TouchableOpacity
          style={styles.documentPrevPageButton}
          onPress={() => setCurrentDocumentPage(Math.max(currentDocumentPage - 1, 0))}
          disabled={currentDocumentPage === 0}
        >
          <Text style={styles.buttonText}>Précédent</Text>
        </TouchableOpacity>
        
        <Text style={styles.documentPageNumberText}>
          Page {currentDocumentPage + 1} de {documentData.length}
        </Text>

        <TouchableOpacity
          style={styles.documentNextPageButton}
          onPress={() => setCurrentDocumentPage(Math.min(currentDocumentPage + 1, documentData.length - 1))}
          disabled={currentDocumentPage === documentData.length - 1}
        >
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    )}
    
    <TouchableOpacity style={styles.buttonModal} onPress={() => setDocumentModalVisible(false)}>
      <Text style={styles.buttonText}>Fermer</Text>
    </TouchableOpacity>
  </View>
</Modal>

<Modal  style={styles.deletemodalContainer} isVisible={isConfirmationModalVisible}>
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
    backgroundColor: '#333333',
  },
  infoText: {
    marginLeft: 1,
    color: 'white',
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
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row', // Pour aligner l'icône et le texte horizontalement
    alignItems: 'center', // Pour centrer l'icône et le texte verticalement
  },
  icon: {
    marginRight: 8, // Espace entre l'icône et le texte (ajustez selon vos préférences)
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
    backgroundColor: '#D9D9D9',
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
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
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
  modalImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  reportButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'gray',
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonModal: {
    backgroundColor: '#067618',
    paddingVertical: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },

  documentPaginationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  documentPrevPageButton: {
    backgroundColor: '#067618',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  documentNextPageButton: {
    backgroundColor: '#067618',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  documentPageNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  noDocumentsText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20, // Vous pouvez ajuster la marge supérieure selon vos préférences
    color: 'gray', // Couleur du texte "Pas de document"
  },
  scrollView: {
    flex: 1,
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
 
});

export default RendezVous;
