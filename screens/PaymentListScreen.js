import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import CustomNavigationBar from './CustomNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



const PaymentListScreen = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [paginatedPayments, setPaginatedPayments] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  const handleAddPaiement= () => {
    navigation.navigate('PaymentForm');
    
  };

  
  const fetchDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        axios.get('http://192.168.1.8:8000/api/kine/'+parsedData.userId+'/paiements')
        .then((response) => {
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginated = response.data.slice(startIndex, endIndex);
  
          setPayments(response.data);
          setPaginatedPayments(paginated);
  
          if (endIndex >= response.data.length) {
            setHasMoreData(false);
          } else {
            setHasMoreData(true);
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des paiements:', error);
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    fetchDataFromAsyncStorage();
  
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setHasMoreData(true);
    }
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.patientName}>Nom du Patient: {item.patientname}</Text>
      <Text style={styles.amount}>Montant: {item.montant} Dt</Text>
      <Text style={styles.amount}>Méthode de paiement: {item.moyen_de_paiement}</Text>
      <Text style={styles.amount}>Date de paiement: {item.date_paiement}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={28} color="white" style={styles.backButton} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <Text style={styles.title}>Liste des paiements</Text>
      </View>

      <FlatList
        data={paginatedPayments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPaymentItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.pagination}>
        <Button title="Précédent" onPress={handlePrevPage} disabled={currentPage === 1} />
        <Text>Page {currentPage}</Text>
        <Button title="Suivant" onPress={handleNextPage} disabled={!hasMoreData} />
      </View>
      <TouchableOpacity
  style={styles.addButton}
  onPress={handleAddPaiement}
>
  <Icon name="plus" size={30} color="white" />
</TouchableOpacity>
      {/* Placer le composant CustomNavigationBar ici */}
      <CustomNavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 14,
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e61c28',
    borderRadius: 50,
    padding: 10,
    marginBottom:100,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom:16,
    paddingHorizontal: 16, // Ajout de marge horizontale pour les boutons
    marginBottom:80,
  },
  appBar: {
    backgroundColor: '#e61c28',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 80,
    marginTop:20,
    marginBottom:30,
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

export default PaymentListScreen;
