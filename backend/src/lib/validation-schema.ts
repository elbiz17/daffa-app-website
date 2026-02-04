import { z } from "zod";

// schema untuk signUp
export const signUpSchema = z.object({
  name: z.string().min(2, "min 2"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// schema untuk signIn
export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const categoriesSchema = z.object({
  name:z.string().min(2, "Min 2 words")
})

export const createArticleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").nonempty("Title wajib diisi"),
  slug: z.string().optional(),
  type: z.enum(["artikel", "blog"], {
    message: "Tipe artikel wajib diisi ('artikel' atau 'blog')",
  }),
  excerpt: z.string().optional(),
  body: z.string().min(10, "Isi artikel minimal 10 karakter").nonempty("Isi artikel wajib diisi"),
  heroImage: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  publishedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().optional(),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  heroImage: z.string().url().optional(),
  status: z.enum(["draft", "published"]).optional(),
  tags: z.array(z.string()).optional(),
});


export const usersSchema = z.object({
  id: z.string().nonempty("ID is required"),
  role: z.string()
    .nonempty("Role is required")
    .refine((val) => ["USER", "ADMIN"].includes(val), {
      message: "Role must be USER or ADMIN",
    }),
});




export type usersSchema = z.infer <typeof usersSchema>;
export type categories = z.infer<typeof categoriesSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
