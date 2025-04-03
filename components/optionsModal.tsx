import { Text, View, TouchableOpacity, StyleSheet, Platform, Modal } from "react-native";
import { FontAwesome} from "@expo/vector-icons";


interface OptionsModalProps {isOptionsModalVisible: boolean; setIsOptionsModalVisible: Function; pickImage: Function; navigation: any};

export default function OptionsModal({isOptionsModalVisible, setIsOptionsModalVisible, pickImage, navigation}: OptionsModalProps) {
    return(
        <Modal transparent visible={isOptionsModalVisible} animationType="slide"  presentationStyle="overFullScreen">
          <View style={styles.modalContainer}>
            <View style={{height: 200, width: 200, backgroundColor: '#FDFEFE', alignItems: 'center', flexDirection: 'column', borderRadius: 16}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', rowGap: 10, width: 180}} >
                  <Text style={{fontSize: 18}} >Selecione:</Text>
                  <TouchableOpacity onPress={() => {setIsOptionsModalVisible(false)}} >
                    <FontAwesome name="close" size={25} color="#e72528" />
                  </TouchableOpacity>
                </View>
                
              { Platform.OS == 'android' && 
                <TouchableOpacity style={styles.cameraButton} onPress={() => {pickImage("CAMERA")}} >
                  <Text style={styles.buttonLabel} >Camera</Text >
                </TouchableOpacity> }
              { Platform.OS == 'web' && 
                <TouchableOpacity style={styles.cameraButton} onPress={() => {setIsOptionsModalVisible(false); navigation.navigate('webcam')}}  >
                  <Text style={styles.buttonLabel} >Camera</Text >
                </TouchableOpacity>
              }
              <TouchableOpacity style={styles.galleryButton} onPress={() => {pickImage("GALLERY")}} >
                <Text style={styles.buttonLabel} >Galeria</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  buttonLabel: {
    color: '#FDFEFE',
    fontSize: 14,
    flexShrink: 1
  },
  addButton: {
    marginTop: '10%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
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