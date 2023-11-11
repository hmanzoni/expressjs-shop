# Simple Shop in expressJs
This project is an Express.js e-commerce platform capable of registering users with a confirmation email, creating, editing, and deleting products with images, and simulating payments with credit cards. To run, it utilizes Docker for the Node.js application, MongoDB as the database, Stripe for handling payments, and SendGrid for sending email notifications.

Note: You can switch branches and explore the app using an SQL engine as the database with or without an ORM.

## Requirements

Install Docker following the official guide ~> https://docs.docker.com/engine/install/
Create a MongoDB account in the official website ~> https://www.mongodb.com/
  - Create a database and retrieve the MongoDB URI to connect to the app (used for the ENV variable MONGO_URI).
Create a Stripe account in the official website ~> https://dashboard.stripe.com/register
  - Retrieve the Stripe Key and Secret Key (used for the ENV variables STRIPE_KEY and STRIPE_SECRET).
Create a SendGrid account in the official website ~> https://signup.sendgrid.com/
  - Register a valid sender and obtain the API Key (used for the ENV variables SENDGRID_API_KEY and SENDGRID_VALIDATED_SENDER).

## Getting Started
To get started with this project, you will need:

- Clone this repository:
  ```
  git clone https://github.com/hmanzoni/expressjs-shop.git
  ```
- Fill all the ENV variables on the Dockerfile
- Launch the containers using the command:
  ```
  docker-compose build
  docker-compose up -d
  ```

## Usage

The app is accessible on port 3000. You can reach it by entering `localhost:3000` in your favorite browser. 
Create a new account and sign in; afterward, you will have the ability to create, edit, and delete products. These products will be available for purchase by the public.

## Contributing

Contributions to this project are welcome. Please fork the repository and create a pull request for your changes.

## License

This project is licensed under the MIT License.