import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const [rows] = await query('SELECT NOW() AS time')

  return rows
})
