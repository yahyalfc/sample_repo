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

  const { workspace_id } = request.requestContext.authorizer
  console.log('workspace_id:', workspace_id)

  const { id } = request.pathParameters
  console.log('id:', id)

  const { name, icon, conditions } = JSON.parse(request.body)
  console.log("name", name)
  console.log("icon", icon)
  console.log("conditions", conditions)

  const client = await pool.connect()
  console.log('event: pool.connected')

  try {
    // Get channel
    const getChannel = await client.query(`
        SELECT id from channel where id = $1 and __typename = 'UtmChannel';
      `,
      [ id ]
    )

    // Channel Not found
    if (getChannel.rowCount === 0) {
      console.log('event: data not found')
      callback(null, {
        statusCode: 404,
        headers,
      })
    }
    
    // Channel Found
    else {
      const result = await client.query(`
        WITH updated_channel AS (
          UPDATE public.channel
          SET
            "name" = COALESCE($2, "name"), -- If $2 is null, use the current value in the database
            "icon" = COALESCE($3, "icon")  -- If $3 is null, use the current value in the database
          WHERE
            id = $1 and __typename = 'UtmChannel'
          RETURNING
            id,
            workspace_id,
            name,
            icon
        ),
        deleted_utm_conditions AS (
          DELETE FROM public.utm_condition
          WHERE channel_id = (SELECT id FROM updated_channel)
          AND jsonb_array_length($4::jsonb) > 0 -- Check if conditions are provided
        )
        INSERT INTO utm_condition (channel_id, utm_source, utm_campaign, utm_medium, utm_content)
        SELECT
          (SELECT id FROM updated_channel),
          c.utm_source,
          c.utm_campaign,
          c.utm_medium,
          c.utm_content
        FROM
          jsonb_to_recordset($4::jsonb) AS c(utm_source text, utm_campaign text, utm_medium text, utm_content text)
          WHERE jsonb_array_length($4::jsonb) > 0 -- Check if conditions are provided
        RETURNING
          (SELECT id FROM updated_channel),
          (SELECT workspace_id FROM updated_channel),
          (SELECT name FROM updated_channel),
          (SELECT icon FROM updated_channel);
      `, [
        id,
        name,
        icon,
        JSON.stringify(conditions)
      ])

      console.log('data:', result.rows[0])
    
      const conditionsQuery = await client.query(`
          SELECT utm_source, utm_campaign, utm_medium, utm_content
          FROM utm_condition
          WHERE channel_id = $1
        `,
        [ id ]
      )

      const conditionsArray = conditionsQuery.rows
      console.log("inserted Conditions:", conditionsArray)

      console.log('event: lambda.success')

      callback(null, {
        statusCode: 200,
        headers,
        // body: JSON.stringify({data: {...result.rows[0], conditions: conditionsArray}})
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
