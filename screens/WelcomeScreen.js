import React, { useEffect } from 'react';
import { View, Text, StyleSheet,Image  } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const WelcomeScreen = () => {
    const navigation = useNavigation();

  // Utilisez useEffect pour définir un délai avant la redirection
  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirigez vers l'écran principal après 5 secondes
      navigation.navigate('LoginScreenKine');
    }, 3000); // 5000 millisecondes (5 secondes)

    // Nettoyez le timer si le composant est démonté avant la fin du délai
    return () => clearTimeout(timer);
  }, );

  return (
    <View style={styles.container}>
     <Image source={require('../assets/welcome.png')} style={styles.welcomeLogo} />
     <Image source={require('../assets/desc.png')} style={styles.DescLogo} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#e61c28',
  },
  welcomeLogo: {
    width:250,
    height: 200,
    marginBottom: 24,
    marginRight:20,
  },
  DescLogo:{
    width: 250,
    height: 200,
    marginTop:40,
  },
});

export default WelcomeScreen;
