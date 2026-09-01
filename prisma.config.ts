import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * Prisma 7 reads the connection URL from here rather than from schema.prisma.
 *
 * The datasource is attached only when DATABASE_URL is actually set, because
 * `prisma generate` does not need a database — and CI or a fresh clone has no
 * env file. Eagerly resolving it there fails the build for no reason. Migration
 * commands still error clearly if the URL is missing.
 */

const url = process.env.DATABASE_URL

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  ...(url ? { datasource: { url } } : {}),
})
