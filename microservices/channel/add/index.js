const { Pool } = require('pg')

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type"
}

const pool = new Pool({
  user: process.env.RDS_USER,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB,
  password: process.env.RDS_PW,
  port: process.env.RDS_PORT,
  max: 1,
  min: 0,
  idleTimeoutMillis: 300000,
  connectionTimeoutMillis: 1000
})

exports.handler = async (request, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  console.log('request:', request)

  const { workspace_id } = request.requestContext.authorizer
  console.log('workspace_id:', workspace_id)

  const { name, icon, conditions } = JSON.parse(request.body)
  console.log('name', name)
  console.log('icon', icon)
  console.log('conditions', conditions)

  const client = await pool.connect()
  console.log('event: pool.connected')

  try {
    const validProperties = [
      'utm_source',
      'utm_campaign',
      'utm_medium',
      'utm_content'
    ]

    const isValid = conditions.every(
      condition => validProperties.every(
        prop => condition.hasOwnProperty(prop)
      )
    )

    if (!conditions.length)
      throw new Error('utm conditions cant be empty')

    if (!isValid)
      throw new Error('Invalid properties in utm conditions')

    //insert into the utm channel table
    const result = await client.query(`
      WITH new_channel AS (
        INSERT INTO channel (workspace_id, name, icon, __typename)
        VALUES ($1, $2, $3, 'UtmChannel')
        RETURNING id, workspace_id, name, icon
      )
      INSERT INTO utm_condition (channel_id, utm_source, utm_campaign, utm_medium, utm_content)
      SELECT
        new_channel.id,
        c.utm_source,
        c.utm_campaign,
        c.utm_medium,
        c.utm_content
      FROM
        jsonb_to_recordset($4::jsonb) AS c(utm_source text, utm_campaign text, utm_medium text, utm_content text),
        new_channel
      RETURNING
        (SELECT id FROM new_channel),
        (SELECT workspace_id FROM new_channel),
        (SELECT name FROM new_channel),
        (SELECT icon FROM new_channel);
      `,
      [
        workspace_id,
        name,
        icon,
        JSON.stringify(conditions),
      ]
    )

    console.log('data:', result.rows[0])

    const channelId = result.rows[0].id

    // Now fetch conditions for inserted channel
    const conditionsQuery = await client.query(`
      SELECT
        utm_source,
        utm_campaign,
        utm_medium,
        utm_content
      FROM utm_condition
      WHERE channel_id = $1
      `,
      [ channelId ]
    )

    const conditionsArray = conditionsQuery.rows
    console.log("inserted Conditions:", conditionsArray)

    console.log('event: lambda.success')
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: {
          ...result.rows[0],
          conditions: conditionsArray
        }
      })
    })

  } catch (e) {
    console.log('event: lambda.error')
    console.error(e)
    callback(e, {
      statusCode: 500,
      headers,
    })

  } finally {
    console.log('event: client.release')
    client.release()
  }
}
