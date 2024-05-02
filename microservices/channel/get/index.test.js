const { handler } = require('./index')
const { Pool } = require('pg')

describe('Get test suite', () => {

  test('UTM channel found', async () => {
    const workspace_id = '80fe78d8-a25f-4a2d-8473-dc852658d91a'
    const id = 'd1ee5a3f-f59d-4ee1-874b-34d491dafab0'

    const request = {
      requestContext: {
        authorizer: {
          workspace_id,
        }
      },
      pathParameters: {
        id
      }
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(200)
      const body = JSON.parse(res.body);
      const {data} = body;
      
      expect(data).toEqual({
        id: 'd1ee5a3f-f59d-4ee1-874b-34d491dafab0',
        name: 'My Channel',
        icon: 'smile',
        workspace_id: '80fe78d8-a25f-4a2d-8473-dc852658d91a',
        conditions: [
          {
            utm_source: 'utm_source_one',
            utm_medium: 'utm_medium_one',
            utm_campaign: 'utm_campaign_one',
            utm_content: 'utm_content_one'
          },
          {
            utm_source: 'utm_source_two',
            utm_medium: 'utm_medium_two',
            utm_campaign: 'utm_campaign_two',
            utm_content: 'utm_content_two'
          }
        ]
      });
    }

    await handler(request, context, callback)
  })

  test('UTM channel found - wrong id', async () => {
    const workspace_id = '80fe78d8-a25f-4a2d-8473-dc852658d91a'
    const id = 'd1ee5a3f-f59d-4ee1-874b-34d491dafab1'

    const request = {
      requestContext: {
        authorizer: {
          workspace_id,
        }
      },
      pathParameters: {
        id
      }
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(404)
    }
    await handler(request, context, callback)
  })

  test('UTM channel found - wrong workspace_id', async () => {
    const workspace_id = '80fe78d8-a25f-4a2d-8473-dc852658d91b'
    const id = 'd1ee5a3f-f59d-4ee1-874b-34d491dafab0'

    const request = {
      requestContext: {
        authorizer: {
          workspace_id,
        }
      },
      pathParameters: {
        id
      }
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(404)
    }
    await handler(request, context, callback)
  })
})
