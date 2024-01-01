import React from "react";
import SignIn from "../src/auth/signin/SignIn";
import Splash from "../src/auth/signin/Splash";
import SignUp from "../src/auth/SignUp";
import { AuthStack } from "./AuthStack";

export const AuthRoutes = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <AuthStack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="signin"
        component={SignIn}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="signup"
        component={SignUp}
        options={{
          headerTitle: "Sign Up",
        }}
      />
    </AuthStack.Navigator>
  );
};
