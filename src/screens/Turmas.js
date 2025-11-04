import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// === CREDENCIAIS AWS ===
const AWS_ACCESS_KEY_ID = "ASIA47CRZHOBWINBYUJI";
const AWS_SECRET_ACCESS_KEY = "tUgq3Bm/M2xXj0BKsWbICvRP95bNEFOwy6PwjgHG";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEKz//////////wEaCXVzLXdlc3QtMiJGMEQCICsVXhcb1dvOAyyNmoDhbJm5g62WVmGoAo7GBCtsI3BeAiA+BS27HXORn8u+YRbVE2PRlo047tna8ul9wVQz3u1opSrCAgh1EAAaDDg5MTM3NzIzNjg2NyIMvqBq8P1nbb+HRtT/Kp8C3GqLkk2z4KuWu/+6oWg3QfE1yt34Ve+JjAu+BQlO0DqMcEF0mIudhMI3q6OcAHKOdWsJcJGtK/Lywb9XD5AgKpWtvonfOOicUhmkGTUTBMPcsPJH1T5anL3noNxWaBCEQ/N8Iq2KqJJlQDkLeYrBbeEskfrA1eHG8/KpQ3xicBnIXFBEX4w5R1Q/TXBz2GhEXcBUnijUJ1pTO3a9VGkGjWr9VMJ9vB7wwQX6f7cfh1X6u7cJx9dYpJYD+XbIvRCHzeaSjxSuBfsZBFbB3NgRL36ArMQxemeaFbPopz4SlMd/pmpdwujZjPmbS9bVYgRWPN9uA0SuQrcMsDzaMbVfdYqkZ8rGdpeAxyqQxDprt1zpfYEkdKBdVNhq1RaL2uAwvc6nyAY6ngHp+FGQZ4AvhRMjOOFaqTUXJDxHl3B/mv0JjKTD2l3Hc6Qym2OxADalFieU/AC9yjSH7xf05xBERKguH3M2JzG13g0FUv0Q7CanJAZSsQrIO2AEj8XDffMSi2RrIa72StifhNZfjMK406qHLbklzuD8dNmvNc8Eu0BonXAuKJBO7bgQLLAG6bQ9JGlfs3pN2W5DtKxXZMXW9cuWFlU60A==";
const REGION = "us-east-1";

// === NOME CORRETO DA TABELA ===
const TABELA = "Turmas";

export default function Turmas({ navigation }) {
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState("");
  const [loading, setLoading] = useState(true);

  // === CONFIGURAÇÃO DO DYNAMODB ===
  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: AWS_SESSION_TOKEN,
    },
  });

  const db = DynamoDBDocumentClient.from(client);

  // === LISTAR TURMAS ===
  const listarTurmas = async () => {
    try {
      setLoading(true);
      const data = await db.send(new ScanCommand({ TableName: TABELA }));
      setTurmas(data.Items || []);
    } catch (error) {
      console.error("Erro ao listar turmas:", error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarTurmas();
  }, []);

  // === ADICIONAR TURMA ===
  const adicionarTurma = async () => {
    if (!novaTurma.trim()) {
      Alert.alert("Aviso", "Digite o nome da turma antes de cadastrar.");
      return;
    }

    const agora = new Date().toISOString();
    const nova = {
      "pk-turma": `turma#${Date.now()}`, // ✅ Partition key obrigatória
      "sk-turma": `data#${agora}`, // ✅ Sort key obrigatória
      nome: novaTurma.trim(),
      criadoEm: agora,
    };

    try {
      await db.send(new PutCommand({ TableName: TABELA, Item: nova }));
      setTurmas((prev) => [...prev, nova]);
      setNovaTurma("");
      Alert.alert("Sucesso", "Turma cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar turma:", error);
      Alert.alert("Erro", "Falha ao cadastrar turma.");
    }
  };

  // === EXCLUIR TURMA ===
  const excluirTurma = (pk, sk) => {
    Alert.alert("Excluir Turma", "Deseja realmente excluir esta turma?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await db.send(
              new DeleteCommand({
                TableName: TABELA,
                Key: { "pk-turma": pk, "sk-turma": sk }, // ✅ Usa ambas as chaves
              })
            );
            setTurmas((prev) =>
              prev.filter((t) => t["pk-turma"] !== pk || t["sk-turma"] !== sk)
            );
            Alert.alert("Sucesso", "Turma excluída!");
          } catch (error) {
            console.error("Erro ao excluir turma:", error);
            Alert.alert("Erro", "Falha ao excluir turma.");
          }
        },
      },
    ]);
  };

  // === SAIR ===
  const sair = () => {
    navigation.replace("Login");
  };

  // === RENDERIZAÇÃO ===
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Bem-vindo, Professor!</Text>
        <TouchableOpacity style={styles.botaoSair} onPress={sair}>
          <Text style={styles.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome da turma"
        value={novaTurma}
        onChangeText={setNovaTurma}
      />

      <TouchableOpacity style={styles.botaoCadastrar} onPress={adicionarTurma}>
        <Text style={styles.textoBotao}>+ Cadastrar Turma</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#305F49" />
      ) : (
        <FlatList
          data={turmas}
          keyExtractor={(item) => item["sk-turma"]}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.textoTurma}>
                  ID: {item["pk-turma"]}
                </Text>
                <Text style={styles.textoTurma}>
                  Nome: {item.nome}
                </Text>
              </View>
              <View style={styles.botoes}>
                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: "#3C6E71" }]}
                  onPress={() =>
                    navigation.navigate("Atividades", { turma: item })
                  }
                >
                  <Text style={styles.textoBotao}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: "#D9534F" }]}
                  onPress={() =>
                    excluirTurma(item["pk-turma"], item["sk-turma"])
                  }
                >
                  <Text style={styles.textoBotao}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// === ESTILOS ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3ECE2", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#2C3E50" },
  botaoSair: {
    backgroundColor: "#C0392B",
    padding: 10,
    borderRadius: 8,
  },
  textoBotaoSair: { color: "#fff", fontWeight: "bold" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  botaoCadastrar: {
    backgroundColor: "#305F49",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoTurma: { fontSize: 16, color: "#2C3E50" },
  botoes: { flexDirection: "row", gap: 10 },
  botao: { padding: 10, borderRadius: 8 },
});
