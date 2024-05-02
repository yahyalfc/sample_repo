INSERT INTO workspaces (id, name, endpoint)
VALUES ('80fe78d8-a25f-4a2d-8473-dc852658d91a', 'My Workspace', 'https://myworkspace.com');

INSERT INTO channel
  ( id, workspace_id, name, icon, __typename)
VALUES
  (
    'd1ee5a3f-f59d-4ee1-874b-34d491dafab0'::uuid,
    '80fe78d8-a25f-4a2d-8473-dc852658d91a'::uuid,
    'My Channel',
    'smile',
    'UtmChannel'
  );

INSERT INTO utm_condition
  (channel_id, utm_source, utm_medium, utm_campaign, utm_content)
VALUES
  (
    'd1ee5a3f-f59d-4ee1-874b-34d491dafab0'::uuid,
    'utm_source_one',
    'utm_medium_one',
    'utm_campaign_one',
    'utm_content_one'
  );
