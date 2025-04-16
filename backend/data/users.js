import bcrypt from "bcryptjs";

const users = [
  {
    username: "Admin",
    password: bcrypt.hashSync("Y0T39y5m61nWswYp", 10),
    name: "Admin",
    isAdmin: false,
  },
  {
    username: "test",
    password: bcrypt.hashSync("coGMRFX8IG59iL9Y", 10),
    name: "Test",
    isAdmin: false,
  },
];

export default users;
