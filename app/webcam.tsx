import {CameraView, Camera} from 'expo-camera'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef} from 'react';
import { useNavigation } from "@react-navigation/native";

interface WebcamViewProps {setImageUri: Function; setTone: Function};

export default function WebcamView({setImageUri, setTone}: WebcamViewProps) {
    const navigation = useNavigation<any>();
    const camera = useRef<CameraView>(null);

  const pickImageFromTheWebcam = async () => {
    setTone(' ');
    //ToDo: mudar o formato da imagem para .jpeg
    const permissionResult = await Camera.getCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("É necessário permissão para acessar a câmera!");
      return;
    }

    const picture = await camera.current?.takePictureAsync({
      imageType: 'jpg',
      quality: 0.5,
    });
        
    if (picture) {
      console.log("Imagem capturada pela webcam: " + picture.uri);
      return picture.uri;
    }
  }
    
  const updateImage = async () => {
    setImageUri(await pickImageFromTheWebcam()); 
    navigation.goBack('index');
   }

    return (
      <CameraView style={styles.WebcamView} ref={camera} pictureSize='460x640'>
        <TouchableOpacity onPress={() => {updateImage()} }>
          <Ionicons name="camera" size={64} color={'#FDFEFE'}/>
        </TouchableOpacity>
       </CameraView>   
    )
} 

const styles = StyleSheet.create({
  WebcamView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  takePhotoButton: {
    backgroundColor:  '#17181A'
  },
});