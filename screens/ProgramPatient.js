import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import NavBarPatient from './NavBarPatient';

const apiUrl = 'http://192.168.1.8:8000/api/patientprog/3';

const ProgramPatient= () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [selectedName, setSelectedName] = useState('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // Nouvel état pour la recherche
  const programsPerPage = 3;
  const navigation = useNavigation();

  const handleAddProg = () => {
    navigation.navigate('AddProgramScreen');
  };

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setProgrammes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchProgrammes();
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
          <Text style={styles.programmeNom}>{item.nomprog}</Text>
          <Image
            source={{ uri: 'http://192.168.1.8:8000/uploads/' + item.description }}
            style={styles.image}
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="play-circle" size={20} color="#007AFF" />
              <Text style={{ marginLeft: 4 }}>8 séances</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock" size={20} color="#007AFF" />
              <Text style={{ marginLeft: 4 }}>12 mins</Text>
            </View>
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
            <Text style={styles.programmeNom}>{selectedProgramme.nom}</Text>
            <FlatList
              data={selectedProgramme.exercices}
              keyExtractor={(exercice) => exercice.id.toString()}
              renderItem={({ item: exercice }) => (
                <View style={styles.exerciceItem}>
                  <Text style={styles.exerciceNom}>{exercice.nom}</Text>
                  <Text>Repetitions: {exercice.repetitions}</Text>
                  <Text>Series: {exercice.series}</Text>
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
      
      <View style={styles.space}></View>
      <NavBarPatient />
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
  pageButton: {
    backgroundColor: '#e61c28',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activePageButton: {
    backgroundColor: 'green',
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
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default ProgramPatient;
