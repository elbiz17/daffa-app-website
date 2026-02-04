import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // Admin

  const hashedPassword = await bcrypt.hash("Test123#", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@dafa.com" },
    update: {},
    create: {
      name: "Admin Yayasan",
      email: "admin@dafa.com",
      password: hashedPassword,
      phone:'082310238276',
      role: "ADMIN",
    },
  });

  // Campaign Zakat
  const zakatCampaign = await prisma.campaign.create({
    data: {
      title: "Zakat Profesi 2025",
      slug: "zakat-profesi-2025",
      description: "Program pengumpulan zakat profesi untuk membantu sesama.",
      targetAmount: 100000000,
      startDate: new Date(),
      category: "zakat",
      createdById: admin.id,
      zakat: {
        create: {
          zakatType: "profesi",
          nisabValue: 85000000,
          zakatPercent: 2.5,
        },
      },
    },
  });

  // Campaign Fidyah
  const fidyahCampaign = await prisma.campaign.create({
    data: {
      title: "Fidyah Ramadhan 2025",
      slug: "fidyah-ramadhan-2025",
      description: "Tebus puasa Ramadhan dengan fidyah.",
      targetAmount: 20000000,
      startDate: new Date(),
      category: "fidyah",
      createdById: admin.id,
      fidyah: {
        create: {
          amountPerDay: 45000,
        },
      },
    },
  });

  // Campaign Qurban
  const qurbanCampaign = await prisma.campaign.create({
    data: {
      title: "Qurban Idul Adha 2025",
      slug: "qurban-idul-adha-2025",
      description: "Berkurban untuk sesama.",
      targetAmount: 500000000,
      startDate: new Date(),
      category: "qurban",
      createdById: admin.id,
      qurban: {
        create: {
          animalType: "sapi",
          price: 20000000,
          stock: 10,
        },
      },
    },
  });

  // Artikel contoh
  await prisma.article.create({
    data: {
      title: "Makna Berzakat dalam Islam",
      slug: "makna-berzakat-dalam-islam",
      type: "artikel",
      body: "Zakat merupakan salah satu rukun Islam yang wajib ditunaikan oleh setiap muslim...",
      status: "published",
      authorId: admin.id,
    },
  });

  console.log("✅ Seed data berhasil dimasukkan!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
