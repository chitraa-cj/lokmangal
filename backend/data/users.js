import bcrypt from "bcryptjs";

const users = [
  {
    username: "Admin",
    password: bcrypt.hashSync("@admin963", 10),
    name: "Admin",
    isAdmin: true,
  },
  {
    username: "test",
    password: bcrypt.hashSync("123456", 10),
    name: "Test",
  },
  // {
  //   username: "empty",
  //   password: bcrypt.hashSync("123456", 10),
  //   name: "Test",
  // },
];

export default users;
