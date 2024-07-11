import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import Rdv from './screens/Rdv';
import RendezVous from './screens/RendezVous';
import SignupKineScreen from './screens/SignupKineScreen';
import SearchScreen from './screens/SearchScreen';
import AddExerciceScreen from './screens/AddExerciceScreen';
import { UserProvider } from './screens/UserContext';
import WorkScheduleScreen from './screens/WorkScheduleScreen';
import LoginScreenKine from './screens/LoginScreenKine';
import Upload from './screens/upload';
import StoreDataScreen from './screens/aaa';
import KineDetailsScreen from './screens/KineDetailsScreen';
import HoraireScreen from './screens/HoraireScreen';
import AddProgramScreen from './screens/AddProgramScreen';
import ProgramScreen from './screens/ProgramScreen';
import ProgramItem from './screens/programItem';
import PaymentForm from './screens/PaymentForm';
import PaymentListScreen from './screens/PaymentListScreen';
import ConversationScreen from './screens/ConversationScreen';
import RendezVousPatient from './screens/RendezVousPatient';
import PaiementPatient from './screens/PaiementPatient';
import HomePatient from './screens/HomePatient';
import Edit from './screens/Edit';
import WelcomeScreen from './screens/WelcomeScreen';
import ProgramPatient from './screens/ProgramPatient';
import DocumentsPatient from './screens/DocumentsPatient';
import ListPatients from './screens/ListPatients';
import AccountManagementScreen from './screens/AccountManagementScreen';
import KinesitherapeuteList from './screens/KinesitherapeuteList';
import SuperAlert from "react-native-super-alert";
import ConversationScreenKine from './screens/ConversationScreenKine';
  const Stack = createNativeStackNavigator(); 
  export default function App() {
     return (
 
      <UserProvider>
         
     <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown: false}}>

      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
      <Stack.Screen name="KinesitherapeuteList" component={KinesitherapeuteList}
       options={{ headerShown: true, title: 'Listes des kinés' }}/>

      <Stack.Screen name="LoginScreenKine" component={LoginScreenKine}/>
      <Stack.Screen name="ProgramPatient" component={ProgramPatient}/>
      <Stack.Screen name="DocumentsPatient" component={DocumentsPatient}/>
      <Stack.Screen name="ListPatients" component={ListPatients}/>
      <Stack.Screen name="AccountManagementScreen" component={AccountManagementScreen}/>

      <Stack.Screen name="LoginScreen" component={LoginScreen}/>


      <Stack.Screen name="HomePatient" component={HomePatient}/>
      <Stack.Screen name="Edit" component={Edit}/>


      <Stack.Screen name="PaiementPatient" component={PaiementPatient}/>
      <Stack.Screen name="RendezVousPatient" component={RendezVousPatient}/>

      <Stack.Screen name="StoreDataScreen" component={StoreDataScreen}/>

      <Stack.Screen name="ConversationScreen" component={ConversationScreen}  
      options={{ headerShown: true, title: 'Conversation' }}/>
       <Stack.Screen name="ConversationScreenKine" component={ConversationScreenKine}  
      options={{ headerShown: true, title: 'Conversation' }}/>


      <Stack.Screen name="PaymentListScreen" component={PaymentListScreen}/>

      <Stack.Screen name="PaymentForm" component={PaymentForm}/>


      <Stack.Screen name="ProgramScreen" component={ProgramScreen}/>

      <Stack.Screen name="ProgramItem" component={ProgramItem}/>



      <Stack.Screen name="AddProgramScreen" component={AddProgramScreen}/>


      <Stack.Screen name="SearchScreen" component={SearchScreen}/>
      <Stack.Screen name="KineDetailsScreen" component={KineDetailsScreen}/>
      <Stack.Screen name="HoraireScreen" component={HoraireScreen}/>


   
      <Stack.Screen name="Upload" component={Upload}/>
      <Stack.Screen name="WorkScheduleScreen" component={WorkScheduleScreen}/>      

      <Stack.Screen name="AddExerciceScreen" component={AddExerciceScreen}/>
      <Stack.Screen name="RendezVous" component={RendezVous}
      
      /> 
      <Stack.Screen name="SignupKineScreen" component={SignupKineScreen}/> 
      <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>
    

      
      <Stack.Screen name="Rdv"
        component={Rdv}
      
        />
        
      </Stack.Navigator>
     </NavigationContainer>
     <SuperAlert />
     </UserProvider>
     
     );
}