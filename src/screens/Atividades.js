import React, { useState, useEffect } from "react";
import dynamoDB from "../../awsConfig";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// === CREDENCIAIS AWS ===
const AWS_ACCESS_KEY_ID = "ASIA47CRZHOB4QGKYHVS";
const AWS_SECRET_ACCESS_KEY = "6r4edg8xAKfA9+8/ehRgbJnTO37xvD6vwYTvDcrz";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjENv//////////wEaCXVzLXdlc3QtMiJGMEQCIGoVOyT8LsG6BkLQqkVJPtFsywonLPkTJh7NLDQC6hvwAiAUde8FZjiLtTC5EwjfQa9B4HZzekIXDo4vFuSFslLSXyrLAgik//////////8BEAAaDDg5MTM3NzIzNjg2NyIMyLoV3FBanm4GbDWQKp8CLC+3Mz4KGuDr97Rb7ga2fKJU1YdVQ+mmtR+gqQ+HtcDvoG77mGqVqepWGNLe2FSAcogL1rW0NSBJ+zwg5WB355qDAht8ALt5/2k31rP83C2klG50yN9/7siwDALLFifY05mCc1nZ7I6cEe218iVQNGrhcod7d/lkXsWOumJvAtjZNbMIJ2sqOhUofVYZ9L2YZa+YgbjfRhgAoQD0s7mwLBH5E6Op8G+J1Xek9kViTY8Fs7c+N61PJ9i5eaACcNXOfmhHNEkMjMxBtyijAhQjEm6D5gtmy8CDwK14gskJ5ybPDfKVy960QZUXMyiFMfoki7K1H8HOFqIQ52HGAdEXP3MQ97tCj4dGCXxA8Z3iXLnaQnE+yXZyBvdlLkXp5B0wmYGyyAY6ngFQ0vAdQb1EVqn5zWtzezLgDKTPTkzaYZO9jXyseqRtpvjV8d+v36WOu/bgGbSkW+xJfaKdguVyEVkMvEusecjUdldrvz/mylueu3goezUQKLbyU1YygLv8zNvDtPxhm9Qe4kDX3/BYoXFA4qjUP09qdff67UOqj0J5mD+N1C+LwDs3pa9uhY252H3lwa0W/KpJlMRjHlDTPPfVAd6IRQ==";

const REGION = "us-east-1";

const TABELA_TURMAS = "Turmas";
const TABELA_ATIVIDADES = "Atividades";

