import db from "../models";

export const seedAdminUser = async () => {
  try {
    const user = await db.User.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    });
    if (!user) {
      await db.User.create({
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log("Admin User Created");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
