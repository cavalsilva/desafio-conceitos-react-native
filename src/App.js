import React, { useEffect, useState } from "react";
import api from "./services/api";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const[repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);  

  async function handleLikeRepository(id) {
    await api.post(`repositories/${id}/like`);

    const indexId = repositories.findIndex(item => item.id === id)

    const repositoriesAux = repositories.map(item => item)

    repositoriesAux[indexId].likes += 1;

    setRepositories(repositoriesAux)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={item =>  item.id}
          renderItem={({ item, index })=> (
            <View key={index} style={styles.repositoryContainer}>
              <Text style={styles.repository}>{item.title}</Text>
              {
                item.techs.map(tech => (
                  <View style={styles.techsContainer}>
                    <Text style={styles.tech}>
                      {tech}
                    </Text>
                  </View>
                ))
              }

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${item.id}`}
                >
                {item.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(item.id)}
                testID={`like-button-${item.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item =>  item.id}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
