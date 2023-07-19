
# Typescript module

## Prerequisites
- Node v18.16.1
- Ext [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) installed for testing http. Can use Postman for alt.
- MongoDB Community Edtion 6.0.8

## Environments (.env)
- Clone from .env.example and replace with values of choice.
- MAILER config: use default ethereal smtp service or change to using other services of choice.

## Run application

Initialize and setup, run:

`npm install`

To launch in development favor, run script:

`npm run dev`

To launch in a sustainable favor, e.g: production, run:

`npm run build` to compile, then run

`npm start` to serve.