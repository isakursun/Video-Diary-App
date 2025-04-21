import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Video, ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";
import Slider from "@react-native-community/slider";

interface CropStep {
  step: number;
  segmentStart?: number;
  segmentEnd?: number;
}

// CropScreen allows users to select a video, crop a segment, and save it to the diary.
const CropScreen = () => {
  const [step, setStep] = useState<CropStep>({ step: 1 });
  const [selectedVideo, setSelectedVideo] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [start, setStart] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = React.useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const addVideo = require("../store/videoStore").useVideoStore.getState()
    .addVideo;
  const router = require("expo-router").useRouter();
  const { v4: uuidv4 } = require("uuid");

  // Handles picking a video file from the device.
  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.assets && result.assets.length > 0) {
      setSelectedVideo(result.assets[0]);
    }
  };

  if (step.step === 1) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-2xl font-bold mb-6 text-gray-800">
          Select a Video
        </Text>
        {selectedVideo ? (
          <Text className="mb-4 text-[#05B8A2]">
            Selected: {selectedVideo.name}
          </Text>
        ) : (
          <Text className="mb-4 text-gray-500">No video selected</Text>
        )}
        <Pressable
          className="bg-[#05B8A2] rounded-xl px-6 py-3 w-48 h-14 mt-6 flex-row justify-center items-center"
          onPress={pickVideo}
        >
          <Text className="text-white font-semibold text-lg">Choose Video</Text>
        </Pressable>
        {selectedVideo && (
          <Pressable
            className="bg-white border-[1px] border-[#05B8A2] rounded-xl px-6 py-3 w-48 h-14 mt-6 flex-row justify-center items-center"
            onPress={() => setStep({ step: 2 })}
          >
            <Text className="text-[#05B8A2] font-semibold text-lg">
              Continue
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Called when the video loads to get its duration.
  const onLoad = (status: any) => {
    if (status?.durationMillis) {
      setDuration(status.durationMillis / 1000);
    }
  };

  if (step.step === 2 && selectedVideo) {
    const sliderMax = duration > 5 ? duration - 5 : 0;

    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-2xl font-bold mb-4 text-[#05B8A2]">
          Select Segment
        </Text>
        <View className="w-full max-w-xs mb-6 rounded-xl overflow-hidden bg-black">
          <Video
            ref={videoRef}
            source={{ uri: selectedVideo.uri }}
            style={{ width: 320, height: 180 }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            onLoad={onLoad}
          />
        </View>
        <Text className="mb-2 text-gray-700">
          Start Time: {start.toFixed(1)}s
        </Text>

        <Slider
          style={{ width: 280, height: 40 }}
          minimumValue={0}
          maximumValue={sliderMax}
          value={start}
          onValueChange={setStart}
          minimumTrackTintColor="#05B8A2"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#05B8A2"
          step={0.1}
        />
        <Text className="mb-4 text-gray-500">
          Segment: {start.toFixed(1)}s - {(start + 5).toFixed(1)}s
        </Text>
        <Pressable
          className="bg-white border-[1px] border-[#05B8A2] rounded-xl px-6 py-3 w-48 h-14 mt-6 flex-row justify-center items-center"
          onPress={() =>
            setStep({ step: 3, segmentStart: start, segmentEnd: start + 5 })
          }
        >
          <Text className="text-[#05B8A2] font-semibold">Continue</Text>
        </Pressable>
      </View>
    );
  }

  if (step.step === 3 && selectedVideo) {
    const segmentStart = step.segmentStart ?? 0;
    const segmentEnd = step.segmentEnd ?? 5;

    // Handles adding the cropped video to the store after validation and cropping.
    const handleAdd = async () => {
      if (!name.trim()) {
        setError("Please enter a video name.");
        return;
      }
      if (!description.trim()) {
        setError("Please enter a description.");
        return;
      }
      setError("");
      setLoading(true);
      let croppedUri = undefined;
      try {
        const {
          FFmpegKit,
          FFmpegKitConfig,
        } = require("ffmpeg-kit-react-native");
        const inputPath = selectedVideo.uri.replace("file://", "");
        const outputPath =
          FileSystem.cacheDirectory + `segment_${Date.now()}.mp4`;
        const cmd = `-ss ${segmentStart} -i "${inputPath}" -t ${
          segmentEnd - segmentStart
        } -c copy "${outputPath}"`;
        const session = await FFmpegKit.execute(cmd);
        const returnCode = await session.getReturnCode();
        if (returnCode.isValueSuccess()) {
          croppedUri = outputPath;
        } else {
          setError("Failed to crop segment!");
          setLoading(false);
          return;
        }
      } catch (e) {
        setError("Failed to crop segment!");
        setLoading(false);
        return;
      }
      const videoObj = {
        id: Date.now().toString(),
        name,
        description,
        uri: croppedUri || selectedVideo.uri,
        segmentStart,
        segmentEnd,
      };
      addVideo(videoObj);
      setLoading(false);
      router.push("/");
    };

    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-2xl font-bold mb-6 text-[#05B8A2]">
          Video Details
        </Text>
        <View className="w-full max-w-xs mb-4">
          <Text className="mb-1 text-[#05B8A2]">Name</Text>
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
          <Text className="mb-1 text-[#05B8A2]">Description</Text>
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
          className="bg-[#05B8A2] rounded-xl px-6 py-3 w-48 h-14 mt-6 flex-row justify-center items-center"
          onPress={handleAdd}
        >
          <Text className="text-white font-semibold">Finish</Text>
        </Pressable>
      </View>
    );
  }
};

export default CropScreen;
