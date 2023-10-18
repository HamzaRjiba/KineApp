import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RadioButton } from 'react-native-paper';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        {step > 0 && (
          <TouchableOpacity onPress={handlePreviousStep} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Inscription</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Renseigner vote identité</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Date de naissance"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <View style={styles.genderContainer}>
              
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="feminin"
                  status={gender === 'feminin' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('feminin')}
                />
                <Text style={styles.radioButtonLabel}>Féminin</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="masculin"
                  status={gender === 'masculin' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('masculin')}
                />
                <Text style={styles.radioButtonLabel}>Masculin</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((step - 1) / 3) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Définissez votre mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((step - 1) / 3) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Entrer votre numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Terminer</Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((step - 1) / 3) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    backgroundColor: '#11BD60',
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
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  genderContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderLabel: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioButtonContainer: {
   
    lexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderRadius: 18,
    padding: 4,
    width: 150,
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonLabel: {
    fontSize: 16,
   
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#F2F2F2',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#11BD60',
  },
  button: {
    backgroundColor: '#11BD60',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup;
