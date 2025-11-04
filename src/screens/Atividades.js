import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Atividades({ navigation }) {
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [atividades, setAtividades] = useState([]);
  const [novaAtividade, setNovaAtividade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  // Função principal para criar ou editar
  const salvarAtividade = () => {
    if (!novaAtividade.trim() || !descricao.trim() || !prazo.trim()) {
      Alert.alert("Aviso", "Preencha todos os campos!");
      return;
    }

    // Impede datas passadas
    const [dia, mes, ano] = prazo.split("/").map(Number);
    const dataSelecionada = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataSelecionada < hoje) {
      Alert.alert("Aviso", "Não é possível criar atividades com datas passadas!");
      return;
    }

    // Atualiza se estiver editando
    if (editandoId) {
      setAtividades((prev) =>
        prev.map((item) =>
          item.id === editandoId
            ? { ...item, titulo: novaAtividade, descricao, prazo }
            : item
        )
      );
      setEditandoId(null);
    } else {
      // Cria nova atividade
      const nova = {
        id: Date.now().toString(),
        titulo: novaAtividade,
        descricao,
        prazo,
      };
      setAtividades([...atividades, nova]);
    }

    // Limpa e fecha modal
    setNovaAtividade("");
    setDescricao("");
    setPrazo("");
    setModalVisivel(false);
  };

  const excluirAtividade = (id) => {
    Alert.alert("Excluir atividade", "Deseja realmente excluir esta atividade?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => setAtividades(atividades.filter((item) => item.id !== id)),
      },
    ]);
  };

  // Abre modal com dados do item clicado
  const editarAtividade = (item) => {
    setEditandoId(item.id);
    setNovaAtividade(item.titulo);
    setDescricao(item.descricao);
    setPrazo(item.prazo);
    setModalVisivel(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2d73b5" }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.logoContainer}>
            <TouchableOpacity style={styles.drawer} onPress={() => navigation.openDrawer?.()}>
              <Ionicons name="menu" size={50} color="#2d73b5" />
            </TouchableOpacity>
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
                  setModalVisivel(true);
                }}
              >
                <Ionicons name="add-circle" size={50} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* LISTA DE ATIVIDADES */}
            <View style={styles.listContainer}>
              {atividades.length === 0 ? (
                <Text style={styles.noActivities}>Nenhuma atividade adicionada ainda.</Text>
              ) : (
                atividades.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.titulo}</Text>
                        <Text style={styles.cardDesc}>{item.descricao}</Text>
                        <Text style={styles.cardPrazo}>Prazo: {item.prazo}</Text>
                      </View>
                      <View style={styles.cardActions}>
                        <TouchableOpacity onPress={() => editarAtividade(item)}>
                          <Ionicons name="create-outline" size={26} color="#2d73b5" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => excluirAtividade(item.id)}>
                          <Ionicons name="trash-outline" size={26} color="#2d73b5" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>

        {/* MODAL CRIAÇÃO / EDIÇÃO */}
        <Modal visible={modalVisivel} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {editandoId ? "Editar Atividade" : "Nova Atividade"}
              </Text>

              <TextInput
                placeholder="Título da atividade"
                placeholderTextColor="#666"
                value={novaAtividade}
                onChangeText={setNovaAtividade}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Descrição"
                placeholderTextColor="#666"
                value={descricao}
                onChangeText={setDescricao}
                style={styles.modalInput}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
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

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#2d73b5" }]}
                  onPress={salvarAtividade}
                >
                  <Text style={styles.modalButtonText}>
                    {editandoId ? "Salvar" : "Salvar"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                  onPress={() => {
                    setModalVisivel(false);
                    setEditandoId(null);
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: "#000" }]}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  addButton: {
    marginVertical: 15,
  },
  listContainer: {
    width: "90%",
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    color: "#2d73b5",
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  cardPrazo: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
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
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
