export const roomService = {
    getAllRooms: async () => {
      // API call logic here
      return mockRooms;
    },
  
    getRoomById: async (id) => {
      // API call logic here
      return mockRooms.find(r => r.id === id);
    },
  
    updateRoomStatus: async (id, status) => {
      // API call logic here
      return { success: true, data: { id, status } };
    },
  
    getAvailableRooms: async (checkIn, checkOut) => {
      // API call logic here
      return mockRooms.filter(r => r.status === 'Available');
    }
  };