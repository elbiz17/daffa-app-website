import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticatedToken";
import { error, success } from "../utils/responseHelper";
import { TagsService } from "../services/tags.service";

export const TagsController = {
    getAllTags:async(req:AuthenticatedRequest, res:Response) => {
        try {
            const tags = await TagsService.getAllTags();
            return res.status(200).json(success("Tags retrieved successfully", tags));
        } catch (err:any) {
            const statusCode = err.statusCode || 500;
            const message = err.message || "Internal Server Error.";
            return res.status(statusCode).json(error(message));
        }
    },
    
}