import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center mb-6 bg-[#05B8A2] shadow-lg rounded-3xl px-4 justify-center min-h-[72px]">
      {showBackButton !== false && (
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.65}
          className="w-12 h-12 rounded-full pb-1 bg-white justify-center items-center"
        >
          <Text className="text-3xl font-bold text-[#05B8A2] text-center">
            ←
          </Text>
        </TouchableOpacity>
      )}
      <Text className="flex-1 text-center text-2xl font-extrabold text-white tracking-wide">
        {title}
      </Text>
    </View>
  );
};

export default Header;
