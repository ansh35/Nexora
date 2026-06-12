import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  const defaultPassword = "password123"
  const passwordHash = await bcrypt.hash(defaultPassword, 10)

  await prisma.task.deleteMany({})
  await prisma.project.deleteMany({})

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

  const createdNexoraUsers: Record<string, { id: string }> = {}

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
    createdNexoraUsers[user.email] = dbUser
    console.log(`User seeded: ${dbUser.email} (${dbUser.role}) in ${nexoraOrg.name}`)
  }

  const nexoraProjects = [
    { name: "Nexora Marketing Site", description: "The main marketing landing page for Nexora." },
    { name: "Internal Admin Dashboard", description: "Management portal for internal team operations." },
    { name: "Mobile App MVP", description: "React Native mobile application prototype." }
  ]

  let firstNexoraProject = null;

  for (const proj of nexoraProjects) {
    const dbProj = await prisma.project.create({
      data: {
        name: proj.name,
        description: proj.description,
        organizationId: nexoraOrg.id,
      }
    })
    if (!firstNexoraProject) firstNexoraProject = dbProj;
    console.log(`Project seeded: ${dbProj.name} in ${nexoraOrg.name}`)
  }

  if (firstNexoraProject) {
    const nexoraTasks = [
      { title: "Design Landing Page UI", description: "Create Figma mockups.", status: "TODO", priority: "HIGH", assigneeId: createdNexoraUsers["member1@nexora.dev"].id },
      { title: "Setup Next.js Boilerplate", description: "Initialize app router.", status: "IN_PROGRESS", priority: "MEDIUM", assigneeId: createdNexoraUsers["admin@nexora.dev"].id },
      { title: "Write Copywriting", description: "Draft the hero section copy.", status: "DONE", priority: "LOW", assigneeId: null },
      { title: "Implement Kanban Board", description: "Use dnd-kit for drag and drop.", status: "IN_PROGRESS", priority: "HIGH", assigneeId: createdNexoraUsers["owner@nexora.dev"].id },
      { title: "Review Auth Flow", description: "Check session handling in NextAuth.", status: "TODO", priority: "MEDIUM", assigneeId: createdNexoraUsers["member2@nexora.dev"].id },
      { title: "Fix API Rate Limiting", description: "Users are getting 429 too often.", status: "TODO", priority: "HIGH", assigneeId: createdNexoraUsers["member3@nexora.dev"].id },
      { title: "Update README", description: "Add instructions for local setup.", status: "DONE", priority: "LOW", assigneeId: createdNexoraUsers["member1@nexora.dev"].id },
      { title: "Configure Vercel Deployment", description: "Set environment variables for production.", status: "TODO", priority: "HIGH", assigneeId: null },
      { title: "Create Marketing Assets", description: "Social media banners.", status: "IN_PROGRESS", priority: "LOW", assigneeId: createdNexoraUsers["member2@nexora.dev"].id }
    ]

    for (const task of nexoraTasks) {
      await prisma.task.create({
        data: {
          ...task,
          organizationId: nexoraOrg.id,
          projectId: firstNexoraProject.id
        }
      })
      console.log(`Task seeded: ${task.title}`)
    }
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

  const createdAcmeUsers: Record<string, { id: string }> = {}

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
    createdAcmeUsers[user.email] = dbUser
    console.log(`User seeded: ${dbUser.email} (${dbUser.role}) in ${acmeOrg.name}`)
  }

  const acmeProjects = [
    { name: "Acme E-commerce Platform", description: "B2C online store redesign and platform migration." },
    { name: "Q3 Marketing Campaign", description: "Global brand awareness initiative." }
  ]

  let firstAcmeProject = null;

  for (const proj of acmeProjects) {
    const dbProj = await prisma.project.create({
      data: {
        name: proj.name,
        description: proj.description,
        organizationId: acmeOrg.id,
      }
    })
    if (!firstAcmeProject) firstAcmeProject = dbProj;
    console.log(`Project seeded: ${dbProj.name} in ${acmeOrg.name}`)
  }

  if (firstAcmeProject) {
    const acmeTasks = [
      { title: "Migrate Payment Gateway", description: "Switch to Stripe integration.", status: "IN_PROGRESS", priority: "HIGH", assigneeId: createdAcmeUsers["admin@acme.com"].id },
      { title: "Update Product Catalog", description: "Import CSV dump.", status: "TODO", priority: "MEDIUM", assigneeId: createdAcmeUsers["member@acme.com"].id }
    ]

    for (const task of acmeTasks) {
      await prisma.task.create({
        data: {
          ...task,
          organizationId: acmeOrg.id,
          projectId: firstAcmeProject.id
        }
      })
      console.log(`Task seeded: ${task.title}`)
    }
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
