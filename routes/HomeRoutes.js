import React from "react";
import { HomeStack } from "./HomeStack";
import Dashboard from "../src/home/dashboard/Dashboard";
import DrowsinessDetection from "../src/home/drowsiness_detection/DrowsinessDetection";
import ContactUs from "../src/home/contact/ContactUs";

export const HomeRoutes = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <HomeStack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="drowsinessDetection"
        component={DrowsinessDetection}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="contactUs"
        component={ContactUs}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};
