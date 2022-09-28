import create from "zustand";
import PocketBase from "pocketbase";


const client = new PocketBase(process.env.NODE_ENV === "production" ? window.location.origin : "http://10.150.20.20:8090");

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
