import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticatedToken";
import { error, success, unauthorized } from "../utils/responseHelper";
import { signInSchema } from "../lib/validation-schema";
import AuthServices from "../services/auth.services";
import { verifyToken } from "../utils/jwt";

const AuthController = {
  signIn: async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      return res.status(400).json(error("Body Missing"));
    }
    const result = signInSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(error(result.error.flatten().fieldErrors));
    }

    console.log("results", result);
    
    try {
      const { email, password } = result.data;

      const loggedIn = await AuthServices.signIn(email, password);

      return res.status(200).json(success("Login successful", loggedIn));
    } catch (err: any) {
      if (err instanceof Error) {
        return res.status(401).json(unauthorized(err.message));
      }
      return res.status(500).json(error("Unexpected error occurred"));
    }
  },
  me: async (req: AuthenticatedRequest, res: Response) => {
    console.log("reques", req?.user?.id);
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1]; // format: Bearer <token>
      const decoded = verifyToken(token);

      if (!decoded.user?.id) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
      if (!req?.user?.id) throw new Error("Unauthorized");
      const user = await AuthServices.me(req.user.id, token);
      res.status(200).json(success("Profile retrieved successfully", user));
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(401).json(unauthorized(err.message));
      }
      return res.status(500).json(error("Unexpected error occurred"));
    }
  },
};

export default AuthController;
