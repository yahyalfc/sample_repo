const { handler } = require('./index')

describe('Add test suite', () => {

  test('Add product', async () => {
    const workspace_id = '1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec' //workspaceId
    const name = 'product one'
    const product_conditions = [
      { description_like: 'description_like_1', price_min: 1, price_max: 2, id_equal: 'id_equal_1' },
      { description_like: 'description_like_2', price_min: 3, price_max: 4, id_equal: 'id_equal_2' }
    ]

    const request = {
      requestContext: {
        authorizer: {
          workspace_id
        },
      },
      body: JSON.stringify({
        name,
        product_conditions,
      }),
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(200)
      const {data} = JSON.parse(res.body);
      console.log({data});
      expect(data.workspace_id).toEqual('1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec');
      expect(data.name).toEqual('product one');
      expect(data.product_conditions).toEqual([
        {
          description_like: 'description_like_1',
          price_min: 1,
          price_max: 2,
          id_equal: 'id_equal_1'
        },
        {
          description_like: 'description_like_2',
          price_min: 3,
          price_max: 4,
          id_equal: 'id_equal_2'
        }
      ]);
    }
    await handler(request, context, callback)
  })

  
  test('Add product - empty product_conditions', async () => {
    const workspace_id = '1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec' //workspaceId
    const name = 'product one'
    const product_conditions = []

    const request = {
      requestContext: {
        authorizer: {
          workspace_id
        },
      },
      body: JSON.stringify({
        name,
        product_conditions,
      }),
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(500)
    }
    await handler(request, context, callback)
  })

  test('Add product - wrong properties in product_conditions', async () => {
    const workspace_id = '1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec' //workspaceId
    const name = 'product one'
    const product_conditions = [
      { one: 'description_like_1', two: 1, three: 2, four: 'id_equal_1' },
    ]

    const request = {
      requestContext: {
        authorizer: {
          workspace_id
        },
      },
      body: JSON.stringify({
        name,
        product_conditions,
      }),
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(500)
    }
    await handler(request, context, callback)
  })

})
