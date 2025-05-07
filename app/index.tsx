import { Text, View, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import {Ionicons} from '@expo/vector-icons';
import { useState, useEffect} from 'react'
import { useAssets } from "expo-asset";
import axios from 'axios';
import * as FileSystem from 'expo-file-system'
import { useNavigation } from "@react-navigation/native";
import OptionsModal from "@/components/optionsModal";
import {StatusBar} from "expo-status-bar"
import WaitingForResponseModal from "../components/waitingForResponseModal"

interface IndexProps {imageUri: string; setImageUri: Function; tone: string; setTone: Function; setMassege: Function; setMessageType: Function};

export default function Index({imageUri, setImageUri, tone, setTone, setMassege, setMessageType}: IndexProps) {
  const navigation = useNavigation<any>();
  const [assets, error] = useAssets([require('../assets/images/face-id.png')])
  console.log("Erro a pegar a imagem inicial:" + error)
  console.log("Imagem inicial:" + (assets != undefined ? assets[0].uri : "Não possível obte-la"))
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isWaitingForResponseModalVisible, setIsWaitingForResponseModalVisible] = useState<boolean>(false);

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
     
    
    
    if (!result.canceled) {
      console.log("Imagem redimensionada: " + result.assets[0].uri);
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
      console.log("Tamanho imagem em base64: " + imageUri.length);
      formData.append('imagem', imageUri.split(',')[1]);
    }else{
       formData.append('imagem', new Blob([''], {type: 'image/jpg'}), 'imagem.jpg');
    }

    formData.append('formatoDaImagem', 'base64');
    return formData;
  }

  const handleSkinToneDetection = async () => {
    setIsWaitingForResponseModalVisible(true);
    const formData = await getFomData();

    axios.post('https://instant-goldina-tcc2-b3a0db4c.koyeb.app/DetectarTomDePele', 
    formData
    , {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then((response) => {
      setIsWaitingForResponseModalVisible(false);
      setMassege("Tom de pele detectado!");
      setMessageType("SUCESS");
      let classification = response.data['Tom'];
      setTone(classification);
      navigation.navigate("messageModal");
      console.log("Resposta: " + classification);
      console.log("Tom: " + tone);
    }).catch(() => {
        setIsWaitingForResponseModalVisible(false);
        setMassege("Tom de pele não detectado!");
        setMessageType("ERROR");
        navigation.navigate("messageModal");
    });
  };
 
  return (
      <View  style={styles.container}>
        <StatusBar style="auto" />
        <OptionsModal isOptionsModalVisible={isModalVisible} setIsOptionsModalVisible={setIsModalVisible} pickImage={pickImage} navigation={navigation} />
        <WaitingForResponseModal isWaitingForResponseModalModalVisible={isWaitingForResponseModalVisible}  />
        <TouchableOpacity onPress={() => {setIsModalVisible(true)}} style={styles.addButton} >
          <Ionicons name="add" size={50} color={'#FDFEFE'} /> 
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri  }} style={styles.image} resizeMode="contain" />}
        <View style={{height: 50, width: 150}}>
          <Text style={{color: '#17181A', backgroundColor: '#FDFEFE', fontSize: 16}}>Tom de pele: {tone}</Text>
        </View>
        <TouchableOpacity onPress={handleSkinToneDetection} style={styles.detectionButton} >
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
    backgroundColor:  'rgba(0, 0, 0, 0.2)',
  },
  image: {
    alignItems: 'center',
    width:  300,
    height: 300 ,
    flexShrink: 0.5,
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
    fontSize: 16,
    flexShrink: 1
  },
  addButton: {
    marginTop: '5%',
    marginBottom: '2%',
    backgroundColor: '#005DB2',
    height: 50,
    width: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
