const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'tables.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//Post Transaction API
app.post('/transactions/', async (request, response) => {
  const transactionDetails = request.body
  const {id, type, category, amount, date, description} = transactionDetails
  const addTransactionQuery = `INSERT INTO
  transactions (id, type, category, amount, date, description)
  VALUES
  (
  ${id},
  '${type}',
  '${category}',
  ${amount},
  '${date}',
  '${description}'
  );`

  const dbResponse = await db.run(addTransactionQuery)
  const transactionId = dbResponse.lastID
  response.send({transactionId: transactionId})
})

// Get Transactions API
app.get('/transactions/', async (request, response) => {
  const {offset = 0, limit = 10, order = 'ASC', order_by = 'id'} = request.query
  const getTransactionsQuery = `SELECT
      *
    FROM
      transactions
    ORDER BY
      ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset};
    `
  const transactionsArray = await db.all(getTransactionsQuery)
  response.send(transactionsArray)
})

//Get Transaction API
app.get('/transactions/:id/', async (request, response) => {
  const {id} = request.params
  const getTransactionQuery = `SELECT
      *
    FROM
      transactions
    WHERE
      id = ${id};`
  const transaction = await db.get(getTransactionQuery)
  response.send(transaction)
})

//Put Transaction API
app.put('/transactions/:id/', async (request, response) => {
  const {id} = request.params
  const transactionDetails = request.body
  const {type, category, amount, date, description} = transactionDetails
  const updateTransactionQuery = `UPDATE
      transactions
    SET
      type = '${type}',
      category = '${category}',
      amount = ${amount},
      date = '${date}',
      description = '${description}'
    WHERE
      id = ${id};`
  await db.run(updateTransactionQuery)
  response.send('Transaction Updated Successfully')
})

//Delete Transaction API
app.delete('/transactions/:id/', async (request, response) => {
  const {id} = request.params
  const deleteTransactionQuery = `DELETE FROM 
      transactions
    WHERE
      id = ${id};`
  await db.run(deleteTransactionQuery)
  response.send('Transaction Deleted Successfully')
})

// Summary API
app.get('/Summary/', async (request, response) => {
  const getSummaryQuery = `
  SELECT
  (
    SELECT
      SUM(amount)
    FROM
      transactions
    WHERE
      TYPE = 'Income'
  ) AS total_income,
  (
    SELECT
      SUM(amount)
    FROM
      transactions
    WHERE
      TYPE = 'Expense'
  ) AS total_expenses
FROM
  transactions
LIMIT
  1;
    `
  const summaryArray = await db.all(getSummaryQuery)
  response.send(summaryArray)
})


// Register API
app.post('/user/', async (request, response) => {
  const {username, name, password, gender, location} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `
    SELECT * FROM user WHERE username = '${username}'
  `
  const dbUser = await db.get(selectUserQuery)

  if (dbUser === undefined) {
    const createUserQuery = `
  INSERT INTO
    user (username, name, password, gender, location)
  VALUES
    (
      '${username}',
      '${name}',
      '${hashedPassword}',
      '${gender}',
      '${location}'  
    );`
    await db.run(createUserQuery)
    response.send('User Created Successfully')
  } else {
    response.status(400)
    response.send('User Already Exists')
  }
})

//login API
app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const selectUserQuery = `
    SELECT * FROM user WHERE username = '${username}'
  `
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid User')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      const payload = {username: username}
      const jwtToken = jwt.sign(payload, 'newstring')
      response.send(jwtToken)
    } else {
      response.status(400)
      response.send('Invalid Password')
    }
  }
})


// Get Transactions API with Authentication
app.get('/transactions/', async (request, response) => {
  const authHeader = request.headers['authorization']
  let jwtToken
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (authHeader === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'newstring', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        const getTransactionsQuery = `
          SELECT
            *
          FROM
            transactions
          ORDER BY
            id;`
        const transactionsArray = await db.all(getTransactionsQuery)
        response.send(transactionsArray)
      }
    })
  }
})
