export type TSignupResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: TSignupData;
  timestamp: string;
};

export interface TSignupData {
  id: string;
  email: string;
}

export type TSignupRequest = {
  email: string;
  password: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export interface TLoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TLoginData;
  timestamp: string;
}

export interface TLoginData {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
  userId: string;
}

export type TRefreshRequest = {
  refreshToken: string;
  refreshTokenId: string;
};

export interface TRefreshResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TRefreshData;
  timestamp: string;
}

export interface TRefreshData {
  accessToken: string;
  refreshToken: string;
}

export interface TUserResponseWrapper {
  success: boolean;
  statusCode: number;
  message: string;
  data: TUserResponse;
  timestamp: string;
}

export interface TUserResponse {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  email: string;
}
}
