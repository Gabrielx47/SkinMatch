import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome} from "@expo/vector-icons";

interface MessageModalProps {message: string; messageType: string};

export function MessageModal({message, messageType}: MessageModalProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.modalContainer}>
      <View style={{height: 180, width: 200, backgroundColor: '#FDFEFE', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', borderRadius: 16}}>
        {messageType == "SUCESS" ? <FontAwesome name="check-circle" size={40} color="#26a861" /> :
                                   <FontAwesome name="exclamation-circle" size={40} color="#e72528" /> }
          <Text style={{fontSize: 16}} adjustsFontSizeToFit >{message}</Text>
        <TouchableOpacity style={styles.okButton} onPress={() => {navigation.goBack('index');}} >
          <Text style={styles.buttonLabel} adjustsFontSizeToFit >OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  okButton: {
    backgroundColor:  '#FDFEFE'
  },
  buttonLabel: {
    color: '#17181A',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
});