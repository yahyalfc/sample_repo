const { handler } = require('./index')

describe('List test suite', () => {
  test('List products', async () => {
    const workspace_id = '1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec'

    const request = {
      requestContext: {
        authorizer: {
          workspace_id,
        },
      },
      queryStringParameters: {
        limit: 10,
        offset: 0
      }
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(200)
      const body = JSON.parse(res.body)
      const { data, limit, offset, total_count } = body;
      expect(limit).toEqual(10)
      expect(offset).toEqual(0)
      expect(total_count).toEqual(2)

      expect(data).toEqual([
        {
          "name": "My Product Two",
          "workspace_id": "1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec",
          "id": "752b9788-b83d-11ed-afa1-0242ac120002",
          "product_conditions": [
            {
              "id_equal": "id_equal",
              "description_like": "description_like",
              "price_min": 10,
              "price_max": 20
            },
            {
              "id_equal": "id_equal-2",
              "description_like": "description_like-2",
              "price_min": 14,
              "price_max": 24
            }
          ]
        },
        {
          "name": "My Product One",
          "workspace_id": "1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec",
          "id": "b51f0d0a-b790-11ed-afa1-0242ac120001",
          "product_conditions": []
        }
      ])
    }

    await handler(request, context, callback)
  })


  test('Products not found', async () => {
    const workspace_id = '8c6266b6-b83d-11ed-afa1-0242ac120002'

    const request = {
      requestContext: {
        authorizer: {
          workspace_id,
        },
      },
      queryStringParameters: {
        limit: 10,
        offset: 0
      }
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(200)
      const body = JSON.parse(res.body)
      const { data, limit, offset, total_count } = body;
      expect(limit).toEqual(10)
      expect(offset).toEqual(0)
      expect(total_count).toEqual(0)
      expect(data).toEqual([])
    }

    await handler(request, context, callback)
  })

})
