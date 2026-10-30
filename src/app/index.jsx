import { Text, TextInput, Button, Alert, View, StyleSheet, Platform } from "react-native";
import React, { useState } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Index(){
  const [texto, setDuvida] = useState('');

  const mostrarMensagem = (titulo, mensagem) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const enviarDuvida = async () => {
    if (!texto.trim()) {
      mostrarMensagem("Aviso", "Por favor, digite uma dúvida.");
      return;
    }

    try {
      console.log("A enviar para o servidor:", texto);
    const response = await fetch('http://localhost:8090/duvida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto }),
      });

      console.log("Resposta do servidor status:", response.status);

      if (response.ok) {
        mostrarMensagem("Sucesso", "A sua dúvida chegou ao servidor com sucesso!");
        
        // Notificação local (funciona nativamente em mobile, na web pode ser ignorada)
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "DuvidasApp",
              body: "A sua dúvida chegou ao servidor com sucesso!",
            },
            trigger: null,
          });
        } catch (notifError) {
          console.log("Notificação ignorada na web:", notifError);
        }

        setDuvida(''); 
      } else {
        mostrarMensagem("Erro", "Não foi possível enviar a dúvida.");
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
      mostrarMensagem("Erro", "Falha na ligação com o servidor. Verifique se o Spring Boot está rodando.");
    }
  };

  return(
    <View style={styles.container}>
      <Text style={styles.text}>Pomonai APP</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua dúvida..."
        placeholderTextColor="#888"
        value={texto}
        onChangeText={setDuvida}
      />
      <Button
        title="Enviar"
        onPress={enviarDuvida}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b132b' },
  text: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', borderWidth: 1, borderColor: '#4cc9f0', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 15 },
});