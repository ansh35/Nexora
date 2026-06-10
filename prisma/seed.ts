import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  const defaultPassword = "password123"
  const passwordHash = await bcrypt.hash(defaultPassword, 10)

  // 1. Nexora Demo Workspace
  const nexoraOrg = await prisma.organization.upsert({
    where: { slug: "nexora-demo-workspace" },
    update: {},
    create: {
      name: "Nexora Demo Workspace",
      slug: "nexora-demo-workspace",
    },
  })
  console.log(`Organization "${nexoraOrg.name}" is ready.`)

  const nexoraUsers = [
    { email: "owner@nexora.dev", name: "Owner", role: "OWNER" },
    { email: "admin@nexora.dev", name: "Admin", role: "ADMIN" },
    { email: "member1@nexora.dev", name: "Member 1", role: "MEMBER" },
    { email: "member2@nexora.dev", name: "Member 2", role: "MEMBER" },
    { email: "member3@nexora.dev", name: "Member 3", role: "MEMBER" },
  ]

  for (const user of nexoraUsers) {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        organizationId: nexoraOrg.id,
        role: user.role,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: passwordHash,
        organizationId: nexoraOrg.id,
      },
    })
    console.log(`User seeded: ${dbUser.email} (${dbUser.role}) in ${nexoraOrg.name}`)
  }

  // 2. Acme Workspace
  const acmeOrg = await prisma.organization.upsert({
    where: { slug: "acme-workspace" },
    update: {},
    create: {
      name: "Acme Workspace",
      slug: "acme-workspace",
    },
  })
  console.log(`Organization "${acmeOrg.name}" is ready.`)

  const acmeUsers = [
    { email: "owner@acme.com", name: "Acme Owner", role: "OWNER" },
    { email: "admin@acme.com", name: "Acme Admin", role: "ADMIN" },
    { email: "member@acme.com", name: "Acme Member", role: "MEMBER" },
  ]

  for (const user of acmeUsers) {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        organizationId: acmeOrg.id,
        role: user.role,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: passwordHash,
        organizationId: acmeOrg.id,
      },
    })
    console.log(`User seeded: ${dbUser.email} (${dbUser.role}) in ${acmeOrg.name}`)
  }

  console.log("Database seeding completed.")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
