import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

// VideoCardProps defines the expected props for the VideoCard component.
export interface VideoCardProps {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  uri: string;
  segmentStart: number;
  segmentEnd: number;
}

// VideoCard displays a summary card for a video and provides delete functionality.
const VideoCard: React.FC<VideoCardProps> = (props) => {
  const { id, name, description } = props;
  const router = useRouter();
  return (
    <Pressable
      className="items-center justify-center"
      onPress={() => router.push({ pathname: "/details", params: { id } })}
    >
      <View className="flex-row items-center justify-center bg-white rounded-3xl px-3 py-2 min-h-20 relative shadow-lg border-[1px] border-[#05B8A2]">
        <Pressable
          // Removes the video from the store when the delete button is pressed.
          onPress={() => {
            const { removeVideo } =
              require("../store/videoStore").useVideoStore.getState();
            removeVideo(id);
          }}
          className="w-10 h-10 rounded-full bg-[#05B8A2] justify-center items-center absolute right-2 top-1/2 -translate-y-1/3 z-10"
          hitSlop={16}
        >
          <Text className="text-white font-bold text-3xl leading-9">×</Text>
        </Pressable>
        <View className="w-14 h-14 rounded-lg bg-gray-100 justify-center items-center mr-3">
          <Text className="text-2xl text-gray-400">🎬</Text>
        </View>
        <View className="flex-1 justify-center">
          <Text
            className="font-semibold text-base text-gray-900"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default VideoCard;
