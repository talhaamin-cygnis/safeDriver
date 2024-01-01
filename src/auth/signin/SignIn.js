import {
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
} from "react-native";
import COLORS, { grayShades, primaryShades } from "../../../config/color";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("talha+2@test.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);

  const navigateToHome = () => {
    navigation.navigate("HomeRoutes");
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("loggedInUser", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate("signup");
  };

  const handleSignIn = async () => {
    setLoading(true);
    let count = 0;
    let db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.data().email === email && doc.data().password === password) {
        count += 1;
        setLoading(false);
        storeData(doc.data());
        ToastAndroid.show("Logged in successfully!", ToastAndroid.SHORT);
        navigateToHome();
      }
    });
    if (count === 0) {
      setLoading(false);
      ToastAndroid.show("Invalid credentials!", ToastAndroid.SHORT);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={"handled"}>
        <View style={styles.container}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Image
            source={require("../../../assets/images/splash-bg.jpeg")}
            style={styles.image}
          />
          <View style={styles.fieldContainer}>
            <View style={styles.textInputView}>
              <Image
                source={require("../../../assets/images/email.png")}
                style={styles.leftImage}
              />
              <TextInput
                placeholder="Enter email address"
                style={styles.field}
                placeholderTextColor={grayShades.classicGray[500]}
                value={email}
                onChangeText={(value) => setEmail(value)}
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                source={require("../../../assets/images/lock.png")}
                style={styles.leftImage}
              />
              <TextInput
                placeholder="Enter password"
                style={styles.field}
                placeholderTextColor={grayShades.classicGray[500]}
                value={password}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              {loading ? (
                <ActivityIndicator
                  animating={true}
                  size={"small"}
                  color={COLORS.white}
                />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            <View style={styles.bottomView}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text style={styles.signup}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    alignSelf: "center",
    height: 150,
    width: 300,
    marginTop: 50,
  },
  image: {
    width: "100%",
    height: 300,
    borderBottomRightRadius: 65,
  },
  subtitle: {
    alignSelf: "center",
    marginTop: 30,
    fontSize: 17,
    fontWeight: "500",
    marginHorizontal: 40,
    textAlign: "center",
  },
  field: {
    height: 45,
    width: "100%",
    marginLeft: 5,
  },
  fieldContainer: {
    marginTop: 24,
    alignSelf: "center",
  },
  button: {
    width: Dimensions.get("window").width - 40,
    height: 50,
    backgroundColor: primaryShades.blue[900],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  textInputView: {
    backgroundColor: COLORS.grey2,
    height: 45,
    borderRadius: 6,
    width: Dimensions.get("window").width - 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  leftImage: {
    height: 20,
    width: 20,
  },
  bottomView: {
    alignSelf: "flex-end",
    flexDirection: "row",
    marginTop: 5,
  },
  signup: {
    fontWeight: "600",
  },
});
