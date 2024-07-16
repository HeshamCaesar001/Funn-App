# FunApp

FunApp is an Egyptian web application that has a simple sign-up process. The application only accepts sign-ups from phones located in Egypt. This project demonstrates the backend implementation using NestJS, TypeScript, and MariaDB.

## Technologies Used

- **Backend Framework:** NodeJS
- **Language:** TypeScript
- **Server Framework:** NestJS
- **Database:** MariaDB
- **Testing Framework:** Jest
- **API Documentation:** Postman

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v12.x or higher)
- [npm](https://www.npmjs.com/get-npm) (v6.x or higher)
- [MariaDB](https://mariadb.org/download/)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/funapp.git
   cd funapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment variables:**
   Create a `.env` file in the root of the project and add your database configuration:
   ```dotenv
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   API_KEY = you_google_map_api_key
   SECRET_KEY = you_secret_key
   ```


## Running the Application

To start the application, run:
```bash
npm run start:dev
```

The application should be running on `http://localhost:3000`.

## API Endpoints

### Get Profile Data
**GET** `/user?user_id=<user_id>`

Retrieve user profile data by user ID.

#### QueryString
- `id` (string, required): The ID of the user.

#### Response
```json
{
  "id": 1,
  "name": "Hesham Sayed",
  "email": "hesham@example.com",
  "city": "Cairo"
}
```

### Sign Up
**POST** `/user/signUp`

Sign up a new user.

#### Body Parameters
- `name` (string, required): The name of the user.
- `email` (string, required): The email of the user.
- `password` (string,required): The password of the user.
- `latitude` (number, required): The latitude of the user's location.
- `longitude` (number, required): The longitude of the user's location.

#### Response
```json
{
  "id": 1,
  "name": "Hesham Sayed",
  "email": "hesham@example.com",
  "city": "Cairo"
}
```

## Testing

To run the tests, use:
```bash
npm run test
```

## API Documentation

The API is documented using Postman on (`https://documenter.getpostman.com/view/24948177/2sA3kRJ48j`).And you can access it on funApp.html.

## Sample Data

You can add sample data to the MariaDB database to test the application. Here is an example of how to insert a user record:

```sql
INSERT INTO user (name, email, city) VALUES ('Hesham Sayed', 'hesham@example.com', 'Cairo');
```