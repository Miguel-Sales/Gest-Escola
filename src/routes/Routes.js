import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import Login from "../screens/Login";
import Turmas from "../screens/Turmas"

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function NativeStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Turmas"
    >
      {/* Splash inicial */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Tela de Login */}
      <Stack.Screen name="Login" component={Login} />

      <Stack.Screen name="Turmas" component={Turmas} />


      {/* Drawer desativado temporariamente */}
      {/* <Stack.Screen
        name="App"
        component={DrawerNavigator}
      /> */}
    </Stack.Navigator>
  );
}

// export function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: false,
//         drawerActiveTintColor: "#fff",
//         drawerInactiveTintColor: "#fff",
//         drawerStyle: {
//           backgroundColor: "#305F49",
//           width: 320,
//           borderTopRightRadius: 20,
//           borderBottomRightRadius: 20,
//         },
//         drawerLabelStyle: {
//           fontWeight: "bold",
//           fontSize: 20,
//           marginLeft: 5,
//         },
//       }}
//     >
//       <Drawer.Screen
//         name="Inicio"
//         component={Inicio}
//         options={{
//           drawerLabel: "Início",
//         }}
//       />
//       <Drawer.Screen
//         name="Inicio"
//         component={Atividades}
//         options={{
//           drawerLabel: "Atividades",
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }
