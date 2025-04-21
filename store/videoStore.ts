import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// VideoItem defines the structure for a single video entry in the store.
export interface VideoItem {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  uri: string;
  segmentStart: number;
  segmentEnd: number;
}

// VideoStore describes the shape of the Zustand video store.
interface VideoStore {
  videos: VideoItem[];
  // addVideo adds a new video to the store.
  addVideo: (video: VideoItem) =>
    set((state) => ({ videos: [video, ...state.videos] })),
  // removeVideo deletes a video by its id.
  removeVideo: (id: string) =>
    set((state) => ({ videos: state.videos.filter((v) => v.id !== id) })),
  // updateVideo updates the properties of a video by its id.
  updateVideo: (id: string, update: Partial<VideoItem>) =>
    set((state) => ({
      videos: state.videos.map((v) => v.id === id ? { ...v, ...update } : v)
    })),
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
