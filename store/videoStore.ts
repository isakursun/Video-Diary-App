import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Video tipini tanımlıyoruz
export interface VideoItem {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  uri: string;
  segmentStart: number;
  segmentEnd: number;
}

// Store'un tipi
interface VideoStore {
  videos: VideoItem[];
  addVideo: (video: VideoItem) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, update: Partial<VideoItem>) => void;
}

// Zustand ile video store'u oluştur
// Türkçe: Store'u persist ile AsyncStorage'a kaydediyoruz
export const useVideoStore = create<VideoStore>(
  persist(
    (set) => ({
      videos: [],
      addVideo: (video) =>
        set((state) => ({ videos: [video, ...state.videos] })),
      removeVideo: (id) =>
        set((state) => ({ videos: state.videos.filter((v) => v.id !== id) })),
      updateVideo: (id, update) =>
        set((state) => ({
          videos: state.videos.map((v) => v.id === id ? { ...v, ...update } : v)
        })),
    }),
    {
      name: "video-store",
      // Türkçe: AsyncStorage ile otomatik stringleştirme için createJSONStorage kullanıyoruz
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
