INSERT INTO workspaces (id, name, endpoint)
VALUES ('1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec', 'My Workspace', 'https://myworkspace.com');

-- products
INSERT INTO products (id, name, workspace_id)
VALUES ('752b9788-b83d-11ed-afa1-0242ac120002', 'My Product Two', '1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec');

INSERT INTO product_conditions(product_id, price_min, price_max, id_equal, description_like)
VALUES ('752b9788-b83d-11ed-afa1-0242ac120002', 10, 20, 'id_equal', 'description_like' );

INSERT INTO product_conditions(product_id, price_min, price_max, id_equal, description_like)
VALUES ('752b9788-b83d-11ed-afa1-0242ac120002', 14, 24, 'id_equal-2', 'description_like-2' );

INSERT INTO products (id, name, workspace_id)
VALUES ('b51f0d0a-b790-11ed-afa1-0242ac120001', 'My Product One', '1b9d6bcd-bbfd-4b1d-9b05-ab8dfbbd4bec');

-- Workspace with no products 
INSERT INTO workspaces (id, name, endpoint)
VALUES ('8c6266b6-b83d-11ed-afa1-0242ac120002', 'My Workspace', 'https://myworkspace.com');