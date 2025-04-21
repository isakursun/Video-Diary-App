import "../global.css";
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import VideoCard from "../components/VideoCard";
import { useVideoStore } from "../store/videoStore"; // zustand store import
import Header from "../components/Header";

const HomeScreen = () => {
  const router = useRouter();
  const videos = useVideoStore((state) => state.videos);

  if (videos.length === 0) {
    return (
      <View className="flex-1 bg-white px-4 pt-8">
        <Header title="My Video Diary" showBackButton={false} />
        <View className="flex-1 justify-center items-center">
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🎥</Text>
          <Text className="text-gray-400 text-lg mb-2">No videos yet</Text>
          <Text className="text-gray-500 mb-6 text-center">
            Start recording your memories by adding a video!
          </Text>
          <Pressable
            className="bg-[#05B8A2] rounded-full px-8 py-4 flex-row items-center shadow-lg"
            style={{ elevation: 4 }}
            onPress={() => router.push("/crop")}
          >
            <Text style={{ fontSize: 22, marginRight: 8 }}>➕</Text>
            <Text className="text-white font-semibold text-base">
              Add Video
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-8">
      <Header title="My Video Diary" showBackButton={false} />
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-[#05B8A2] ">
          Cropped Videos
        </Text>
        <Pressable
          className="bg-[#05B8A2] rounded-full px-6 py-3 flex-row items-center shadow-lg"
          style={{ elevation: 4 }}
          onPress={() => router.push("/crop")}
        >
          <Text className="text-white font-bold text-lg">Crop</Text>
        </Pressable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 18, paddingBottom: 24 }}
      >
        {videos.map((video) => (
          <View
            key={video.id}
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              borderRadius: 18,
              backgroundColor: "#fff",
              marginBottom: 0,
            }}
          >
            <VideoCard {...video} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
