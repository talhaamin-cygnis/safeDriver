import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  ToastAndroid,
} from "react-native";
import COLORS, { grayShades, primaryShades } from "../../config/color";
import {
  collection,
  addDoc,
  getFirestore,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const navigation = useNavigation();
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
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

  const updateUserId = async (userId, newUser) => {
    try {
      let db = getFirestore();
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        id: userId,
      });
      newUser.id = userId;
      storeData(newUser);
      setLoading(false);
      navigateToHome();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSignUp = async () => {
    if (fullname === "") {
      ToastAndroid.show("Please provide full name", ToastAndroid.SHORT);
      return;
    } else if (email === "") {
      ToastAndroid.show("Please provide email address", ToastAndroid.SHORT);
      return;
    } else if (contactNumber === "") {
      ToastAndroid.show("Please provide contact number", ToastAndroid.SHORT);
      return;
    } else if (password === "") {
      ToastAndroid.show("Please provide password", ToastAndroid.SHORT);
      return;
    } else {
      try {
        setLoading(true);
        let db = getFirestore();
        let newUser = {
          id: "0",
          contact_number: contactNumber,
          email: email,
          full_name: fullname,
          password: password,
          roleType: 2,
        };
        const docRef = await addDoc(collection(db, "users"), newUser);
        updateUserId(docRef.id, newUser);
      } catch (e) {
        setLoading(false);
        console.error("Error adding document: ", e);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flexContainer}>
      <ScrollView
        style={styles.flexContainer}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={styles.scrollView}
      >
        <View style={styles.flexContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <View style={styles.fieldContainer}>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/user.png")}
                style={styles.leftImage}
              />
              <TextInput
                placeholder="Please type your full name"
                style={styles.field}
                placeholderTextColor={grayShades.classicGray[500]}
                value={fullname}
                onChangeText={(value) => setFullName(value)}
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/email.png")}
                style={styles.leftImage}
              />
              <TextInput
                placeholder="Please type your email address"
                style={styles.field}
                placeholderTextColor={grayShades.classicGray[500]}
                value={email}
                onChangeText={(value) => setEmail(value)}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/phone-call.png")}
                style={styles.leftImage}
              />
              <TextInput
                placeholder="Please type your contact number"
                style={styles.field}
                placeholderTextColor={grayShades.classicGray[500]}
                value={contactNumber}
                onChangeText={(value) => setContactNumber(value)}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/lock.png")}
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
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              {loading ? (
                <ActivityIndicator
                  animating={true}
                  size={"small"}
                  color={COLORS.white}
                />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  logo: {
    alignSelf: "center",
    height: 150,
    width: 300,
    marginTop: 20,
  },
  scrollView: {
    paddingHorizontal: 24,
  },
  textInputView: {
    backgroundColor: COLORS.grey2,
    height: 45,
    borderRadius: 6,
    width: Dimensions.get("window").width - 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  fieldContainer: {
    marginTop: 18,
    alignSelf: "center",
  },
  leftImage: {
    height: 20,
    width: 20,
  },
  field: {
    height: 45,
    width: "100%",
    marginLeft: 5,
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
});
