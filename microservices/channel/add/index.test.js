const { handler } = require('./index')
const { v4: uuid_v4, validate: uuidValidate } = require('uuid')

describe('Add test suite', () => {
  const workspace_id = "80fe78d8-a25f-4a2d-8473-dc852658d91a"
  
  
  test('Add channel utm', async () => {
    const name = "google search";
    const icon = "search";
    const conditions = [
      { utm_source: "utm_source_one", utm_campaign: "utm_campaign_one", utm_medium: "utm_medium_one", utm_content: "utm_content_one" },
      { utm_source: "utm_source_two", utm_campaign: "utm_campaign_two", utm_medium: "utm_medium_two", utm_content: "utm_content_two" },
      { utm_source: "utm_source_three", utm_campaign: "utm_campaign_three", utm_medium: "utm_medium_three", utm_content: "utm_content_three" },
    ];

    const request = {
      requestContext: {
        authorizer: {
          workspace_id
        }
      },

      body: JSON.stringify({
        name,
        icon,
        conditions
      })
    }
    const context = {}

    const callback = (err, res) => {
      const body = JSON.parse(res.body);
      const {data} = body;
      // responses
      expect(res.statusCode).toEqual(200)
      expect(uuidValidate(data.id)).toBeTruthy()
      expect(uuidValidate(data.workspace_id)).toBeTruthy()

      expect(data.name).toEqual(name)
      expect(data.icon).toEqual(icon)
      expect(data.conditions.length).toEqual(3)
      expect(data.conditions).toEqual(conditions)
    }
    await handler(request, context, callback)
  })
  
 
  test('Add channel utm - empty conditions', async () => {
    const name = "google search";
    const icon = "search";
    const conditions = [];

    const request = {
      requestContext: {
        authorizer: {
          workspace_id
        }
      },

      body: JSON.stringify({
        name,
        icon,
        conditions
      })
    }
    const context = {}

    const callback = (err, res) => {
      // responses
      expect(res.statusCode).toEqual(500)
    }
    await handler(request, context, callback)
  })
  
  
  test('Add channel utm - wrong properties in conditions', async () => {
    const name = "google search";
    const icon = "search";
    const conditions = [
      { utm_source_one: "utm_source_one", utm_campaign_one: "utm_campaign_one", utm_medium_one: "utm_medium_one", utm_content_one: "utm_content_one" }
    ];

    const request = {
      requestContext: {
        authorizer: {
          workspace_id
        }
      },

      body: JSON.stringify({
        name,
        icon,
        conditions
      })
    }
    const context = {}

    const callback = (err, res) => {
      
      expect(res.statusCode).toEqual(500)
    }
    await handler(request, context, callback)
  })
  
})
