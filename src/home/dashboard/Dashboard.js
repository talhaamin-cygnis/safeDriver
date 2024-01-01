import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import COLORS, { primaryShades } from "../../../config/color";
import { useNavigation } from "@react-navigation/native";
import useFirestoreCalls from "../../../hooks/useFirestoreCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const Dashboard = () => {
  const navigation = useNavigation();
  const { fetchUserRides, userRides, loading } = useFirestoreCalls();
  const [user, setUser] = useState(null);
  const isFocused = useIsFocused();

  const navigateToDetectionScreen = () => {
    navigation.navigate("drowsinessDetection");
  };

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("loggedInUser");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const fetchRides = async () => {
    let user = await getUserData();
    setUser(user);
    fetchUserRides(user.id);
  };

  useEffect(() => {
    fetchRides();
  }, [isFocused]);

  const navigateToContact = () => {
    navigation.navigate("contactUs");
  };

  const renderInfo = (key, value) => {
    return (
      <View style={styles.info}>
        <Text style={styles.infoTextValue}>{value}</Text>
        <Text style={styles.infoTextHeading}>{key}</Text>
      </View>
    );
  };

  const getInidentsCount = (userRides) => {
    let result = 0;
    userRides.map((item) => {
      result += item.incidents?.length;
    });
    return result;
  };

  const hasData = () => {
    return userRides && userRides.length > 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.welcome}>Welcome</Text>
        {user !== null && <Text style={styles.username}>{user.full_name}</Text>}

        <View style={styles.infoContainer}>
          {renderInfo(
            "Total Rides",
            hasData() ? userRides.length.toString() : "0"
          )}
          {renderInfo(
            "Total incidents",
            hasData() ? getInidentsCount(userRides).toString() : "0"
          )}
          {renderInfo(
            "Incident ratio",
            hasData()
              ? `${(
                  (userRides.length.toString() /
                    getInidentsCount(userRides).toString()) *
                  100
                ).toFixed(2)}%`
              : "0%"
          )}
        </View>
      </View>
      <View style={styles.midContainer}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Your Past Trips</Text>
          {!loading && userRides && userRides.length > 0 ? (
            userRides.map((ride) => {
              return (
                <View style={styles.rideContainer}>
                  <Image
                    source={require("../../../assets/images/riding-car.png")}
                  />
                  <View>
                    <Text style={styles.rideText}>{ride.created_at}</Text>
                    <Text style={styles.rideText}>
                      Reported Incidents: {ride.incidents.length}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <ActivityIndicator
              animating={loading}
              color={primaryShades.blue[900]}
              size={"large"}
              style={styles.loaderContainer}
            />
          )}
          {!loading && userRides?.length === 0 && (
            <View style={styles.noRecordFoundView}>
              <Text style={styles.noRecordText}>No record found!</Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.contactContainer}
          onPress={navigateToContact}
        >
          <Image source={require("../../../assets/images/contact-mail.png")} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToDetectionScreen}
        >
          <Text style={styles.buttonText}>Start a ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: COLORS.headerBlue,
    height: 200,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  welcome: {
    color: COLORS.white,
    alignSelf: "center",
    marginTop: 50,
    fontSize: 20,
    fontWeight: "600",
  },
  midContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  bottomContainer: {
    width: "100%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    backgroundColor: COLORS.white,
  },
  button: {
    width: Dimensions.get("window").width - 40,
    height: 50,
    backgroundColor: primaryShades.blue[900],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    alignSelf: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  heading: {
    fontSize: 17,
    fontWeight: "600",
  },
  rideContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: primaryShades.blue[900],
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rideText: {
    color: COLORS.white,
    marginLeft: 10,
  },
  username: {
    color: COLORS.white,
    alignSelf: "center",
    marginTop: 16,
    fontSize: 17,
    fontWeight: "600",
  },
  info: {
    alignItems: "center",
  },
  infoContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  infoTextHeading: {
    color: COLORS.white,
    fontSize: 12,
  },
  infoTextValue: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 18,
  },
  noRecordFoundView: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  noRecordText: {
    fontWeight: "700",
    fontSize: 20,
  },
  contactContainer: {
    height: 50,
    width: 50,
    position: "absolute",
    backgroundColor: primaryShades.blue[500],
    bottom: 50,
    right: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
