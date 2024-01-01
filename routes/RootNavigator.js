import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthRoutes } from "./AuthRoutes";
import { HomeRoutes } from "./HomeRoutes";

const AppStack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppStack.Navigator
          initialRouteName="AuthRoutes"
          screenOptions={{ headerShown: false }}
        >
          <AppStack.Screen name="AuthRoutes" component={AuthRoutes} />
          <AppStack.Screen name="HomeRoutes" component={HomeRoutes} />
        </AppStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
