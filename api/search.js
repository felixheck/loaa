const localizedFormat = require('dayjs/plugin/localizedFormat')
const { WebClient } = require('@slack/web-api');
const qs = require('querystring')
const dayjs = require('dayjs')
const got = require('got')
const assert = require('assert')
require('dotenv').config()

dayjs.extend(localizedFormat)

const { TOKEN, CHANNEL } = process.env

assert(TOKEN, 'Please provide a Slack Bot Token as `TOKEN`')
assert(CHANNEL, 'Please provide a Slack Channel ID as `CHANNEL`')

const baseUrl = 'https://www.hostelworld.com/properties'
const web = new WebClient(TOKEN)

function getBookingStart (dorms) {
  return Object.keys(Object.values(dorms[0].priceBreakdown)[0])[0]
}

function tomorrow (date) {
  return dayjs(date).add(1, 'day').format('YYYY-MM-DD')
}

function fetch (hostel, date) {
  const query = qs.stringify({
    dateFrom: date,
    dateTo: tomorrow(date),
    number_of_guests: 1
  })

  return got(`${baseUrl}/${hostel}/availability?${query}`).json()
}

module.exports = async function (req, res) {
  const dates = (req.query.dates || '').split(',').map(x => x.trim())
  const hostel = req.query.hostel

  if (!hostel) {
    return res.json({ ok: false, message: 'Please pass a hostel identifier'})
  }

  const results = await Promise.all(dates.map(x => fetch(hostel, x)))
    .catch((err) => err.response.statusCode === 404 ? null : [])

  if (!results) {
    return res.json({ ok: false, message: 'Please pass a valid hostel identifier'})
  }

  const available = results.map(result => {
    const { hasAvailability, rooms: { dorms } } = result

    if (!hasAvailability || !dorms.length) return null
    return getBookingStart(dorms)
  }).filter(x => !!x).map(x => dayjs(x).format('ll'))

  if (!available.length) {
    console.info(`No rooms available.`)
    return res.json({ ok: false })
  }

  await web.chat.postMessage({
    text: `Room available at:\n- ${available.join('\n- ')}`,
    channel: CHANNEL,
    icon_emoji: ':house_with_garden:'
  })

  return res.json({ ok: true, available })
}
