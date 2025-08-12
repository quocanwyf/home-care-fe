export interface LoginRequest {
  hmrId: string;
  password: string;
}

export interface LoginResponse {
  user: {
    fullName: string;
    role: string;
    permissionList: string[];
    hmrId?: string;
  };
  messages: string;
}

export interface User {
  user: {
    fullName: string;
    role: string;
    permissionList: string[];
    hmrId?: string;
  };
  messages: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
