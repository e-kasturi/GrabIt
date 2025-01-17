const bcrypt = require("bcryptjs");

export const hashPass = (password: string) => {
  return bcrypt.hashSync(password);
};

export const comparePass = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
