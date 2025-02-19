import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react'

export default function Index() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      console.log("O resultado: " + result.assets[0].uri)
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "column"
      }}
    >
      <TouchableOpacity onPress={pickImage} style={styles.addButton} >
        <Ionicons name="add-circle-outline" size={64} />
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.detectionButton}>
        <Text style={styles.labelDetectionButton} >Detectar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'column'
  },
  image: {
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  detectionButton: {
    margin: 10,
    marginBottom: '10%', 
    width: 100,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#005DB2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelDetectionButton: {
    color: '#FDFEFE'
  },
  addButton: {
    marginTop: '10%'
  }
});
