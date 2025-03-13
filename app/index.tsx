import { Text, View, TouchableOpacity, StyleSheet, Image, Platform, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect, useRef } from 'react'
import { useAssets } from "expo-asset";
import axios from 'axios';
import * as FileSystem from 'expo-file-system'
import { useNavigation } from "@react-navigation/native";

interface IndexProps {imageUri: string; setImageUri: Function; tone: string; setTone: Function};

export default function Index({imageUri, setImageUri, tone, setTone}: IndexProps) {
  const navigation = useNavigation<any>();
  const [assets, error] = useAssets([require('../assets/images/face-id.png')])
  console.log("Erro a pegar a imagem inicial:" + error)
  console.log("Imagem inicial:" + (assets != undefined ? assets[0].uri : "Não possível obte-la"))
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect( () => {
    console.log("Effect => imageUri: ", imageUri)
    if(assets && imageUri == 'EMPTY') {
        setImageUri(assets[0].uri);
        console.log("Imagem inicial de imageUri: ", imageUri)
    }
  }, [assets, imageUri]);
  
  const pickImageFromTheCellPhoneCamera = async (): Promise<ImagePicker.ImagePickerResult> => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      console.log("É necessário permissão para acessar a galeria de imagens!");
      return {assets: null, canceled: true};
    }

    return await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.5,
    });
  } 

  const pickImageFromGallery = async (): Promise<ImagePicker.ImagePickerResult> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(true);

      if (permissionResult.granted === false) {
        console.log("É necessário permissão para acessar a galeria de imagens!");
        return {assets: null, canceled: true};
      }

      return await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.5,
      });
  }

  const pickImage = async (imageSelectionMode: string) => {
    setIsModalVisible(false);

    let result: ImagePicker.ImagePickerResult = {assets: null, canceled: true};

    console.log("Seleção de imagem: " + imageSelectionMode)
    if(imageSelectionMode == 'CAMERA'){
      result = await pickImageFromTheCellPhoneCamera();  
    } else if(imageSelectionMode == 'GALLERY'){
      result = await pickImageFromGallery();
    }

    console.log(result);

    if (!result.canceled) {
      setTone(' ');
      setImageUri(result.assets[0].uri);
      console.log("O resultado: " + result.assets[0].uri)
      
    }
  };

 
  const getFomData = async () => {
    const formData = new FormData();

    if(Platform.OS === 'android'){
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });  
      console.log("É Mobile!!");
      console.log("Imagem em base64: " + base64);
      formData.append('imagem', base64);
    }else if (Platform.OS === 'web'){
      console.log("É Web!!");
      console.log("Imagem em base64: " + imageUri.split(',')[1]);
      formData.append('imagem', imageUri.split(',')[1]);
    }else{
       formData.append('imagem', new Blob([''], {type: 'image/jpg'}), 'imagem.jpg');
    }

    formData.append('formatoDaImagem', 'base64');
    return formData;
  }

  const handleSkinToneDetection = async () => {
    const formData = await getFomData();
    console.log("Imagem em base64: " + imageUri);
    axios.post('https://instant-goldina-tcc2-b3a0db4c.koyeb.app/DetectarTomDePele', // https://instant-goldina-tcc2-b3a0db4c.koyeb.app/DetectarTomDePele  or http://192.168.100.22:5000/DetectarTomDePele
    formData
    , {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      let classification = response.data['Tom']
      console.log("Resposta: " + classification)
      setTone(classification)
      console.log("Tom: " + tone)
    })
  };
 
  return (
      <View style={styles.container}>
        <Modal transparent={true} visible={isModalVisible} animationType="slide"  presentationStyle="overFullScreen">
          <View style={styles.modalContainer}>
            <View style={{height: 180, width: 200, backgroundColor: '#FDFEFE', alignItems: 'center', flexDirection: 'column', borderRadius: 16}}>
              <Text style={{fontSize: 18}} >Selecione:</Text>
              { Platform.OS == 'android' && 
                <TouchableOpacity style={styles.cameraButton} onPress={() => {pickImage("CAMERA")}} >
                  <Text style={styles.buttonLabel} >Camera</Text >
                </TouchableOpacity> }
              { Platform.OS == 'web' && 
                <TouchableOpacity style={styles.cameraButton} onPress={() => {setIsModalVisible(false); navigation.navigate('webcam')}}  >
                  <Text style={styles.buttonLabel} >Camera</Text >
                </TouchableOpacity>
              }
              <TouchableOpacity style={styles.galleryButton} onPress={() => {pickImage("GALLERY")}} >
                <Text style={styles.buttonLabel} >Galeria</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => {setIsModalVisible(true)}} style={styles.addButton} >
          <Ionicons name="add-circle" size={64} color={'#005DB2'} />
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri  }} style={styles.image} />}
        <View style={{height: 50, width: 150}}>
          <Text style={{color: '#17181A', backgroundColor: '#FDFEFE'}}>Tom de pele: {tone}</Text>
        </View>
        <TouchableOpacity onPress={handleSkinToneDetection} style={styles.detectionButton}  >
          <Text style={styles.buttonLabel} >Detectar</Text>
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
  buttonLabel: {
    color: '#FDFEFE',
    fontSize: 12,
    flexShrink: 1
  },
  addButton: {
    marginTop: '10%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    margin: 10,
    marginBottom: '10%', 
    width: 100,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#005DB2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  galleryButton: {
    margin: 10,
    marginBottom: '10%', 
    width: 100,
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#005DB2',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
