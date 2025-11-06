import React, { useState, useEffect } from "react";
import dynamoDB from "../../awsConfig";
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
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

//  NÃO USE CREDENCIAIS DIRETAMENTE EM PRODUÇÃO!
const AWS_ACCESS_KEY_ID = "ASIA47CRZHOB4QGKYHVS";
const AWS_SECRET_ACCESS_KEY = "6r4edg8xAKfA9+8/ehRgbJnTO37xvD6vwYTvDcrz";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjENv//////////wEaCXVzLXdlc3QtMiJGMEQCIGoVOyT8LsG6BkLQqkVJPtFsywonLPkTJh7NLDQC6hvwAiAUde8FZjiLtTC5EwjfQa9B4HZzekIXDo4vFuSFslLSXyrLAgik//////////8BEAAaDDg5MTM3NzIzNjg2NyIMyLoV3FBanm4GbDWQKp8CLC+3Mz4KGuDr97Rb7ga2fKJU1YdVQ+mmtR+gqQ+HtcDvoG77mGqVqepWGNLe2FSAcogL1rW0NSBJ+zwg5WB355qDAht8ALt5/2k31rP83C2klG50yN9/7siwDALLFifY05mCc1nZ7I6cEe218iVQNGrhcod7d/lkXsWOumJvAtjZNbMIJ2sqOhUofVYZ9L2YZa+YgbjfRhgAoQD0s7mwLBH5E6Op8G+J1Xek9kViTY8Fs7c+N61PJ9i5eaACcNXOfmhHNEkMjMxBtyijAhQjEm6D5gtmy8CDwK14gskJ5ybPDfKVy960QZUXMyiFMfoki7K1H8HOFqIQ52HGAdEXP3MQ97tCj4dGCXxA8Z3iXLnaQnE+yXZyBvdlLkXp5B0wmYGyyAY6ngFQ0vAdQb1EVqn5zWtzezLgDKTPTkzaYZO9jXyseqRtpvjV8d+v36WOu/bgGbSkW+xJfaKdguVyEVkMvEusecjUdldrvz/mylueu3goezUQKLbyU1YygLv8zNvDtPxhm9Qe4kDX3/BYoXFA4qjUP09qdff67UOqj0J5mD+N1C+LwDs3pa9uhY252H3lwa0W/KpJlMRjHlDTPPfVAd6IRQ==";

const REGION = "us-east-1";

const TABELA_TURMAS = "Turmas";

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [novoNome, setNovoNome] = useState("");

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: AWS_SESSION_TOKEN,
    },
  });

 
  const db = DynamoDBDocumentClient.from(client);

  const listarTurmas = async () => {
    try {
      setLoading(true);
      const data = await db.send(new ScanCommand({ TableName: TABELA_TURMAS }));
      setTurmas(data.Items || []);
    } catch (error) {
      Alert.alert("Erro", `Falha ao carregar turmas: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarTurmas();
  }, []);

  const adicionarTurma = async () => {
    if (!novaTurma.trim()) {
      Alert.alert("Aviso", "Digite o nome da turma.");
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
      await db.send(new PutCommand({ TableName: TABELA_TURMAS, Item: nova }));
      setTurmas((prev) => [...prev, nova]);
      setNovaTurma("");
      setModalVisible(false);
      Alert.alert("Sucesso", "Turma cadastrada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", `Falha ao cadastrar turma: ${error}`);
    }
  };

  const salvarEdicao = async () => {
    if (!novoNome.trim()) {
      Alert.alert("Aviso", "Digite o novo nome.");
      return;
    }

    try {
      const turmaAtualizada = {
        ...turmaSelecionada,
        nome: novoNome.trim(),
      };

      await db.send(
        new PutCommand({ TableName: TABELA_TURMAS, Item: turmaAtualizada })
      );
      setTurmas((prev) =>
        prev.map((t) =>
          t["pk-turma"] === turmaSelecionada["pk-turma"]
            ? turmaAtualizada
            : t
        )
      );
      setModalEditarVisible(false);
      Alert.alert("Sucesso", "Turma atualizada!");
    } catch (error) {
      Alert.alert("Erro", `Falha ao atualizar turma: ${error}`);
    }
  };

  const excluirTurma = (pk, sk) => {
    Alert.alert("Excluir", "Deseja realmente excluir esta turma?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await db.send(
              new DeleteCommand({
                TableName: TABELA_TURMAS,
                Key: { "pk-turma": pk, "sk-turma": sk },
              })
            );
            setTurmas((prev) =>
              prev.filter((t) => t["pk-turma"] !== pk || t["sk-turma"] !== sk)
            );
            Alert.alert("Sucesso", "Turma excluída!");
          } catch (error) {
            Alert.alert("Erro", `Falha ao excluir turma: ${error}`);
          }
        },
      },
    ]);
  };

  return (
  <ScrollView contentContainerStyle={styles.scrollContent}>
    {/* ✅ Modal de NOVA turma */}
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Nova Turma</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nome da turma"
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

    {/* ✅ Modal de EDITAR turma */}
    <Modal visible={modalEditarVisible} animationType="slide" transparent>
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
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/turma-logo.png")} />
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Turmas</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={50} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : turmas.length === 0 ? (
          <Text style={styles.noActivities}>Nenhuma turma cadastrada.</Text>
        ) : (
          turmas.map((item) => (
            <View key={item["pk-turma"]} style={styles.card}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => {
                    setTurmaSelecionada(item);
                    setNovoNome(item.nome);
                    setModalEditarVisible(true); // ✅ Abre o modal de edição
                  }}
                >
                  <Ionicons name="eye-outline" size={26} color="#2d73b5" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    excluirTurma(item["pk-turma"], item["sk-turma"])
                  }
                >
                  <Ionicons name="trash-outline" size={26} color="#b52d2d" />
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
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
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
  },
  cardActions: { flexDirection: "row", gap: 10 },
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
