# Express Rest API

## 🚀Installation
- Clone this repository
  - `git clone https://github.com/Yadija/express-rest-api-mysql-prisma.git`
- Install dependencies
  - `npm install`

## 📝Setup Environment
- Create a `.env` file and copy the code below
```
# SERVER configuration
HOST=<hostname (e.g localhost)>
PORT=<port (e.g 5000)>

# PRISMA configuration
DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database_name>"

# TOKENIZE
ACCESS_TOKEN_KEY=<random string>
REFRESH_TOKEN_KEY=<random string>
ACCESS_TOKEN_AGE=<(e.g 10m)>
```
  #### Note: `random strings must be different from each other`
- Create random strings with node
  - `node`
  - `require('crypto').randomBytes(64).toString('hex');`
  - `.exit` to exit

## 📄Setup Database
- Create a mysql database named `express_restapi`
- Migration
  - `npx prisma migrate dev`

## 🔭Running App
- Running API
  - `npm start`

## 🚅Testing App
- Testing
  - `npm test`