import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useState } from "react"
import Index from "./index";
import Webcam from "./webcam";
import { useAssets } from "expo-asset";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [assets, error] = useAssets([require('../assets/images/face-id.png')])
  console.log("Erro a pegar a imagem inicial:" + error)
  console.log("Imagem inicial:" + (assets != undefined ? assets[0].uri : "Não possível obte-la"))
  const [imageUri, setImageUri] = useState<string>('EMPTY');
  const [tone, setTone] = useState<string>(' ');

  return (
    <Stack.Navigator >
      <Stack.Screen name="index" options={{ title: 'Skin Match' }} >
        {() => <Index  imageUri={imageUri} setImageUri={setImageUri} tone={tone} setTone={setTone} /> } 
      </Stack.Screen>    
      <Stack.Screen name="webcam" options={{ title: 'Webcam' }}>
        {() => <Webcam setImageUri={setImageUri} setTone={setTone} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

