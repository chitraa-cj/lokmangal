import bcrypt from "bcryptjs";

const users = [
  {
    username: "Admin",
    password: bcrypt.hashSync("qwerty", 10),
    name: "Admin",
    isAdmin: false,
  },
  {
    username: "test",
    password: bcrypt.hashSync("123456", 10),
    name: "Test",
    isAdmin: false,
  },
  {
    username: "empty",
    password: bcrypt.hashSync("123456", 10),
    name: "Empty",
    isAdmin: false,
  },
];

export default users;
