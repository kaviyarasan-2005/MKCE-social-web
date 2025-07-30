import create from 'zustand';

const useUserStore = create((set) => ({
  connectedUsers: [],
  addUser: (user) =>
    set((state) => {
      const exists = state.connectedUsers.find((u) => u.id === user.id);
      if (!exists) {
        return { connectedUsers: [...state.connectedUsers, user] };
      }
      return state;
    }),
  removeUser: (id) =>
    set((state) => ({
      connectedUsers: state.connectedUsers.filter((u) => u.id !== id),
    })),
}));

export default useUserStore;
