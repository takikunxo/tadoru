import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SignOutButton } from "../component/SignOutButton";

export default function Page() {
  const { user } = useUser();

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Link href="../(tabs)" asChild>
          <Text>Tab画面へ</Text>
        </Link>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="../(auth)/sign-in" asChild>
          <Text>Sign in</Text>
        </Link>
        <Link href="../(auth)/sign-up" asChild>
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
