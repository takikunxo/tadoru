import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const imageWidth = (width - 60) / 2;

export default function PosesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const poses = [
    {
      id: 1,
      title: 'ポーズ 1',
      image: require('@/assets/poses/poses (1).png'),
    },
    {
      id: 2,
      title: 'ポーズ 2', 
      image: require('@/assets/poses/poses (2).png'),
    },
    {
      id: 3,
      title: 'ポーズ 3',
      image: require('@/assets/poses/poses (3).png'),
    },
    {
      id: 4,
      title: 'ポーズ 4',
      image: require('@/assets/poses/poses (4).png'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>ポーズ集</Text>
        <Text style={styles.subtitle}>参考にしたいポーズを選んでね</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {poses.map((pose) => (
            <TouchableOpacity key={pose.id} style={[styles.poseCard, { backgroundColor: colors.background }]}>
              <Image source={pose.image} style={styles.poseImage} />
              <Text style={[styles.poseTitle, { color: colors.text }]}>{pose.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  poseCard: {
    width: imageWidth,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  poseImage: {
    width: '100%',
    height: imageWidth * 1.3,
    resizeMode: 'cover',
    backgroundColor: '#e9ecef',
  },
  poseTitle: {
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});