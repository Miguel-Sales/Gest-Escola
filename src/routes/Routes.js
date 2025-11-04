import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import SplashScreen from "../screens/SplashScreen";
import Login from "../screens/Login";
import Turmas from "../screens/Turmas";
import Atividades from "../screens/Atividades";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function NativeStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="App"
    >
      {/* Splash inicial */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      {/* Tela de Login */}
      <Stack.Screen
        name="Login"
        component={Login}
      />

      {/* Drawer desativado temporariamente */}
      <Stack.Screen
        name="App"
        component={TabNavigator}
      />
    </Stack.Navigator>
  );
}

export function TabNavigator() {
  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2d73b5",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 8,
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Atividades") {
            iconName = "clipboard-outline";
          } else if (route.name === "Turmas") {
            iconName = "school-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Atividades" component={Atividades} />
      <Tab.Screen name="Turmas" component={Turmas} />
    </Tab.Navigator>
    </SafeAreaView>
  );
}