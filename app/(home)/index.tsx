import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Page() {
  return (
    <View>
      <Link href="../(tabs)" asChild>
        <Text>Tab画面へ</Text>
      </Link>
    </View>
  );
}