export default function Atividades() {
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [atividades, setAtividades] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [novaAtividade, setNovaAtividade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(true);

   // === CONFIGURAÇÃO DYNAMODB ===
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
      const data = await db.send(new ScanCommand({ TableName: TABELA_TURMAS }));
      setTurmas(data.Items || []);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    }
  };

  // === LISTAR ATIVIDADES ===
  const listarAtividades = async () => {
    try {
      const data = await db.send(new ScanCommand({ TableName: TABELA_ATIVIDADES }));
      setAtividades(data.Items || []);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      Alert.alert("Erro", "Não foi possível carregar as atividades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarTurmas();
    listarAtividades();
  }, []);

  // === SALVAR ATIVIDADE ===
  const salvarAtividade = async () => {
    if (!novaAtividade.trim() || !descricao.trim() || !prazo.trim() || !turmaSelecionada) {
      Alert.alert("Aviso", "Preencha todos os campos!");
      return;
    }

    const [dia, mes, ano] = prazo.split("/").map(Number);
    const dataSelecionada = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataSelecionada < hoje) {
      Alert.alert("Aviso", "Não é possível criar atividades com datas passadas!");
      return;
    }

    const turma = turmas.find((t) => t["pk-turma"] === turmaSelecionada);
    const agora = new Date().toISOString();

    const nova = {
      "pk-atividade": editandoId ? editandoId : `atividade#${Date.now()}`,
      "sk-atividade": `data#${agora}`,
      titulo: novaAtividade,
      descricao,
      prazo,
      turmaId: turmaSelecionada,
      turmaNome: turma?.nome || "Sem nome",
      criadoEm: agora,
    };

    try {
      await db.send(new PutCommand({ TableName: TABELA_ATIVIDADES, Item: nova }));
      if (editandoId) {
        setAtividades((prev) =>
          prev.map((item) =>
            item["pk-atividade"] === editandoId ? { ...item, ...nova } : item
          )
        );
      } else {
        setAtividades((prev) => [...prev, nova]);
      }

      Alert.alert("Sucesso", "Atividade salva com sucesso!");
      setModalVisivel(false);
      setNovaAtividade("");
      setDescricao("");
      setPrazo("");
      setTurmaSelecionada("");
      setEditandoId(null);
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
      Alert.alert("Erro", "Falha ao salvar atividade.");
    }
  };

  // === EXCLUIR ===
  const excluirAtividade = (pk, sk) => {
    Alert.alert("Excluir", "Deseja realmente excluir esta atividade?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await db.send(
              new DeleteCommand({
                TableName: TABELA_ATIVIDADES,
                Key: { "pk-atividade": pk, "sk-atividade": sk },
              })
            );
            setAtividades((prev) =>
              prev.filter((a) => a["pk-atividade"] !== pk || a["sk-atividade"] !== sk)
            );
            Alert.alert("Sucesso", "Atividade excluída!");
          } catch (error) {
            console.error("Erro ao excluir:", error);
            Alert.alert("Erro", "Falha ao excluir atividade.");
          }
        },
      },
    ]);
  };

  // === EDITAR ===
  const editarAtividade = (item) => {
    setEditandoId(item["pk-atividade"]);
    setNovaAtividade(item.titulo);
    setDescricao(item.descricao);
    setPrazo(item.prazo);
    setTurmaSelecionada(item.turmaId);
    setModalVisivel(true);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../assets/turma-logo.png")} />
        </View>

        {/* CONTEÚDO */}
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Atividades</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditandoId(null);
                setNovaAtividade("");
                setDescricao("");
                setPrazo("");
                setTurmaSelecionada("");
                setModalVisivel(true);
              }}
            >
              <Ionicons name="add-circle" size={50} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : atividades.length === 0 ? (
            <Text style={styles.noActivities}>Nenhuma atividade cadastrada.</Text>
          ) : (
            <View style={styles.cardsContainer}>
              {atividades.map((item) => (
                <View key={item["pk-atividade"]} style={styles.card}>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{item.titulo}</Text>
                    <Text style={styles.cardDesc}>{item.descricao}</Text>
                    <Text style={styles.cardPrazo}>Prazo: {item.prazo}</Text>
                    <Text style={styles.cardTurma}>Turma: {item.turmaNome}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => editarAtividade(item)}>
                      <Ionicons name="eye-outline" size={24} color="#2d73b5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        excluirAtividade(item["pk-atividade"], item["sk-atividade"])
                      }
                    >
                      <Ionicons name="trash-outline" size={24} color="#b52d2d" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editandoId ? "Editar Atividade" : "Nova Atividade"}
            </Text>

            <TextInput
              placeholder="Título da atividade"
              value={novaAtividade}
              onChangeText={setNovaAtividade}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.modalInput}
              multiline
            />

            <TouchableOpacity style={styles.modalInput} onPress={() => setMostrarDatePicker(true)}>
              <Text style={{ color: prazo ? "#333" : "#666", fontSize: 16 }}>
                {prazo ? prazo : "Prazo (toque para escolher)"}
              </Text>
            </TouchableOpacity>

            {mostrarDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setMostrarDatePicker(false);
                  if (selectedDate) {
                    const dia = selectedDate.getDate().toString().padStart(2, "0");
                    const mes = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
                    const ano = selectedDate.getFullYear();
                    setPrazo(`${dia}/${mes}/${ano}`);
                  }
                }}
              />
            )}

            <View style={styles.modalInput}>
              <Picker
                selectedValue={turmaSelecionada}
                onValueChange={(value) => setTurmaSelecionada(value)}
              >
                <Picker.Item label="Selecione uma turma" value="" />
                {turmas.map((t) => (
                  <Picker.Item key={t["pk-turma"]} label={t.nome} value={t["pk-turma"]} />
                ))}
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#2d73b5" }]}
                onPress={salvarAtividade}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#000" }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60 },
  logo: { width: 150, resizeMode: "contain", marginTop: -60 },
  logoContainer: { justifyContent: "center", alignItems: "center" },
  content: {
    width: "100%",
    height:"1000%",
    backgroundColor: "#2d73b5",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 0,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    alignItems: "center",
    marginBottom: 20,
  },
  addButton: { marginTop: 10 },
  noActivities: { color: "#fff", fontSize: 16, marginTop: 20 },
  cardsContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardText: { marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#2d73b5", marginBottom: 6 },
  cardDesc: { fontSize: 15, color: "#333", marginBottom: 4 },
  cardPrazo: { fontSize: 14, color: "#555", fontStyle: "italic", marginBottom: 2 },
  cardTurma: { fontSize: 14, color: "#777" },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d73b5",
    textAlign: "center",
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  modalButton: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
