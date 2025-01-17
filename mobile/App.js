import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./navigators/StackNav";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </AuthProvider>
  );
}
