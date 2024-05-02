const { handler } = require('./index')

describe('Update test suite', () => {


  test('Update UTM Channel', async () => {
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
      },
      body: JSON.stringify({
        name: 'My Channel two',
        icon: 'smile-two',
        conditions: [
          { utm_source: 'utm_source_three', utm_medium: 'utm_medium_three', utm_campaign: 'utm_campaign_three', utm_content: 'utm_content_three' },
          { utm_source: 'utm_source_four', utm_medium: 'utm_medium_four', utm_campaign: 'utm_campaign_four', utm_content: 'utm_content_four' },
          { utm_source: 'utm_source_five', utm_medium: 'utm_medium_five', utm_campaign: 'utm_campaign_five', utm_content: 'utm_content_five' },
        ]
      })
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(200);
      
    }
    await handler(request, context, callback)
  })

  test('Update UTM Channel - missing icon', async () => {
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
      },
      body: JSON.stringify({
        name: 'Google Search',
        conditions: [
          { utm_source: 'utm_source_three', utm_medium: 'utm_medium_three', utm_campaign: 'utm_campaign_three', utm_content: 'utm_content_three' },
          { utm_source: 'utm_source_four', utm_medium: 'utm_medium_four', utm_campaign: 'utm_campaign_four', utm_content: 'utm_content_four' },
          { utm_source: 'utm_source_five', utm_medium: 'utm_medium_five', utm_campaign: 'utm_campaign_five', utm_content: 'utm_content_five' },
        ]
      })
    }
    const context = {}

    const callback = (err, res) => {
      expect(res.statusCode).toEqual(200);
    }
    await handler(request, context, callback)
  })


test('Update UTM Channel - missing name', async () => {
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
    },
    body: JSON.stringify({
      icon: 'search',
      conditions: [
        { utm_source: 'utm_source_three', utm_medium: 'utm_medium_three', utm_campaign: 'utm_campaign_three', utm_content: 'utm_content_three' },
        { utm_source: 'utm_source_four', utm_medium: 'utm_medium_four', utm_campaign: 'utm_campaign_four', utm_content: 'utm_content_four' },
        { utm_source: 'utm_source_five', utm_medium: 'utm_medium_five', utm_campaign: 'utm_campaign_five', utm_content: 'utm_content_five' },
      ]
    })
  }
  const context = {}

  const callback = (err, res) => {
    expect(res.statusCode).toEqual(200);

  }
  await handler(request, context, callback)
})

test('Update UTM Channel - Channel not found', async () => {
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
    },
    body: JSON.stringify({
      name: 'Google Search',
      icon: 'search',
      conditions: [
        { utm_source: 'utm_source_three', utm_medium: 'utm_medium_three', utm_campaign: 'utm_campaign_three', utm_content: 'utm_content_three' },
        { utm_source: 'utm_source_four', utm_medium: 'utm_medium_four', utm_campaign: 'utm_campaign_four', utm_content: 'utm_content_four' },
        { utm_source: 'utm_source_five', utm_medium: 'utm_medium_five', utm_campaign: 'utm_campaign_five', utm_content: 'utm_content_five' },
      ]
    })
  }
  const context = {}

  const callback = (err, res) => {
    expect(res.statusCode).toEqual(404);

  }
  await handler(request, context, callback)
})

test('Update UTM Channel', async () => {
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
    },
    body: JSON.stringify({
      name: 'My Channel two',
      icon: 'smile-two',
      conditions: []
    })
  }
  const context = {}

  const callback = (err, res) => {
    expect(res.statusCode).toEqual(200);
    
  }
  await handler(request, context, callback)
})

})
