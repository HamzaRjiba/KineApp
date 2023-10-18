import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Nominatim from 'nominatim-client'; // Assurez-vous que vous avez installé le module Nominatim

const GeocodingComponent = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleGeocode = () => {
    const query = 'sousse'; // Remplacez par l'adresse que vous souhaitez géocoder

    Nominatim.geocode({
      q: query,
      addressdetails: 1,
      limit: 1,
    })
      .then((result) => {
        if (result.length > 0) {
          const firstResult = result[0];
          setLatitude(firstResult.lat);
          setLongitude(firstResult.lon);
        } else {
          console.error('Aucun résultat trouvé pour cette adresse.');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la géocodage :', error);
      });
  };

  return (
    <View>
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
      <Button title="Géocoder l'adresse" onPress={handleGeocode} />
    </View>
  );
};

export default GeocodingComponent;
