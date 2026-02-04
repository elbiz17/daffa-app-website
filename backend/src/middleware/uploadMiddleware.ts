import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Fungsi untuk buat folder kalau belum ada
const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = path.join(__dirname, "../../uploads");

    // ✅ Cek fieldname untuk arahkan ke folder berbeda
    if (file.fieldname === "thumbnail") {
      uploadDir = path.join(uploadDir, "thumbnails");
    } else if (file.fieldname === "image") {
      uploadDir = path.join(uploadDir, "images");
    }

    ensureDirExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage });
