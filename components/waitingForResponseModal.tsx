import { Text, View, StyleSheet, Modal, ActivityIndicator } from "react-native";


interface WaitingForResponseModalProps {isWaitingForResponseModalModalVisible: boolean};

export default function waitingForResponseModal({isWaitingForResponseModalModalVisible}: WaitingForResponseModalProps) {
    return(
        <Modal transparent visible={isWaitingForResponseModalModalVisible} animationType="slide"  presentationStyle="overFullScreen">
            <View style={styles.modalContainer}>
                <View style={{height: 200, width: 200, backgroundColor: '#FDFEFE', alignItems: 'center', flexDirection: 'column', borderRadius: 16, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#005DB2"/>
                    <Text style={styles.orderStatus} >Detectando...</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  orderStatus: {
    color: '#17181A',
    fontSize: 16,
    flexShrink: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});