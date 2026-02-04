import prisma from "../prisma/client";

export const TagsService = {
  getAllTags: async () => {
    // Simulate fetching tags from a database
    const tags = await prisma.tag.findMany();
    return tags;
  },
};
