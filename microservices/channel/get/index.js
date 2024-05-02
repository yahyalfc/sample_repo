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
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('requests:', request)

  const { workspace_id } = request.requestContext.authorizer;
  console.log('workspace_id:', workspace_id);

  const { id } = request.pathParameters;
  console.log("id:", id)

  const client = await pool.connect()
  console.log('event: pool.connected')

  try {
    const result = await client.query(`
      SELECT
      channel.id,
      channel.name,
      channel.icon,
      channel.workspace_id,
      json_agg(
        json_build_object(
          'utm_source', utm_condition.utm_source,
          'utm_medium', utm_condition.utm_medium,
          'utm_campaign', utm_condition.utm_campaign,
          'utm_content', utm_condition.utm_content
        )
      ) as conditions
      FROM channel
      LEFT JOIN utm_condition
        ON channel.id = utm_condition.channel_id AND __typename = 'UtmChannel'
      WHERE channel.id = $1
        AND channel.workspace_id = $2
      GROUP BY
        channel.id,
        channel.name,
        channel.icon,
        channel.workspace_id;
    `, [
      id,
      workspace_id,
    ])

    // Not found
    if (result.rows.length === 0) {
      console.log('data: not found')
      callback(null, {
        statusCode: 404,
        headers,
      })

    // Found
    } else {
      console.log('event: lambda.success')
      console.log('data:', result.rows[0])

      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({data: result.rows[0]}),
      })
    }

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


