import jwt from "jsonwebtoken";

export default {
  getUserId: (req: any) => {
    const token = req.headers.authorization || "";

    try {
      if (token) {
        const { sub } = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.JWT_SIGNING_KEY!
        ) as any;
        return sub;
      }
    } catch (err) {
      console.log(err.message);
    }
  },
};
