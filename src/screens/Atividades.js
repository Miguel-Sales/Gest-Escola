import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dynamoDB from "../../awsConfig";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      // 🔍 Busca o usuário pelo email no DynamoDB
      const data = await dynamoDB.send(
        new ScanCommand({
          TableName: "usuarios",
          FilterExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": { S: email },
          },
        })
      );

      if (!data.Items || data.Items.length === 0) {
        Alert.alert("Erro", "Usuário não encontrado!");
        setLoading(false);
        return;
      }

      const usuario = data.Items[0];
      const senhaHash = usuario.senha.S;

      // 🔐 Compara a senha digitada com o hash salvo
      const senhaCorreta = await bcrypt.compare(senha, senhaHash);

      if (!senhaCorreta) {
        Alert.alert("Erro", "Senha incorreta!");
        setLoading(false);
        return;
      }

      // ✅ Login bem-sucedido
      const tipoUsuario = usuario.tipo.S;

      // 💾 Armazena informações do usuário logado
      await AsyncStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          id: usuario.id.S,
          nome: usuario.nome.S,
          email: usuario.email.S,
          tipo: tipoUsuario,
        })
      );

      Alert.alert("Sucesso", `Bem-vindo, ${usuario.nome.S}!`);
      await AsyncStorage.setItem("usuarioId", usuario.id.N);

      if (tipoUsuario === "admin") {
        navigation.navigate("Inicio"); // Tela de admin
      } else {
        navigation.navigate("Inicio"); // Tela de funcionário
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Falha na autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#305F49" }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />

        <View style={styles.loginCard}>
          <Text style={styles.title}>Entre na sua{"\n"}conta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#fff"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={fazerLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("RedefinirSenha")}
          >
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 280,
    width: 280,
    resizeMode: "contain",
  },
  loginCard: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#305F49",
    borderTopLeftRadius: 120,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Roboto-Bold",
  },
  inputGroup: {
    width: "80%",
    marginVertical: 10,
    alignItems: "flex-start",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(159, 209, 183, 0.69)",
    borderRadius: 8,
    height: 50,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto-Bold",
  },
  button: {
    width: "60%",
    backgroundColor: "#9FD1B7",
    borderRadius: 8,
    padding: 15,
    height: 60,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
  forgotPassword: {
    marginTop: 15,
    marginBottom: 10,
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "Roboto-Bold",
  },
});
