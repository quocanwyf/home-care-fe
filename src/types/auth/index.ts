export interface LoginRequest {
  hmrId: string;
  password: string;
}

export interface LoginResponse {
  fullName: string;
  role: string;
  permissionList: string[];
}

export interface User {
  fullName: string;
  role: string;
  permissionList: string[];
  hmrId?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
