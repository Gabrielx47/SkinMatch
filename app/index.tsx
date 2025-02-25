import { Text, View, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react'
import { useAssets } from "expo-asset";
import axios from 'axios';
import * as FileSystem from 'expo-file-system'

export default function Index() {
  const [assets, error] = useAssets([require('../assets/images/face-id.png')])
  console.log("Erro a pegar a imagem inicial:" + error)
  console.log("Imagem inicial:" + (assets != undefined ? assets[0].uri : "Não possível obte-la"))
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [number, setNumber] = useState<string>(' ');

  useEffect( () => {
    if(assets){
      setImage(assets[0].uri)
    }
  }, [assets]);
  
 

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(true);

    if (permissionResult.granted === false) {
      console.log("É necessário permissão para acessar a galeria de imagens!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.5,
    });
    console.log(result);

    if (!result.canceled) {
      console.log("O resultado: " + result.assets[0].uri)
      if(Platform.OS === 'android'){
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });  
        setImageBase64(base64);
        console.log("Imagem em base64: " + imageBase64);
        console.log("O resultado: " + result.assets[0].uri)
      } else if(Platform.OS === 'web'){
        setImageBase64((result.assets[0].uri).split(',')[1])
      } 
      setImage(result.assets[0].uri);
      setNumber(' ');
    }
  };

  const base64ToBlob = (image: string) => {  
    console.log("Imagem em base64 da aplicação móvel: " + image);
    return new Blob([image ? image : ''], { type: 'image/jpg' });
  }

  const getFomData = () => {
    const formData = new FormData();

    if(Platform.OS === 'android' && imageBase64 != null){
      console.log("É Mobile!!");
      const blob = base64ToBlob(imageBase64);
      formData.append('imagem', imageBase64);
    }else if (Platform.OS === 'web' && image != null){
      console.log("É Web!!");
      const blob = base64ToBlob(image.split(',')[1]);
      formData.append('imagem', image.split(',')[1]); // new File([image.replace('data:image/jpg;base64,', '')], 'imagem.jpg')
    }else{
       formData.append('imagem', new Blob([''], {type: 'image/jpg'}), 'imagem.jpg');
    } 
    
    formData.append('formatoDaImagem', 'base64');
    return formData;
  }

  const handleSkinToneDetection = () => {
    console.log("Imagem em base64: " + image);
    axios.post('http://192.168.100.22:5000/DetectarTomDePele', 
    getFomData()
    , {
      headers: {
        'Content-Type': 'multipart/form-data' //application/json
      }
    }).then((response) => {
      let classification = response.data['Tom']
      console.log("Resposta: " + classification)
      setNumber(classification)
      console.log("Tom: " + number)
    })
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.addButton} >
        <Ionicons name="add-circle" size={64} color={'#005DB2'} />
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={{height: 50, width: 150}}>
        <Text style={{color: '#17181A', backgroundColor: '#FDFEFE'}}>Tom de pele: {number}</Text>
      </View>
      <TouchableOpacity onPress={handleSkinToneDetection} style={styles.detectionButton}>
        <Text style={styles.labelDetectionButton} >Detectar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
