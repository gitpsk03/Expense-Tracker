Setup:
Run these in terminal:

1. npm install express --save
2. npm install sqlite --save
3. npm install sqlite3 --save
4. npm install -g nodemon
5. npm install bcrypt --save
6. npm install jsonwebtoken
7. nodemon 'INDEX_JS_FILE'

# API Documentation

## Overview

This API allows users to manage transactions and retrieve summaries of their financial activities.

## Authentication

All requests must include an API key in the headers.

````

## Endpoints

### 1. Create a Transaction
- **Endpoint**: `POST /transactions`
- **Description**: Creates a new transaction.
- **Request Body** (JSON):
  ```json
  {
    "amount": "number",
    "date": "string (YYYY-MM-DD)",
    "description": "string"
  }
````

- **Response**:
  - **Success**:
    - **Status Code**: `201 Created`
    - **Response Body**:
      ```json
      {
        "id": "string",
        "amount": "number",
        "date": "string (YYYY-MM-DD)",
        "description": "string"
      }
      ```
  - **Error**:
    - **Status Code**: `400 Bad Request`
    - **Response Body**:
      ```json
      {
        "error": "string"
      }
      ```

### 2. Retrieve All Transactions

- **Endpoint**: `GET /transactions`
- **Description**: Retrieves a list of all transactions.
- **Response**:
  - **Success**:
    - **Status Code**: `200 OK`
    - **Response Body**:
      ```json
      [
        {
          "id": "string",
          "amount": "number",
          "date": "string (YYYY-MM-DD)",
          "description": "string"
        }
      ]
      ```

### 3. Retrieve a Transaction by ID

- **Endpoint**: `GET /transactions/:id`
- **Description**: Retrieves a specific transaction by its ID.
- **Response**:
  - **Success**:
    - **Status Code**: `200 OK`
    - **Response Body**:
      ```json
      {
        "id": "string",
        "amount": "number",
        "date": "string (YYYY-MM-DD)",
        "description": "string"
      }
      ```
  - **Error**:
    - **Status Code**: `404 Not Found`
    - **Response Body**:
      ```json
      {
        "error": "Transaction not found"
      }
      ```

### 4. Update a Transaction

- **Endpoint**: `PUT /transactions/:id`
- **Description**: Updates an existing transaction.
- **Request Body** (JSON):
  ```json
  {
    "amount": "number",
    "date": "string (YYYY-MM-DD)",
    "description": "string"
  }
  ```
- **Response**:
  - **Success**:
    - **Status Code**: `200 OK`
    - **Response Body**:
      ```json
      {
        "id": "string",
        "amount": "number",
        "date": "string (YYYY-MM-DD)",
        "description": "string"
      }
      ```
  - **Error**:
    - **Status Code**: `404 Not Found`
    - **Response Body**:
      ```json
      {
        "error": "Transaction not found"
      }
      ```

### 5. Delete a Transaction

- **Endpoint**: `DELETE /transactions/:id`
- **Description**: Deletes a specific transaction by its ID.
- **Response**:
  - **Success**:
    - **Status Code**: `204 No Content`
  - **Error**:
    - **Status Code**: `404 Not Found`
    - **Response Body**:
      ```json
      {
        "error": "Transaction not found"
      }
      ```

### 6. Retrieve Summary of Transactions

- **Endpoint**: `GET /summary`
- **Description**: Retrieves a summary of transactions (e.g., total amount, number of transactions).
- **Response**:
  - **Success**:
    - **Status Code**: `200 OK`
    - **Response Body**:
      ```json
      {
        "total_transactions": "number",
        "total_amount": "number"
      }
      ```
