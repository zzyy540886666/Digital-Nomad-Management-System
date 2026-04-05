const db = require('./connMysql')

const query = async (sql, params = []) => {
  const [results] = await db.query(sql, params)
  return results
}

const queryOne = (sql, params = []) => {
  return query(sql, params).then(results => results[0] || null)
}

const insert = (table, data) => {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map(() => '?').join(', ')
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`
  return query(sql, values)
}

const update = (table, data, where, whereParams = []) => {
  const sets = Object.keys(data).map(key => `${key} = ?`).join(', ')
  const values = [...Object.values(data), ...whereParams]
  const sql = `UPDATE ${table} SET ${sets} WHERE ${where}`
  return query(sql, values)
}

const remove = (table, where, whereParams = []) => {
  const sql = `DELETE FROM ${table} WHERE ${where}`
  return query(sql, whereParams)
}

const paginate = (sql, params = [], page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize
  const countSql = `SELECT COUNT(*) as total FROM (${sql}) as temp`
  
  return Promise.all([
    query(`${sql} LIMIT ?, ?`, [...params, parseInt(offset), parseInt(pageSize)]),
    queryOne(countSql, params)
  ]).then(([list, { total }]) => ({
    list,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    totalPages: Math.ceil(total / pageSize)
  }))
}

module.exports = {
  query,
  queryOne,
  insert,
  update,
  remove,
  paginate
}
