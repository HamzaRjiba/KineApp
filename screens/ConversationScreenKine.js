import React, { useState, useEffect, useRef,TouchableOpacity } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';


const ConversationScreenKine = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState({});
  const scrollViewRef = useRef();

  useEffect(() => {
    fetchDataFromAsyncStorage();
  }, []); // Ne chargez les données d'authentification qu'une seule fois

  useEffect(() => {
    fetchConversation(); // Chargez la conversation une fois au démarrage
    const intervalId = setInterval(fetchConversation, 4000); // Rafraîchissez la conversation toutes les 4 secondes

    return () => {
      clearInterval(intervalId); // Nettoyez l'intervalle lors du démontage du composant
    };
  }, [userData]); // Assurez-vous de rafraîchir la conversation lorsque userData change

  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const fetchConversation = async () => {
    if (!userData.kineId || !userData.userId) {
      // Évitez de faire la requête si les données d'authentification ne sont pas prêtes
      return;
    }

    try {
      const response = await axios.get(
        'http://192.168.1.8:8000/conversation/' + userData.userId + '/' + userData.kineId
      );
      const conversation = response.data.map((message) => ({
        id: message.id,
        text: message.message,
        user: message.role,
      }));
      setMessages(conversation);

      // Faites défiler jusqu'au bas de la conversation
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la conversation :', error);
    }
  };

  const sendMessage = async () => {
    try {
      // Assurez-vous de remplacer ces valeurs par les informations pertinentes
      // pour l'envoi du message à votre API
      const messageText = newMessage;
      const kineId = userData.userId;
      const patientId = userData.kineId;
     

      // Envoyez le message à votre API
      await axios.post('http://192.168.1.8:8000/messages/envoyer', {
        message: messageText,
        kine_id: kineId,
        patient_id: patientId,
        role: 'kine',
      });

      // Rafraîchissez la conversation après avoir envoyé le message
      fetchConversation();

      // Effacez le champ de texte
      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  return (
    <View style={styles.container}>
       

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              {
                alignSelf: message.user === 'kine' ? 'flex-start' : 'flex-end',
                backgroundColor: message.user === 'kine' ? 'blue' : 'white',
              },
            ]}
          >
            <Text style={[
              styles.messageText,
              {
                color: message.user === 'kine' ? 'white' : 'black',
              },
            ]}>
              {message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Tapez votre message..."
        />
        <Button
          title="Envoyer"
          onPress={sendMessage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  messageContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 8,
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
});

export default ConversationScreenKine;
