import { create } from 'zustand'

type Store = {
  isMobile: boolean
  setIsMobile: (isMobile: boolean) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useGlobalStore = create<Store>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
}))
