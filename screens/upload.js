import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign icons
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext'; 



const Upload = () => {
  const {getName,getUserId,getFirstName, setName, setFirstName, setLastName, setUserId } = useUser();
  const [imageBlob, setImageBlob] = useState(null);
  const navigation = useNavigation();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.cancelled && result.base64) {
      setImageBlob(result.base64);
     
    }
  };

  const uploadImage = async () => {
    if (imageBlob) {
      try {
        // Envoi de l'image blob à l'API Symfony
        
        console.log(getUserId());
        const response = await fetch('http://127.0.0.1:8000/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({  image: imageBlob,
            kineId: getUserId(),}),
         
        })
        ;

        // Traitez la réponse de l'API Symfony ici si nécessaire
        console.log('Réponse de l\'API Symfony :', response);
        navigation.navigate('WorkScheduleScreen');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <View style={styles.appBarc}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Profil</Text>
        </View>
      </View>
      {imageBlob ? (
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: `data:image/jpeg;base64,${imageBlob}` }} style={styles.image} />
          <View style={styles.plusIcon}>
            <AntDesign name="pluscircleo" size={24} color="white" style={styles.plusIconBackground} />
          </View>

        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
          <AntDesign name="camerao" size={32} color="white" />
          <Text style={styles.selectButtonText}>Sélectionner une photo de profil</Text>
        </TouchableOpacity>
      )}

      {imageBlob && (
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <AntDesign name="upload" size={24} color="white" />
          <Text style={styles.uploadButtonText}>Envoyer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  plusIconBackground: {
    backgroundColor: '#11BD60', 
    borderRadius: 100, 
    padding: 5, 
  },
  selectButton: {
    flexDirection: 'row',
    backgroundColor: '#11BD60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#11BD60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  appBar: {
    position: 'absolute', // Ajout de la propriété position
    top: 0, // Pour placer l'appbar en haut de l'écran
    left: 0,
    right: 0,
    backgroundColor: '#11BD60',
    paddingVertical: 30,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  backButton: {
    marginRight: 16,
    borderRadius: 20,
    padding: 10,
  },
});

export default Upload;
