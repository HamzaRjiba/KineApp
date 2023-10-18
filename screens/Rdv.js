import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image } from 'react-native';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import * as Font from 'expo-font';
import Swiper from 'react-native-swiper/src';
import CustomNavigationBar from './CustomNavigationBar';
import { useNavigation } from '@react-navigation/native';
import { useUser  } from './UserContext';




const HomePatient = () => {
  const { getName, setName } = useUser();

  const handleButtonKine= () => {
    navigation.navigate('LoginScreenKine');
    
  };
  const handleButtonPat= () => {
    navigation.navigate('ListPatients');
    
  };
  
  const handleCompte= () => {
    navigation.navigate('AccountManagementScreen');
    
  };


  const handleSetName = () => {
    setName('John Doe'); // Vous pouvez appeler setName pour mettre à jour le nom dans le contexte utilisateur
  };

  const [visible, setVisible] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigation = useNavigation();
  const handleButtonSearch = () => {
    navigation.navigate('SearchScreen');
  };
 

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'oleo-script': require('../fonts/OleoScript-Regular.ttf'),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  

  const renderCarouselItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={require('../assets/kine.png')} style={styles.carouselIcon} />
        <Text style={styles.carouselText}>{item}
        </Text>
      </View>
    );
  };

  const carouselData = [
    'KinéTun: La solution idéale pour simplifier vos soins à domicile/éxterieur',
    'KinéTun: La solution idéale pour simplifier vos soins à domicile/éxterieur',
    'KinéTun: La solution idéale pour simplifier vos soins à domicile/éxterieur'
  ];

  const advantagesData = [
    {
      image: require('../assets/advantage1.jpg'),
      text: 'Soyez trouvé facilement par les patients'
    },
    {
      image: require('../assets/advantage2.png'),
      text: 'Économisez du temps et Gérez facilement en ligne vos rendez-vous '
    },
    {
      image: require('../assets/advantage3.png'),
      text: 'Gérez vos paiements en toute simplicité'
    }
  ];

  return (
    <PaperProvider>
      <View style={styles.appBar}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
              <Icon name="list" size={28} color="white" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={handleCompte} title="Compte" />
          <Divider />
          <Menu.Item onPress={handleButtonPat} title="Mes patients" />
        </Menu>
        <Text style={styles.knetunText}>KinéPro</Text>
        <TouchableOpacity style={styles.connectButton} onPress={handleButtonKine}>
          <Text style={styles.connectText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}> La solution pour simplifier</Text> 
        <Text style={styles.heading2}>vos soins à domicile  </Text>
    

       

        <ScrollView style={styles.carouselContainer}>
          <Swiper
            loop={false}
            showsPagination={false}
            showsButtons={false}
            containerStyle={styles.swiperContainer}
            activeDotColor="#000"
            sliderWidth={200}
            itemWidth={150}
            height={150}
            onIndexChanged={index => setActiveSlide(index)}
          >
            {carouselData.map((item, index) => (
              <View key={index} style={styles.carouselItem}>
                <Image source={require('../assets/kine.png')} style={styles.carouselIcon} />
                <Text style={styles.carouselText}>{item}</Text>
              </View>
            ))}
          </Swiper>
          <View style={styles.paginationContainer}>
            {carouselData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeSlide === index ? styles.activePaginationDot : null,
                ]}
              />
            ))}
          </View>
        </ScrollView>
    

        <View style={styles.viewkine}>
         

          <View style={styles.advantagesContainer}>
            {advantagesData.map((advantage, index) => (
              <View key={index} style={styles.advantageItem}>
                <Image source={advantage.image} style={styles.advantageImage} />
                <Text style={styles.advantageText}>{advantage.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <CustomNavigationBar />

    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#e61c28',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 80,
    marginTop:20,
  },
  menuButton: {
    marginRight: 16,
    borderRadius: 20,
    padding: 10,
  },
  viewkine: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  knetunText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'oleo-script',
  },
  connectButton: {
    marginLeft: 16,
  },
  connectText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#e61c28',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 20,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    width: 160,
    alignSelf: 'center',
  },
  searchButtonText: {
    color: '#e61c28',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  carouselContainer: {
    marginTop: 16,
   
    },
  swiperContainer: {
    flex: 1,
   
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
  },
  carouselIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  carouselText: {
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: '#000',
  },
  advantagesContainer: {
    marginTop: 16,
    backgroundColor: 'white',
    marginBottom:80,
  },
  advantageItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
  advantageImage: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  advantageText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  kineButton: {
    backgroundColor: '#e61c28',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 16,
  },
  kineButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePatient;
