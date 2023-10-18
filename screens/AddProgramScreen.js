import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';






const AddProgramScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageBlob, setImageBlob] = useState(null);
  const [exerciceName, setExerciceName] = useState('');
  const [exerciceSerie, setSerieExcercice] = useState('');
  const [exerciceRep, setRepExcercice] = useState('');
  const [newNamess, setNewNamess] = useState('');
  const [newVeds , setNewVeds] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [progId, setProgId] = useState('');
  const [serieError, setSerieError] = useState('');
  const [repError, setRepError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [videoBase64, setVideoBase64] = useState('');
  const [uploadedVideoBase64, setUploadedVideoBase64] = useState();
  const [uploadedVideoNames,  setUploadedVideoNames ] = useState();
  const [selectedMotif, setSelectedMotif] = useState('');
  const [isMotifSelected, setIsMotifSelected] = useState(false);

  const [addOther, setAddOther] = useState('');
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();
  const [nbSeance, setNbSeance] = useState('');
  const [temps, setTemps] = useState('');
  const [nbSeanceError, setNbSeanceError] = useState('');
  const [tempsError, setTempsError] = useState('');









  
  const [isAddingAnotherExercise, setIsAddingAnotherExercise] = useState(false);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      setVideoData(result);
      setAddOther("tu peux ajouter des autres vidéos");
    }
  };

  useEffect(() => {
    if (videoData) {
      const fetchVideoBlob = async () => {
        try {
          const videoBlob = await fetch(videoData.uri).then(response => response.blob());
          const reader = new FileReader();
          reader.readAsDataURL(videoBlob);
          reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            setVideoBase64(base64data);
            setUploadedVideoBase64(prevVed => {
              const newVed = prevVed ? `${prevVed};;;${base64data}` : base64data;
              console.log(newVed); // Log the updated names here
              setNewVeds(newVed);
              return newVed;
            });
            setUploadedVideoNames(prevNames => {
              const newNames = prevNames ? `${prevNames};${exerciceName}` : exerciceName;
              console.log(newNames); // Log the updated names here
              setNewNamess(newNames);
              return newNames;
            });
            
            setExerciceName('');
            setVideoData(null);
            setVideoBase64(null);
          };
        } catch (error) {
          console.log('Error converting video to base64:', error);
        }
     
  
      };

      fetchVideoBlob();
    }
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const userData = JSON.parse(storedData);
          setUserData(userData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [videoData]);

  const handleUpload = async () => {
    setLoading(true);
    setResponseText('');

    if (!videoData) {
      setResponseText('Error: No video selected');
      setLoading(false);
      return;
    }

   

    setLoading(false);
  };
  

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

  const sendImageToApi = async () => {
    if (imageBlob) {
      
      try {
        console.log(userData.userId);
        const response = await fetch('http://192.168.1.9:8000/api/programAjout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData: imageBlob,motif:selectedMotif,idkine:userData.userId,nbSeance:nbSeance,
          temps:temps }),
        });

        if (response.ok) {
          const data = await response.json(); 
          const id = data.message;
         

          console.log('Image sent successfully');
          console.log(newNamess);
          const requestData = {
            video_base64: newVeds,
            video_names: newNamess ,
            idprog:id,
            idkine:userData.userId,
          };
          console.log(requestData);
          
            axios
            .post('http://192.168.1.9:8000/api/tr', requestData)
            .then(response => {
            console.log(response.data);
            alert('programme ajouté avec succés');
            })
           
         
        } else {
          console.error('Failed to send image');
        }
      } catch (error) {
        console.error('Error sending image:', error);
      }
     
  
      
    }
  };
  const handleSerieChange = (text) => {
    if (!isNaN(text)) {
      setSerieExcercice(text);
      setSerieError(''); // Réinitialisez l'erreur
    } else {
      // Afficher un message d'erreur en rouge
      setSerieError('Veuillez entrer un nombre valide.');
    }
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

  const handleRepChange = (text) => {
    if (!isNaN(text)) {
      setRepExcercice(text);
      setRepError(''); // Réinitialisez l'erreur
    } else {
      // Afficher un message d'erreur en rouge
      setRepError('Veuillez entrer un nombre valide.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {currentStep === 1 && (
        <>
        <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <Text style={styles.title}>Add cover</Text>
      </View>
      <View style={styles.viewpick}>
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
    </View>
  


      
          <Text style={styles.subtitle}>Ajoutez une photo de couverture pour le programme de rééducation</Text>
          <View style={styles.couvButton}>
          <Button  title="Sélectionner une image de couverture" onPress={pickImage} />
          </View>
          {imageBlob && <Image source={{ uri: `data:image/jpeg;base64,${imageBlob}` }} style={styles.image} />}
          <View style={styles.couvButton}>

          <Button title="Suivant" onPress={() => {
            if (imageBlob && isMotifSelected) {
              setCurrentStep(2);
            } else {
              setErrorMessage("Veuillez renseigner tous les champs ");
            }
          }} />
          </View>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </>
      )}

      {currentStep === 2 && !isAddingAnotherExercise && (
        <>
          <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <Text style={styles.title}>Add excercices</Text>
      </View>
          <Text style={styles.subtitle}>Saisissez les détails de l'exercice</Text>
          <Text style={styles.label}>Nom de l'exercice</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'exercice"
            value={exerciceName}
            onChangeText={(text) => setExerciceName(text)}
          />
          <Text style={styles.label}>Série</Text>

          <TextInput
            style={styles.input}
            placeholder="Série"
            value={exerciceSerie}
            onChangeText={handleSerieChange}
          />
          <Text style={styles.errorText}>{serieError}</Text>
          <Text style={styles.label}>Répétition</Text>

          <TextInput
            style={styles.input}
            placeholder="Répétition"
            value={exerciceRep}
            onChangeText={handleRepChange}
          />
          <Text style={styles.errorText}>{repError}</Text>
          <TouchableOpacity onPress={pickVideo} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>Choisir une vidéo</Text>
          </TouchableOpacity>
          {addOther && <Text style={styles.AddText}>{addOther}</Text>}
          <Button title="Ajouter le programme" onPress={sendImageToApi} />
        </>
      )}




      {currentStep === 2 && isAddingAnotherExercise && (
        <>
          <Text style={styles.heading}>Ajouter un autre exercice vidéo</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16 }}
            placeholder="Nom de l'exercice"
            value={exerciceName}
            onChangeText={(text) => setExerciceName(text)}
          />
          <TouchableOpacity onPress={pickVideo} style={{ marginBottom: 16 }}>
            <Text style={{ color: 'blue' }}>Choisir une vidéo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpload} style={{ backgroundColor: 'green', padding: 10, alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Télécharger la vidéo</Text>
          </TouchableOpacity>
          {loading && (
            <Text style={{ marginTop: 16 }}>Téléchargement de la vidéo en cours...</Text>
          )}
          {responseText !== '' && (
            <Text style={{ marginTop: 16, color: responseText.startsWith('Success') ? 'green' : 'red' }}>
              {responseText}
            </Text>
          )}

          <Button   title="Ajouter un autre exercice" onPress={() => setIsAddingAnotherExercise(true)} />
          <Button title="Terminer" onPress={() => setCurrentStep(1)} />
        </>
      )}


     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Fond gris clair
  
  },
  appBar: {
    backgroundColor: '#e61c28', // Fond vert
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 80,
    marginBottom:20,
  },
  backButton: {
    marginRight: 16,
    borderRadius: 20,
    padding: 10,
  },
  title: {
    color: 'white', // Texte blanc
    fontSize: 24,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc', // Bordure grise
    borderRadius: 5,
    backgroundColor: 'white', // Fond blanc
    
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  viewpick:{
    padding:16,
  },
  image: {
    width: '100%', // Largeur maximale
    height: 200,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  AddText: {
    color: 'green',
    marginBottom: 10,
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
  videoButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 16,
  },
  videoButtonText: {
    color: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8, // Espace entre le label et l'input
  },
  couvButton:{
    marginLeft:25,
    marginRight:25,
    marginBottom:10,
  },
});


export default AddProgramScreen;