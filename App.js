import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./routes/RootNavigator";
import "./config/firebaseConfig";

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
