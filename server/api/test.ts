import getPool from '~/server/utils/db'

export default defineEventHandler(async () => {
  const pool = getPool()

  const [rows] = await pool.query('SELECT NOW() AS time')

  return rows
})