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
      WITH del_one AS (
        DELETE FROM public.utm_condition WHERE channel_id = $1
        RETURNING channel_id
      ),
      del_two AS (
        DELETE FROM public.channel WHERE id = $1 and workspace_id = $2
        RETURNING id
      )
      SELECT * FROM del_one, del_two;
    `
      , [id, workspace_id]);

    if (result.rowCount) {
      console.log('event: lambda.success')
      callback(null, {
        statusCode: 200,
        headers,
      })
    } else {
      console.log('event: lambda.404')
      callback(null, {
        statusCode: 404,
        headers,
      })
    }
    
  } catch (e) {
    console.log('event: lambda.error')
    //error happened and we rollback the data
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
