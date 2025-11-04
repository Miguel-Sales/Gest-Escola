import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// === CREDENCIAIS AWS ===
const AWS_ACCESS_KEY_ID = "ASIA47CRZHOBRSSE4LHQ";
const AWS_SECRET_ACCESS_KEY = "W57/6pX8OJPSFE8g/e7ikzCNYdC9p2BQdrGH7X47";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjELL//////////wEaCXVzLXdlc3QtMiJIMEYCIQCfVeNdI31OCl2+umzJtvOb7tNfggZ+HUyuCrvbuRXpOQIhAOsovyT632oQUjr6K0EM9Vqxomq+EUcIFGFtAIr0vXyTKsICCHsQABoMODkxMzc3MjM2ODY3Igw84lItRhBHF/xgQjIqnwIBRB6TQPN5UEJ9ZgQrDUdyspbZ1k2E7iblFOMMn7V8jbc0eA0HXaqU94iEOAzDhnFpw/qheU/abHxRdJ+O5NNFJXp/q+BFMREIcl6EBS4mSTYmeDnK6lZHOKC5758q+rO6fi4A91zFY/V04URocdwdq9QmYueMmq/cV+9mB9jctYj1/rSIzJ/v5B+wY61TJXGBi9MhF3o4jJcUB7H6S6YFeycHRADYOOunOqcpIDG6q3rZF6U7iZ8T05HJmXXmXqjmn1S7kJZ6tT8Ewl5Kr/hBbxL5qRe6wUL5jXdPDiTaF11vboJz0b8sIWM9wZgYsfwLrjsxcfifRi0yZ1zZIZTKFRiuoz1oUYHetr/R49/XXczlIOXI4IF1H9SSBHhM/TDm/6jIBjqcAcblofBPWyQmmnEv3z/PPQx5MHJNi7+suJztDUvtriFCa2hdpXTHQ84MBByZivuMxqDI6BwS9ts0sNDxRjmARdaL6mg7RU8zJJdcKfT+OUDI2anL874yBptmJkm5Bns8VgbWfn9DUiLPICZPrAShqjD3ggXO3sRk6TFdmKADqvVxjNZ5Wa08WuRyVcZtxZpviFTjT3YQQRyPHzejXA==";
const REGION = "us-east-1";

// === NOME CORRETO DA TABELA ===
const TABELA = "Turmas";

export default function Turmas({ navigation }) {
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [novoNome, setNovoNome] = useState("");

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
      "pk-turma": `turma#${Date.now()}`,
      "sk-turma": `data#${agora}`,
      nome: novaTurma.trim(),
      criadoEm: agora,
    };

    try {
      await db.send(new PutCommand({ TableName: TABELA, Item: nova }));
      setTurmas((prev) => [...prev, nova]);
      setNovaTurma("");
      setModalVisible(false);
      Alert.alert("Sucesso", "Turma cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar turma:", error);
      Alert.alert("Erro", "Falha ao cadastrar turma.");
    }
  };

  // === EDITAR TURMA ===
  const salvarEdicao = async () => {
    if (!novoNome.trim()) {
      Alert.alert("Aviso", "Digite o novo nome da turma.");
      return;
    }

    try {
      const turmaAtualizada = {
        ...turmaSelecionada,
        nome: novoNome.trim(),
      };

      await db.send(new PutCommand({ TableName: TABELA, Item: turmaAtualizada }));

      setTurmas((prev) =>
        prev.map((t) =>
          t["pk-turma"] === turmaSelecionada["pk-turma"] ? turmaAtualizada : t
        )
      );

      setModalEditarVisible(false);
      Alert.alert("Sucesso", "Turma atualizada!");
    } catch (error) {
      console.error("Erro ao editar turma:", error);
      Alert.alert("Erro", "Falha ao atualizar turma.");
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
                Key: { "pk-turma": pk, "sk-turma": sk },
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

  // === MODAL CADASTRO ===
  const ModalCadastro = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cadastrar Nova Turma</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Digite o nome da turma"
            value={novaTurma}
            onChangeText={setNovaTurma}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#2d73b5" }]}
              onPress={adicionarTurma}
            >
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#999" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // === MODAL EDITAR / VISUALIZAR ===
  const ModalEditar = () => (
    <Modal
      visible={modalEditarVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalEditarVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Turma</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Novo nome da turma"
            value={novoNome}
            onChangeText={setNovoNome}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#2d73b5" }]}
              onPress={salvarEdicao}
            >
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#999" }]}
              onPress={() => setModalEditarVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ModalCadastro />
      <ModalEditar />
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/turma-logo.png")}
            />
          </View>

          {/* CONTEÚDO */}
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Turmas</Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add-circle" size={50} color="#fff" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : turmas.length === 0 ? (
              <Text style={styles.noActivities}>
                Nenhuma turma cadastrada ainda.
              </Text>
            ) : (
              turmas.map((item) => (
                <View key={item["sk-turma"]} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setTurmaSelecionada(item);
                        setNovoNome(item.nome);
                        setModalEditarVisible(true);
                      }}
                    >
                      <Ionicons name="eye-outline" size={26} color="#2d73b5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        excluirTurma(item["pk-turma"], item["sk-turma"])
                      }
                    >
                      <Ionicons name="trash-outline" size={26} color="#2d73b5" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          
          </View>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
  },
  logo: {
    width: 150,
    resizeMode: "contain",
    marginTop: -60,
  },
  drawer: {
    marginTop: -60,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2d73b5",
    borderTopLeftRadius: 80,
    alignItems: "center",
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  addButton: { marginVertical: 15 },
  noActivities: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    color: "#2d73b5",
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardActions: { flexDirection: "row", gap: 10 },

  // === ESTILOS DO MODAL ===
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d73b5",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
