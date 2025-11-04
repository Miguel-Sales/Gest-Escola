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
import { Ionicons } from "@expo/vector-icons";
import bcrypt from "bcryptjs";

export default function LoginScreen({ navigation }) {
  const [nome, setNome] = useState("");
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

      const senhaCorreta = await bcrypt.compare(senha, senhaHash);

      if (!senhaCorreta) {
        Alert.alert("Erro", "Senha incorreta!");
        setLoading(false);
        return;
      }

      const tipoUsuario = usuario.tipo.S;

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

      navigation.navigate("Inicio");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Falha na autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2d73b5" }}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/turma-logo.png")}
        />

        <View style={styles.loginCard}>
          {/* 🔙 Linha com o botão de voltar e o título */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={32} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Criar conta</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#2d73b5"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#2d73b5"
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
              placeholderTextColor="#2d73b5"
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
              <Text style={styles.buttonText}>Confirmar</Text>
            )}
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
    height: 200,
    width: 200,
    marginBottom: 50,
    marginTop: 50,
    resizeMode: "contain",
  },
  loginCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2d73b5",
    borderTopLeftRadius: 120,
    alignItems: "center",
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginLeft: 10,
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
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
    padding: 10,
    fontSize: 16,
    color: "#2d73b5",
    fontFamily: "Roboto-Bold",
  },
  button: {
    width: "60%",
    backgroundColor: "#56acde",
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
});
