import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';


const PaymentForm = () => {
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [clientList, setClientList] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    // Charger la liste des clients depuis votre API lorsque le composant est monté
    fetch('http://192.168.1.9:8000/api/nompatients/6')
      .then((response) => response.json())
      .then((data) => {
        setClientList(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des clients:', error);
      });
  }, []);

  const handlePayment = () => {
    // Créez un objet contenant les données du formulaire
    const formData = {
      clientName: clientName,
      paymentMethod: paymentMethod,
      amountPaid: amountPaid,
    };

    // Effectuez une requête POST vers votre API avec les données du formulaire
    fetch('http://192.168.1.9:8000/paiements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('La requête a échoué');
        }
        return response.json();
      })
      .then((data) => {
        // Gérez la réponse de l'API ici
        setApiResponse(data);
        // Réinitialisez les champs du formulaire si nécessaire
        setClientName('');
        setPaymentMethod('cash');
        setAmountPaid('');
      })
      .catch((error) => {
        // Gérez les erreurs ici
        setApiError(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter paiement</Text>
      </View>
      <Text style={styles.label}>Nom du client :</Text>
      <Picker
        selectedValue={clientName}
        onValueChange={(itemValue) => setClientName(itemValue)}
      >
        <Picker.Item label="Sélectionnez un client" value="" />
        {clientList.map((client) => (
          <Picker.Item
            key={client.id}
            label={`${client.nom} ${client.prenom}`}
            value={`${client.id}`} // Assurez-vous que la valeur est l'ID du client
          />
        ))}
      </Picker>

      <Text style={styles.label}>Méthode de paiement :</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
      >
        <Picker.Item label="Espèces" value="cash" />
        <Picker.Item label="Carte de crédit" value="credit_card" />
        <Picker.Item label="Virement bancaire" value="bank_transfer" />
      </Picker>

      <Text style={styles.label}>Montant payé :</Text>
      <TextInput
        style={styles.input}
        placeholder="Montant payé"
        keyboardType="numeric"
        value={amountPaid}
        onChangeText={(text) => setAmountPaid(text)}
      />

      <Button title="Payer" onPress={handlePayment} />

      {apiResponse && (
        <Text style={styles.apiResponse}>
           {JSON.stringify(apiResponse)}
        </Text>
      )}

      {apiError && (
        <Text style={styles.apiError}>
          Erreur de l'API : {apiError.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginTop: 24,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 16,
  },
  apiResponse: {
    fontSize: 16,
    color: 'green',
    marginTop: 16,
  },
  apiError: {
    fontSize: 16,
    color: 'red',
    marginTop: 16,
  },
});

export default PaymentForm;
