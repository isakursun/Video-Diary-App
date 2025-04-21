import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoStore } from "../store/videoStore";
import Header from "../components/Header";

// EditScreen lets users update the name and description of an existing video.
const EditScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const video = useVideoStore((state) => state.videos.find((v) => v.id === id));
  const updateVideo = useVideoStore((state) => state.updateVideo);

  if (!video) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-lg text-gray-500">Video not found.</Text>
      </View>
    );
  }

  const [name, setName] = useState(video.name);
  const [description, setDescription] = useState(video.description);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Saves the updated video information to the store.
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Video adı boş olamaz.");
      return;
    }
    if (!description.trim()) {
      setError("Description cannot be empty.");
      return;
    }
    setError("");
    setLoading(true);
    updateVideo(video.id, { name, description });
    setLoading(false);
    router.push("/details?id=" + video.id);
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-8 items-center">
      <Header title="Edit Video" />
      <Text className="text-2xl font-bold mb-6 text-gray-800">Edit Video</Text> 
      <View className="w-full max-w-xs mb-4">
        <Text className="mb-1 text-gray-700">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
          placeholder="Enter video name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError("");
          }}
        />
      </View>
      <View className="w-full max-w-xs mb-6">
        <Text className="mb-1 text-gray-700">Description</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
          placeholder="Enter description"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (error) setError("");
          }}
          multiline
          numberOfLines={3}
        />
      </View>
      {error ? (
        <Text className="text-red-500 mb-2 text-sm">{error}</Text>
      ) : null}
      <Pressable
        className="bg-[#05B8A2] w-48 h-14 rounded-xl px-6 py-3 flex-row justify-center items-center"
        onPress={handleSave}
        disabled={loading}
      >
        <Text className="text-white font-semibold">
          {loading ? "Saving..." : "Save"}
        </Text>
      </Pressable>
    </View>
  );
};

export default EditScreen;
