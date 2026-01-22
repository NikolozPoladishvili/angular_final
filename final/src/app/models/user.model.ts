export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}
