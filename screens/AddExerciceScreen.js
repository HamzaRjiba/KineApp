import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const AddExerciceScreen = () => {
  const [exerciceName, setExerciceName] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [videoBase64, setVideoBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      setVideoData(result);
    }
  };

  const convertVideoToBase64 = async () => {
    if (!videoData) return;

    try {
      const videoBlob = await fetch(videoData.uri).then((response) => response.blob());
      const reader = new FileReader();
      reader.readAsDataURL(videoBlob);
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        setVideoBase64(base64data);
      };
    } catch (error) {
      console.log('Error converting video to base64:', error);
    }
  };

  useEffect(() => {
    convertVideoToBase64();
  }, [videoData]);

  const handleUpload = async () => {
    setLoading(true);
    setResponseText('');

    if (!videoData) {
      setResponseText('Error: No video selected');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/exercices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_base64: videoBase64 }),
      });

      if (response.ok) {
        setResponseText('Success: Exercice video uploaded successfully');
      } else {
        setResponseText('Error: Failed to upload exercice video');
      }
    } catch (error) {
      setResponseText('Error: An error occurred while uploading the video');
      console.log('Error uploading video:', error);
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16 }}
        placeholder="Exercice Name"
        value={exerciceName}
        onChangeText={(text) => setExerciceName(text)}
      />

      <TouchableOpacity onPress={pickVideo} style={{ marginBottom: 16 }}>
        <Text style={{ color: 'blue' }}>Pick a Video</Text>
      </TouchableOpacity>

      

      <TouchableOpacity onPress={handleUpload} style={{ backgroundColor: 'green', padding: 10, alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Upload Video</Text>
      </TouchableOpacity>

      {loading && (
        <Text style={{ marginTop: 16 }}>Uploading video...</Text>
      )}

      {responseText !== '' && (
        <Text style={{ marginTop: 16, color: responseText.startsWith('Success') ? 'green' : 'red' }}>
          {responseText}
        </Text>
      )}
    </View>
  );
};

export default AddExerciceScreen;
