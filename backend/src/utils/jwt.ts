import jwt, { type SignOptions } from "jsonwebtoken";
import ms from "ms";

interface CustomJwtPayload {
  user?: {
    id: string;
    role: "ADMIN" | "USER";
  };
  iat?: number;
  exp?: number;
  createdAt?: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// export function generateToken(payload: CustomJwtPayload) {
//   // buat token
//   const token = jwt.sign(payload, JWT_SECRET, {
//     expiresIn: JWT_EXPIRES_IN,
//   } as SignOptions);

//   // hitung detik dari JWT_EXPIRES_IN
//   const expiresInMs = ms(JWT_EXPIRES_IN as any);
//   const expiresIn = Math.floor(Number(expiresInMs) / 1000);

//   return {
//     token,
//     expiresIn,
//   };
// }

export function generateToken(payload: CustomJwtPayload):{
  token: string;
  expiresIn: number;
  expiresAt: Date;
  createdAt: Date;  // ← Ditambahkan di return type
} {
  // 1. Dapatkan waktu sekarang dalam UTC
  const nowUtc = new Date();

  // 2. Konversi ke UTC+7 (tambah 7 jam)
  const utc7Offset = 7 * 60 * 60 * 1000; // 7 jam dalam milliseconds
  const nowUtc7 = new Date(nowUtc.getTime() + utc7Offset);

  // 3. Hitung iat (issued at) dalam Unix timestamp (detik)
  const iat = Math.floor(nowUtc7.getTime() / 1000);

  // 4. Hitung expiresIn dalam detik
  const expiresInMs = ms(JWT_EXPIRES_IN as any);
  const expiresIn = Math.floor(Number(expiresInMs) / 1000);

  // 5. Hitung exp (expiration) dalam Unix timestamp
  const exp = iat + expiresIn;

  // 6. Gabungkan payload dengan timestamp UTC+7
  const tokenPayload = {
    ...payload,
    iat: iat, // Issued at dalam UTC+7
    exp: exp, // Expiration dalam UTC+7
    createdAt: nowUtc7.toISOString(), 
  };

  // 7. Generate token dengan noTimestamp agar pakai iat/exp kita
  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true, // PENTING: jangan generate iat otomatis
  } as SignOptions);

  // 8. ExpiresAt dalam format Date (UTC+7)
  const expiresAt = new Date(exp * 1000);

  return {
    token,
    expiresIn,
    expiresAt, // Sudah dalam UTC+7, tidak perlu konversi lagi!
    createdAt: nowUtc7,
  };
}

export const verifyToken = (token: string): CustomJwtPayload => {
  return jwt.verify(token, JWT_SECRET as string) as CustomJwtPayload;
};

export const decodeToken = (token: string): CustomJwtPayload | null => {
  return jwt.decode(token) as CustomJwtPayload | null;
};
