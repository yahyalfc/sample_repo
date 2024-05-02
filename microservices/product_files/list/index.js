const { Pool } = require('pg')

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Access-Control-Allow-Origin"
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
  connectionTimeoutMillis: 1000,
})


exports.handler = async (request, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  console.log('requests:', request)

  const { workspace_id } = request.requestContext.authorizer
  console.log('workspace_id:', workspace_id)

  const input = request.queryStringParameters
  console.log('limit:', input?.limit);
  console.log('offset:', input?.offset);

  //set default and maximum values for LIMIT and OFFSET
  const DEFAULT_LIMIT = 10
  const MAX_LIMIT = 100
  const DEFAULT_OFFSET = 0
  const MAX_OFFSET = 1000

  // Use provided values for LIMIT and OFFSET, or use default values
  let limit = input.limit || DEFAULT_LIMIT
  let offset = input.offset || DEFAULT_OFFSET

  // Limit and offset values cannot exceed maximum values
  limit = Math.min(limit, MAX_LIMIT)
  offset = Math.min(offset, MAX_OFFSET)

  //log the limit and offset we are setting
  console.log('computed limit:', limit);
  console.log('computed offset:', offset);

  //connect to postgres
  const client = await pool.connect()
  console.log('event: pool.connected')

  try {
    const countQuery = await client.query(
      'SELECT COUNT(*) FROM products WHERE workspace_id = $1',
      [workspace_id]
    )
    
    const total_count = +countQuery.rows[0].count
    console.log('total_count:', total_count)

    const result = await client.query(`
        SELECT p.*, COALESCE(array_agg(json_build_object('id_equal', pc.id_equal, 'description_like', pc.description_like, 'price_min', pc.price_min, 'price_max', pc.price_max)) FILTER (WHERE pc.product_id IS NOT NULL), ARRAY[]::json[]) as product_conditions
        FROM products p
        LEFT JOIN product_conditions pc ON p.id = pc.product_id
        WHERE p.workspace_id = $1
        GROUP BY p.id
        LIMIT $2
        OFFSET $3;
      `,
      [workspace_id, limit, offset]
    )

    
      console.log('data:', result.rows)
      console.log('lambda success:')

      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          data: result.rows,
          limit,
          offset,
          total_count
        }),
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
    //db pool released
    client.release()
  }
}
