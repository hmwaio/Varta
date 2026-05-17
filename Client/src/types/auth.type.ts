export type SendOTPInputType = {
  email: string;
}

export type OTPInputType = {
  otp: string;
}

export type VerifyOTPInputType = {
  email: string;
  otp: string;
}

export type SignupInputType = {
  name: string;
  password: string;
}

export type LoginInputType = {
  email: string;
  password: string;
}

export type NewPasswordInputType = {
  newPassword: string;
}