import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper'; // Importer le composant AppBar depuis la bibliothèque react-native-paper
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';
import { useUser } from './UserContext'; 


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkScheduleScreen = () => {
  const {getName,getUserId,getFirstName, setName, setFirstName, setLastName, setUserId } = useUser();

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [workSchedule, setWorkSchedule] = useState([{ id: 0, day: 'Monday', time: '' }]);
  const [lastId, setLastId] = useState(0);

  const handleTimeChange = (id, time) => {
    const updatedSchedule = workSchedule.map(entry =>
      entry.id === id ? { ...entry, time } : entry
    );
    setWorkSchedule(updatedSchedule);
  };

  const handleNextDay = () => {
    if (currentDayIndex < daysOfWeek.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
      const newDay = daysOfWeek[currentDayIndex + 1];
      setLastId(lastId + 1);
      setWorkSchedule([...workSchedule, { id: lastId + 1, day: newDay, time: '' }]);
    }
  };

  const handlePreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const handleAddTimeInput = () => {
    const newDay = daysOfWeek[currentDayIndex];
    setLastId(lastId + 1);
    setWorkSchedule([...workSchedule, { id: lastId + 1, day: newDay, time: '' }]);
  };

  const handleRemoveTimeInput = (id) => {
    const updatedSchedule = workSchedule.filter(entry => entry.id !== id);
    setWorkSchedule(updatedSchedule);
  };

  const handleSaveSchedule = () => {
    // Récupérer les temps pour chaque jour dans des variables distinctes
    const lundiTimes = workSchedule
      .filter(entry => entry.day === 'Monday')
      .map(entry => entry.time)
      .join(';');

    const mardiTimes = workSchedule
      .filter(entry => entry.day === 'Tuesday')
      .map(entry => entry.time)
      .join(';');

    const mercrediTimes = workSchedule
      .filter(entry => entry.day === 'Wednesday')
      .map(entry => entry.time)
      .join(';');

    const jeudiTimes = workSchedule
      .filter(entry => entry.day === 'Thursday')
      .map(entry => entry.time)
      .join(';');

    const vendrediTimes = workSchedule
      .filter(entry => entry.day === 'Friday')
      .map(entry => entry.time)
      .join(';');

    const samediTimes = workSchedule
      .filter(entry => entry.day === 'Saturday')
      .map(entry => entry.time)
      .join(';');

    const dimancheTimes = workSchedule
      .filter(entry => entry.day === 'Sunday')
      .map(entry => entry.time)
      .join(';');

    // Créer un objet contenant les temps de chaque jour
    const scheduleData = {
      kineId:getUserId(),
      lundi: lundiTimes,
      mardi: mardiTimes,
      mercredi: mercrediTimes,
      jeudi: jeudiTimes,
      vendredi: vendrediTimes,
      samedi: samediTimes,
      dimanche: dimancheTimes,
    };

    // Faire une requête POST vers l'API avec les données des temps
    axios.post('http://192.168.1.10:8000/api/emploi', scheduleData)
      .then(response => {
        console.log('Schedule data sent successfully:', response.data);
        // Traiter les actions de succès ici si nécessaire
      })
      .catch(error => {
        console.error('Error sending schedule data:', error);
        // Traiter les erreurs ici si nécessaire
      });
  };

  const currentDay = daysOfWeek[currentDayIndex];

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction color="white" onPress={handlePreviousDay} />
        <Appbar.Content title="Enter Work Schedule"  color="white" style={styles.appBarTitle} />
        <Appbar.Action icon="content-save" onPress={handleSaveSchedule} />
      </Appbar.Header>

      <View style={styles.content}>
      

        {workSchedule.map((entry) => (
          <View key={entry.id}>
            {entry.day === currentDay && (
              <>
                <Text style={styles.dayLabel}>{entry.day}:</Text>
                <TextInputMask
                  style={styles.input}
                  type={'datetime'}
                  options={{
                    format: 'HH:mm',
                  }}
                  value={entry.time}
                  onChangeText={(time) => handleTimeChange(entry.id, time)}
                  placeholder="00:00"
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => handleRemoveTimeInput(entry.id)}>
                  <Text style={styles.deleteButton}>Supprimer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}

        <View style={styles.buttonContainer}>
          {currentDayIndex > 0 && (
            <TouchableOpacity onPress={handlePreviousDay}>
              <Text style={styles.button}>Précédent</Text>
            </TouchableOpacity>
          )}

          {currentDayIndex < daysOfWeek.length - 1 && (
            <TouchableOpacity onPress={handleNextDay}>
              <Text style={styles.button}>Suivant</Text>
            </TouchableOpacity>
          )}

          {currentDayIndex === daysOfWeek.length - 1 && (
            <TouchableOpacity onPress={handleSaveSchedule}>
              <Text style={styles.button}>Enregistrer</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleAddTimeInput}>
            <Text style={styles.button}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    elevation: 0,
  },
  appBarTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color:"white",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#11BD60',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  deleteButton: {
    color: 'red',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default WorkScheduleScreen;
