import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NotFoundScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This screen doesn't exist.</Text>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Home")} // 👈 replace "Home" with your main screen
      >
        <Text style={{ color: "blue" }}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
