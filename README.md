# NestJs_TestTask_Imp
## Installation
```
$ npm install
```
### Docker configuration

```
$  docker-compose up -d
```

### Running migrations

```
$   npm run db:migrate
```


### Running the app

```
$   npm run start
```

### Configure .env file
```
POSTGRES_USER='your user'
POSTGRES_PASSWORD='your password'
POSTGRES_DB='your db'
POSTGRES_HOST='your host'
POSTGRES_PORT='postgres port'
JWT_SECRET='your secret key'
```

## Examples of requests
### Sign-up 
#### First of all, you need to create a user in the database. You can use this endpoint.
### POST
```
http://localhost:3000/users
```
#### Example of body:
```
{
    "user": {
        "username": "user",
        "email": "user@gmail.com",
        "password": "pass"
    }
}
```
#### Example of result
```
{
    "user": {
        "username": "user22322",
        "email": "user22223@gmail.com",
        "password": "$2b$10$OZg1JD0vW1hNLmePMsOb9eQv4MjT8L1j64u3/yTP5pBrxz0srFbTW",
        "id": 8,
        "bio": "",
        "image": "",
        "token": "eyJhbGciOiJIUzI1NiIsInR5"
    }
}
```

### Sign-in
### POST
```
http://localhost:3000/users/login
```
#### Example of body:
```
{
    "user": {
        "email": "user@gmail.com",
        "password": "pass"
    }
}
```

#### Example of result

```
{
    "user": {
        "id": 1,
        "email": "user@gmail.com",
        "username": "user",
        "bio": "",
        "image": "",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX"
    }
}
```
#### You should use this token to add to the header of other requests

### Sign-out
### POST
```
http://localhost:3000/users/logout
```
#### Also add in `Headers` field `Authorization` with `Token eyJhbGciO...`
``` 
--header 'Authorization: Token eyJhbGciOiJIUzI1NiI'
```
#### Example of body:
```
{
    "user": {
        "username": "user",
        "email": "user@gmail.com",
        "password": "pass"
    }
}
```

### Get current user
### GET
```
http://localhost:3000/user
```
#### Also add in `Headers` field `Authorization` with `Token eyJhbGciO...`

#### Example of result

```
{
    "user": {
        "id": 8,
        "email": "user22223@gmail.com",
        "username": "user22322",
        "bio": "",
        "image": "",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik"
    }
}
```