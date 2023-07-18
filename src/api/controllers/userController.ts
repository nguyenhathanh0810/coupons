import User from "../../models/User";

export async function create({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) {
  const user = new User({
    name: fullname,
    email,
  });
  try {
    await user.save();
  } catch (error: any) {
    return { error_code: "email:invalid", error_message: error?.message };
  }
  return { ...user.toJSON() };
}

export async function findByEmail(email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    return {
      error_code: "user:not_found",
      error_message: "Cannot find user with given email",
    };
  }
  return { ...user.toJSON() };
}

export async function list() {
  const users = await User.find({});
  return {
    count: users.length,
    list: users.map(u => ({...u.toJSON()}))
  }
}
