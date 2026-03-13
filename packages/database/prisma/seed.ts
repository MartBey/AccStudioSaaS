import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean up existing data to avoid conflicts during testing
  await prisma.user.deleteMany({});
  await prisma.project.deleteMany({});

  // 1. Create a Master Password Hash (password123)
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 2. Seed Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@accstudio.com",
      password: hashedPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          bio: "System Administrator",
        },
      },
    },
  });

  // 3. Seed Brand User
  const brandUser = await prisma.user.create({
    data: {
      name: "Marka Temsilcisi",
      email: "marka@example.com",
      password: hashedPassword,
      role: Role.BRAND,
      profile: {
        create: {
          bio: "TechStartup Dijital Pazarlama Müdürü",
          brand: {
            create: {
              companyName: "TechVision Inc.",
              industry: "Software Development",
              taxNumber: "1234567890",
            },
          },
        },
      },
    },
    include: { profile: { include: { brand: true } } },
  });

  // 4. Seed Agency User
  const agencyUser = await prisma.user.create({
    data: {
      name: "Ajans Yöneticisi",
      email: "ajans@example.com",
      password: hashedPassword,
      role: Role.AGENCY,
      profile: {
        create: {
          bio: "Creative Digital Agency",
          agency: {
            create: {
              agencyName: "Alpha Digital",
              teamSize: 5,
              employees: {
                create: [
                  {
                    name: "Ali Yılmaz",
                    role: "Senior Developer",
                    email: "ali@alpha.com",
                    status: "ACTIVE",
                  },
                  {
                    name: "Ayşe Demir",
                    role: "UI Designer",
                    email: "ayse@alpha.com",
                    status: "ACTIVE",
                  },
                ],
              },
            },
          },
        },
      },
    },
    include: { profile: { include: { agency: true } } },
  });

  // 5. Seed Freelancer User
  const freelancerUser = await prisma.user.create({
    data: {
      name: "Freelancer Uzman",
      email: "freelancer@example.com",
      password: hashedPassword,
      role: Role.FREELANCER,
      profile: {
        create: {
          bio: "5+ yıllık deneyimli Full-stack Developer",
          freelancer: {
            create: {
              title: "Senior Software Engineer",
              hourlyRate: 50.0,
            },
          },
        },
      },
    },
    include: { profile: { include: { freelancer: true } } },
  });

  // 5b. Create Skills & UserSkills for freelancer
  const skillNames = ["React", "Next.js", "Node.js", "Prisma"];
  for (const skillName of skillNames) {
    const skill = await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName, category: "Web Development" },
    });
    if (freelancerUser.profile?.id) {
      await prisma.userSkill.upsert({
        where: { profileId_skillId: { profileId: freelancerUser.profile.id, skillId: skill.id } },
        update: {},
        create: { profileId: freelancerUser.profile.id, skillId: skill.id },
      });
    }
  }

  // 6. Create Demo Projects and Tasks
  if (brandUser.profile?.brand && agencyUser.profile?.agency) {
    const project1 = await prisma.project.create({
      data: {
        name: "Enterprise SEO Çözümü",
        description: "TechVision için e-ticaret altyapısı SEO optimizasyonu",
        budget: 45000,
        status: "ACTIVE",
        brandId: brandUser.profile.brand.id,
        agencyId: agencyUser.profile.agency.id,
        tasks: {
          create: [
            {
              title: "Rakip Backlink Analizi",
              status: "DONE",
              earning: 1500,
              freelancerId: freelancerUser.profile?.freelancer?.id,
            },
            {
              title: "Anahtar Kelime Boşluk Raporu",
              status: "IN_PROGRESS",
              earning: 2500,
              freelancerId: freelancerUser.profile?.freelancer?.id,
            },
          ],
        },
      },
    });
    console.log(`Created Project: ${project1.name}`);
  }

  console.log("Database seeding complete!");
  console.log("--- Test Login Accounts ---");
  console.log("Brand: marka@example.com / password123");
  console.log("Agency: ajans@example.com / password123");
  console.log("Freelancer: freelancer@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
