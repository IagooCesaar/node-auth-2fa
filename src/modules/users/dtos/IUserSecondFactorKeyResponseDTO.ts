interface IUserSecondFactorKeyResponseDTO {
  user_id: string;
  key: string;
  created_at: Date;
  validated: boolean;
  validated_at?: Date;
  qrcode_url?: string;
}

export { IUserSecondFactorKeyResponseDTO };
