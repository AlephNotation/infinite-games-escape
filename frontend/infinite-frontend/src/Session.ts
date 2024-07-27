import { create } from "zustand";

export type CookieStore = {
  cookie: string;
  setCookie: (newCookie: string) => void;
  getCookie: () => void;
};

const useStore = create((set) => ({
  cookie: "",
  setCookie: (username) => {
    const cookieValue = "user=" + JSON.stringify(username);
    document.cookie = cookieValue; // Set the cookie in document
    set({ cookie: cookieValue }); // Update the store
  },

  getCookie: () => set({ cookie: 0 }),
}));

export default useStore;
