export const jwtConstants = {
  secret:
    process.env.JWT_SECRET ||
    '300e29b0b84319f0c8dd9761cc0781fef2a33cdc13a058d88c9aeef6918bb126915aefcf063359bd039abf9ff02efde8e74de45484948a3f42b3b8054c08d5e8',
  user_pass:
    process.env.JWT_USER_PASS ||
    '$2b$10$TohFJZ04nU63Ud2pW8PtPeVzp88vjuHgsGPQ2KUjTUkjb8b7zJ84e',
  system_pass:
    process.env.JWT_SYSTEM_PASS ||
    '$2b$10$BvJITkYrABMeUiDqnQmQgepqG.ktV5YWet7HCA41CbaGJ.BwLs/vG',
};
