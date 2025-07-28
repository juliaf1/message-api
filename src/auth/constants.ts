export const jwtConstants = {
  secret: process.env.JWT_SECRET || '',
  user_pass: process.env.JWT_USER_PASS || '',
  system_pass: process.env.JWT_SYSTEM_PASS || '',
};
