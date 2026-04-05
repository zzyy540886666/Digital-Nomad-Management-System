const database = require('../db/database')

// 解析事件数据
const parseEventData = (event) => {
  if (!event) return null
  
  const startTime = new Date(event.start_time)
  const endTime = new Date(event.end_time)
  const now = new Date()
  
  const formatDate = (date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}/${day} ${hours}:${minutes}`
  }
  
  const formatTimeRange = (start, end) => {
    const startStr = formatDate(start)
    const endHours = end.getHours().toString().padStart(2, '0')
    const endMinutes = end.getMinutes().toString().padStart(2, '0')
    return `${startStr}-${endHours}:${endMinutes}`
  }
  
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    coverUrl: event.cover_url,
    description: event.description,
    startTime: formatTimeRange(startTime, endTime),
    startTimeRaw: event.start_time,
    endTimeRaw: event.end_time,
    venuePoiId: event.venue_poi_id,
    venueName: event.venue_name || '待定',
    venueAddress: event.venue_address,
    latitude: event.latitude,
    longitude: event.longitude,
    capacity: event.capacity,
    feeType: event.fee_type,
    feeAmount: event.fee_amount,
    notice: event.notice,
    status: event.status,
    createdAt: event.created_at,
    updatedAt: event.updated_at
  }
}

const Event = {
  getList: async (params = {}) => {
    let sql = `
      SELECT e.*, 
        (SELECT COUNT(*) FROM event_signups es WHERE es.event_id = e.id AND es.status != 'cancelled') as signup_count
      FROM events e
      WHERE e.status = "published"
    `
    const values = []

    if (params.category) {
      sql += ' AND e.category = ?'
      values.push(params.category)
    }

    sql += ' ORDER BY e.start_time ASC'

    let result
    if (params.page && params.pageSize) {
      result = await database.paginate(sql, values, params.page, params.pageSize)
      result.list = result.list.map(event => {
        const parsed = parseEventData(event)
        parsed.signupCount = event.signup_count || 0
        return parsed
      })
      return result
    }

    result = await database.query(sql, values)
    return result.map(event => {
      const parsed = parseEventData(event)
      parsed.signupCount = event.signup_count || 0
      return parsed
    })
  },

  getDetail: async (id) => {
    const event = await database.queryOne('SELECT * FROM events WHERE id = ?', [id])
    if (!event) return null

    const signups = await database.query(`
      SELECT es.*, u.nickname as user_nickname, u.avatar_url as user_avatar
      FROM event_signups es
      LEFT JOIN users u ON es.user_id = u.id
      WHERE es.event_id = ? AND es.status != 'cancelled'
    `, [id])

    const parsed = parseEventData(event)
    parsed.signupList = signups.map(s => ({
      id: s.id,
      userId: s.user_id,
      status: s.status,
      nickname: s.user_nickname,
      avatarUrl: s.user_avatar,
      createdAt: s.created_at
    }))
    parsed.signupCount = signups.length

    return parsed
  },

  signup: async (eventId, userId) => {
    const existing = await database.queryOne(
      'SELECT * FROM event_signups WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    )

    if (existing) {
      if (existing.status === 'cancelled') {
        await database.update('event_signups', { status: 'signed' }, 'id = ?', [existing.id])
        return { id: existing.id }
      }
      throw new Error('已报名该活动')
    }

    const result = await database.insert('event_signups', {
      event_id: eventId,
      user_id: userId,
      status: 'signed',
      created_at: new Date()
    })
    return { id: result.insertId }
  },

  cancel: async (eventId, userId) => {
    await database.update('event_signups', { status: 'cancelled' }, 'event_id = ? AND user_id = ?', [eventId, userId])
  },

  getMySignups: async (userId) => {
    const results = await database.query(`
      SELECT es.*, e.title as event_title, e.cover_url as event_cover_url, e.start_time as event_start_time, e.venue_name
      FROM event_signups es
      LEFT JOIN events e ON es.event_id = e.id
      WHERE es.user_id = ?
      ORDER BY es.created_at DESC
    `, [userId])
    
    return results.map(r => ({
      id: r.id,
      eventId: r.event_id,
      status: r.status,
      eventTitle: r.event_title,
      eventCoverUrl: r.event_cover_url,
      eventStartTime: r.event_start_time,
      venueName: r.venue_name,
      createdAt: r.created_at
    }))
  }
}

module.exports = Event
