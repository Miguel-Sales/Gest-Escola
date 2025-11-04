import React from "react";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native";
// Importou o Drawer porque é a navegação principal que escolhemos, mas poderia ser qualquer outra
import NativeStack from "./src/routes/Routes";

export default function App() {
  return (
    <NavigationContainer>
      <NativeStack />
    </NavigationContainer>
  );
}
