export default () => ({
  secret: process.env.JWT_SECRET_KEY,
  signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
});
