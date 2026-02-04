export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Yayasan API",
    version: "1.0.0",
    description: "API untuk Zakat, Fidyah, Qurban, dan Donasi",
  },
  servers: [
    { url: "http://localhost:4000", description: "Local Server" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    "/api/auth/sign-in": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "Login berhasil" },
          400: { description: "Email atau password salah" },
        },
      },
    },

    "/api/auth/me": {
      get: {
        summary: "Ambil data user yang sedang login",
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Berhasil mengambil data user" },
          401: { description: "Token tidak valid atau tidak ada" },
        },
      },
    },
  },
};
