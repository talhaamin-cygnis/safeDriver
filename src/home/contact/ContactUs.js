import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import COLORS, { grayShades, primaryShades } from "../../../config/color";
import { useNavigation } from "@react-navigation/native";
import useFirestoreCalls from "../../../hooks/useFirestoreCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ContactUs = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const { submitContactMessage, loading } = useFirestoreCalls();

  const onBackPressed = () => {
    navigation.goBack();
  };

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("loggedInUser");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    let user = await getUserData();
    setEmail(user.email);
    setContactNumber(user.contact_number);
    setName(user.full_name);
  };

  const handleContact = () => {
    let newMessage = {
      id: "0",
      email: email,
      contactNumber: contactNumber,
      message: message,
      name: name,
    };
    submitContactMessage(newMessage).then((status) => {
      if (status) {
        ToastAndroid.show(
          "We have received your message, and the administrator will be in touch with you soon.",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          "Something went wrong while submitting your request",
          ToastAndroid.SHORT
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/images/contact-bg.jpg")}
          style={styles.image}
        />
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBackPressed}>
            <Image source={require("../../../assets/images/back-arrow.png")} />
          </TouchableOpacity>
          <Text style={styles.contactMessage}>Contact Us</Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
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
            source={require("../../../assets/images/phone-call.png")}
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
        <View style={styles.messageView}>
          <TextInput
            placeholder="Please type your messags"
            style={styles.messagefield}
            placeholderTextColor={grayShades.classicGray[500]}
            value={message}
            onChangeText={(value) => setMessage(value)}
            multiline={true}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleContact}>
          {loading ? (
            <ActivityIndicator
              animating={true}
              size={"small"}
              color={COLORS.white}
            />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
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
  field: {
    height: 45,
    width: "100%",
    marginLeft: 5,
  },
  imageContainer: {
    height: 150,
    width: "100%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: "hidden",
  },
  image: {
    height: 150,
  },
  contactMessage: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "600",
    top: 10,
  },
  backButton: {
    left: 30,
    top: 75,
    position: "absolute",
  },
  topContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  messageView: {
    backgroundColor: COLORS.grey2,
    height: 150,
    borderRadius: 6,
    width: Dimensions.get("window").width - 40,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  messagefield: {
    width: "100%",
    marginLeft: 5,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    width: Dimensions.get("window").width - 40,
    height: 50,
    backgroundColor: primaryShades.blue[900],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
