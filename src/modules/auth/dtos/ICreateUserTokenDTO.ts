interface ICreateUserTokenDTO {
  user_id: string;
  expires_date: string;
  refresh_token: string;
}

export { ICreateUserTokenDTO };
