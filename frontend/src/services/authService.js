export const authService = {
    users: {
      'receptionist': { password: '123456', role: 'receptionist' },
      'accountant': { password: '123456', role: 'accountant' },
      'housekeeping': { password: '123456', role: 'housekeeping' },
      'maintenance': { password: '123456', role: 'maintenance' },
      'manager': { password: '123456', role: 'manager' }
    },
  
    login: (username, password) => {
      const user = authService.users[username.toLowerCase()];
      
      if (user && user.password === password) {
        return {
          success: true,
          role: user.role,
          message: 'Đăng nhập thành công'
        };
      }
      
      return {
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      };
    },
  
    logout: () => {
      // Clear session/token logic here
      return true;
    }
  };
  