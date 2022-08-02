let res = [
  db.fridges.drop(),
  db.fridges.createIndex({ fridgeId: 1 }),
  db.fridges.insertOne({ fridgeId: 'c7c37a2b-e888-446a-940a-8b848b72a150', customerId: 1 }),
  db.fridges.insertOne({ fridgeId: '50b8c52f-73b9-4cd3-9a2d-cadb4c24cb9f', customerId: 2 }),
  db.fridges.insertOne({ fridgeId: '1336c855-7d67-4615-aa6d-5a372f8cc755', customerId: 2 }),
]

printjson(res)