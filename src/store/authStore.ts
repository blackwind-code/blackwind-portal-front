import create from "zustand";
import PocketBase from "pocketbase";


const client = new PocketBase(process.env.NODE_ENV === "production" ? window.location.origin : "https://portal.blackwind.tech");

type UseAuthStore = {
  isLogin: boolean;
  client: PocketBase;
  requesting: boolean;
  setRequesting: (state:boolean) => void;
  setIsLogin: (login:boolean)=> void;
}

export const useAuthStore = create<UseAuthStore>((set) => ({
  isLogin: false,
  client: client,
  requesting: false,
  setRequesting: (state: boolean) => set(() => ({ requesting: state })),
  setIsLogin: (login: boolean) => set(() => ({ isLogin: login })),
}));
