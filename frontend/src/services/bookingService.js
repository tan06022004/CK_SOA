export const bookingService = {
    getAllBookings: async () => {
      // API call logic here
      return mockBookings;
    },
  
    getBookingById: async (id) => {
      // API call logic here
      return mockBookings.find(b => b.id === id);
    },
  
    createBooking: async (bookingData) => {
      // API call logic here
      return { success: true, data: bookingData };
    },
  
    updateBooking: async (id, bookingData) => {
      // API call logic here
      return { success: true, data: bookingData };
    },
  
    deleteBooking: async (id) => {
      // API call logic here
      return { success: true, message: 'Booking deleted' };
    }
  };