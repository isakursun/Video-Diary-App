import React from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useVideoStore } from "../store/videoStore";
import { Video, ResizeMode } from "expo-av";
import Header from "../components/Header";

// DetailsScreen shows the details of a selected video and allows editing or deleting it.
const DetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = useVideoStore((state) => state.videos.find((v) => v.id === id));

  if (!video) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-lg text-gray-500">Video not found.</Text>
      </View>
    );
  }

  const router = require("expo-router").useRouter();
  const { removeVideo } =
    require("../store/videoStore").useVideoStore.getState();
  // Deletes the current video and navigates back to the home screen.
  const handleDelete = () => {
    removeVideo(video.id);
    router.push("/");
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-8">
      <Header title="Video Details" />
      <View className="flex-1 items-center justify-center w-full">
        <View className="w-full max-w-xs mb-6 rounded-xl overflow-hidden bg-black">
          <Video
            source={{ uri: video.uri }}
            style={{ width: 320, height: 180 }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
          />
        </View>
        <Text className="text-2xl font-bold mb-2 text-gray-800 text-center">
          {video.name}
        </Text>
        <Text className="text-gray-500 mb-6 text-center">
          {video.description}
        </Text>
        <View className="items-center justify-center mt-4 w-full">
          <Pressable
            onPress={() => router.push(`/edit?id=${video.id}`)}
            className="w-48 bg-white  py-3 rounded-xl items-center shadow mb-4 flex-row justify-center border-[1px] border-[#05B8A2]"
            style={{ elevation: 2 }}
          >
            <Text className="text-[#05B8A2] text-lg mr-2">✏️</Text>
            <Text className="text-[#05B8A2] font-bold text-base tracking-wide">
              Edit
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            className="w-48 bg-red-500 py-3 rounded-xl items-center shadow mb-4 flex-row justify-center"
            style={{ elevation: 2 }}
          >
            <Text className="text-white text-lg mr-2">❌</Text>
            <Text className="text-white font-bold text-base tracking-wide">
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default DetailsScreen;
