const { Pool } = require('pg')

//init DB
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

//lamba start
exports.handler = async (request, context, callback) => {
  //prevent lambda from running endlessly
  context.callbackWaitsForEmptyEventLoop = false
  console.log('request:', request)

  //arguments through authorizer
  const { workspace_id } = request.requestContext.authorizer
  console.log('workspace_id:', workspace_id)

  //arguments through body
  const { name, product_conditions } = JSON.parse(
    request.body
  )
  console.log('name', name)
  console.log('product_conditions', product_conditions)

  //connect to postgres
  const client = await pool.connect()
  console.log('event: pool.connected')

  try {
    const validProperties = ['id_equal', 'description_like', 'price_max', 'price_min'];
    const isValid = product_conditions.every(condition => validProperties.every(prop => condition.hasOwnProperty(prop)));
    //conditions on the product_conditions
    if (!product_conditions.length) throw new Error('form conditions cant be empty');
    if (!isValid) throw new Error('Invalid properties in product_conditions');

    const result = await client.query(`
      WITH new_product AS (
        INSERT INTO products (workspace_id, name)
        VALUES ($1, $2)
        RETURNING id, workspace_id, name
      )
      INSERT INTO product_conditions (product_id, price_min, price_max, description_like, id_equal)
      SELECT
        new_product.id,
        c.price_min::integer,
        c.price_max::integer,
        c.description_like,
        c.id_equal
      FROM
        jsonb_to_recordset($3::jsonb) AS c(price_min text, price_max text, description_like text, id_equal text),
        new_product
      RETURNING
        (SELECT id FROM new_product),
        (SELECT workspace_id FROM new_product),
        (SELECT name FROM new_product);
      `, [
          workspace_id,
          name,
          JSON.stringify(product_conditions),
        ]);

        console.log('data:', result.rows[0]);

    const productId = result.rows[0].id;
    // Now, you can fetch the conditions for the inserted channel

    const conditionsQuery = await client.query(`
      SELECT price_min, price_max, description_like, id_equal
      FROM product_conditions
      WHERE product_id = $1
      `, [productId]);

    const conditionsArray = conditionsQuery.rows;
    console.log("inserted Conditions:", conditionsArray);
  
      //person added
      console.log('event: lambda.success')
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type"
        },
        body: JSON.stringify({data: {...result.rows[0], product_conditions: conditionsArray}})
      })
  } catch (e) {
    console.log('event: lambda.error')
    console.error(e)
    callback(e, {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type"
      },
    })
  } finally {
    console.log('event: client.release')
    //db pool released
    client.release()
  }
}
