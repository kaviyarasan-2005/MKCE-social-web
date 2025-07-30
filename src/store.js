import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set) => ({
      selectedUser: null,
      messages: {},
      selectUser: (user) => set({ selectedUser: user }),
      sendMessage: (user, message, from) =>
        set((state) => {
          const current = state.messages[user] || [];
          return {
            messages: {
              ...state.messages,
              [user]: [...current, { text: message, from }],
            },
          };
        }),
    }),
    {
      name: 'chat-storage', // localStorage key
    }
  )
);

export default useChatStore;
