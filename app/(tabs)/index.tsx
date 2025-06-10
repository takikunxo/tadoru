import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    const setupPermissions = async () => {
      try {
        // カメラのパーミッションを先に確認
        if (!permission?.granted) {
          const cameraResult = await requestPermission();
          if (!cameraResult.granted) {
            return; // カメラのパーミッションが拒否された場合は終了
          }
        }

        // カメラのパーミッションが許可された後にメディアライブラリのパーミッションを確認
        if (!mediaLibraryPermission?.granted) {
          await requestMediaLibraryPermission();
        }
      } catch (error) {
        console.error("Permission setup failed:", error);
        Alert.alert("エラー", "カメラの設定に失敗しました");
      }
    };

    setupPermissions();
  }, []); // 依存配列を空にして初回のみ実行

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラの初期化中...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラの使用許可が必要です</Text>
      </View>
    );
  }

  if (!mediaLibraryPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>写真の保存に必要な許可が必要です</Text>
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          Alert.alert("写真撮影完了", "写真がアルバムに保存されました");
        }
      } catch (error) {
        Alert.alert("エラー", "写真の撮影または保存に失敗しました");
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          zoom={0}
        />
        <View style={styles.gridOverlay}>
          <View style={[styles.gridLine, { left: "33.33%" }]} />
          <View style={[styles.gridLine, { left: "66.66%" }]} />
          <View
            style={[
              styles.gridLine,
              styles.gridLineHorizontal,
              { top: "33.33%" },
            ]}
          />
          <View
            style={[
              styles.gridLine,
              styles.gridLineHorizontal,
              { top: "66.66%" },
            ]}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.text}>撮影</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cameraHeight = (width * 16) / 9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    color: "#fff",
  },
  cameraContainer: {
    width: width,
    height: cameraHeight,
    alignSelf: "center",
    position: "absolute",
    bottom: 80,
  },
  camera: {
    flex: 1,
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 1,
    height: "100%",
  },
  gridLineHorizontal: {
    width: "100%",
    height: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  captureButton: {
    alignItems: "center",
    backgroundColor: "#ff0000",
    padding: 20,
    borderRadius: 50,
    width: 80,
    height: 80,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
