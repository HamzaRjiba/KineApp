import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import Axios from 'axios';
import ModalImage from 'react-native-image-modal';
import Modal from 'react-native-modal';
import SuperAlert from 'react-native-super-alert';


const KinesitherapeuteList = () => {
  const [kinesitherapeutes, setKinesitherapeutes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState('');

  useEffect(() => {
    // Faites une requête HTTP pour récupérer les données des kinésithérapeutes depuis votre API
    Axios.get('http://192.168.1.8:8000/admin/listkine')
      .then((response) => {
        setKinesitherapeutes(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données : ', error);
      });
  }, []);

  const openPieceModal = (pieceUrl) => {
    setSelectedPiece(pieceUrl);
    setModalVisible(true); // Ouvrir la modalité directement lors de la sélection de la pièce
  };

  const handleDeleteKine = (id) => {
    // Faites une requête DELETE pour supprimer le kinésithérapeute par son ID
    Axios.delete(`http://192.168.1.8:8000/admin/supp/${id}`)
      .then((response) => {
        alert('Kinésithérapeute supprimé avec succès');
        // Mettez à jour la liste des kinésithérapeutes en supprimant celui supprimé
        setKinesitherapeutes((prevKines) => prevKines.filter((kine) => kine.id !== id));
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
      {kinesitherapeutes.map((kine) => (
        <View style={styles.kineContainer} key={kine.id}>
          <View style={styles.kineInfo}>
            <Image source={{ uri: 'http://192.168.1.8:8000/uploads/' + kine.photo }} style={styles.kineImage} />
            <Text style={styles.kineName}>{kine.nom} {kine.prenom}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => openPieceModal(kine.piece)}>
              <Text style={styles.pieceLink}>Voir pièce</Text>
            </TouchableOpacity>
            <Button title="Supprimer" onPress={() => handleConfirm(kine.id)} />
          </View>
        </View>
      ))}

      <Modal isVisible={modalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
         
          <ModalImage
            source={{ uri: 'http://192.168.1.8:8000/uploads/' + selectedPiece }}
            style={styles.modalImage}
            resizeMode="contain"
          />
           <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  kineContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kineImage: {
    width: 50,
    height:50,
    borderRadius: 50,
  },
  kineName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  pieceLink: {
    color: 'blue',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 300,
    height: 250,
    alignItems: 'center',
  },
  closeButton: {
  backgroundColor: 'red',
  
    
  },
  closeText:{
    color: 'white',
},
  modalImage: {
    width: 300,
    height: 200,
  },
});

export default KinesitherapeuteList;
