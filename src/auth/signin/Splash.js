import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("signin");
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
      <ActivityIndicator
        animating={true}
        size={"large"}
        style={styles.loader}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    alignSelf: "center",
    marginTop: 100,
    fontWeight: "600",
  },
  loader: {
    bottom: 30,
    position: "absolute",
    alignSelf: "center",
  },
  logo: {
    alignSelf: "center",
    height: 150,
    width: 300,
  },
});
