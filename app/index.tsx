import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react'
import { useAssets } from "expo-asset";
import axios from 'axios';

export default function Index() {
  const [assets, error] = useAssets([require('../assets/images/face-id.png')])
  console.log("Erro a pegar a imagem inicial:" + error)
  console.log("Imagem inicial:" + (assets != undefined ? assets[0].uri : "Não possível obte-la"))
  const [image, setImage] = useState<string | null>(null);
  const [number, setNumber] = useState<string>('');

  useEffect( () => {
    if(assets){
      setImage(assets[0].uri)
    }
  }, [assets]);
  

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
      setNumber('');
    }
  };

  const handleSkinToneDetection = () => {
    axios.postForm('http://127.0.0.1:5000/DetectarTomDePele', {
      'imagem' : new File([image != null ? image.replace('data:image/jpeg;base64,', '') : ""], 'imagem.jpg'),
      'formatoDaImagem': 'base64'
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      console.log("Resposta: " + response.data['Tom'])
      setNumber(response.data['Tom']);
    })
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
        <Ionicons name="add-circle" size={64} color={'#005DB2'} />
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text>Tom: {number}</Text>
      <TouchableOpacity style={styles.detectionButton}>
        <Text onPress={handleSkinToneDetection} style={styles.labelDetectionButton} >Detectar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor:  '#17181A'
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
