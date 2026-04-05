const database = require('../../db/database')

const getOverview = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const [uv, leads, signups, ea] = await Promise.all([
      database.queryOne('SELECT COUNT(*) as count FROM event_logs WHERE event_name = "visit" AND DATE(created_at) = ?', [today]),
      database.queryOne('SELECT COUNT(*) as count FROM package_leads WHERE DATE(created_at) = ?', [today]),
      database.queryOne('SELECT COUNT(*) as count FROM event_signups WHERE DATE(created_at) = ?', [today]),
      database.queryOne('SELECT COUNT(DISTINCT user_id) as count FROM event_signups WHERE status = "attended"')
    ])

    const latestLeads = await database.query(`
      SELECT pl.*, p.title as package_title
      FROM package_leads pl
      LEFT JOIN packages p ON pl.package_id = p.id
      ORDER BY pl.created_at DESC
      LIMIT 5
    `)

    res.json({
      code: 0,
      message: 'success',
      data: {
        stats: {
          uv: uv.count || 0,
          leads: leads.count || 0,
          signups: signups.count || 0,
          ea: ea.count || 0
        },
        latestLeads,
        funnel: [
          { name: '访问', value: 100 },
          { name: '详情', value: 60 },
          { name: '提交', value: 30 },
          { name: '到访', value: 10 }
        ]
      }
    })
  } catch (error) {
    next(error)
  }
}

const getFunnel = async (req, res, next) => {
  try {
    res.json({
      code: 0,
      message: 'success',
      data: []
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getOverview,
  getFunnel
}
