# User and Diamond Management API

This project includes comprehensive API functions to manage user accounts, diamond valuations, authentication features, and payment integrations, utilizing a SQL database for operations such as creating, updating, deleting user data, handling diamond valuation requests, and processing payments.

## Requirements

- Node.js 12.x or higher
- SQL Server 2019 or similar
- npm or Yarn package manager

## Installation

```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
npm install # or 'yarn install' if you use Yarn
```

##Configuration
Configure the database and email service settings in your config file according to your environment.

Running the Application
```bash
npm start # or 'yarn start'
```
##Features
  #User Management
    Create, update, delete, and retrieve user accounts.
    Authenticate and register users, manage login sessions.
    Handle password resets and email notifications for various user actions.
  #Diamond Management
    Add, update, and evaluate diamond details linked with user requests.
  #Request Handling
    Manage and track valuation requests, providing detailed results based on diamond characteristics.
  #Payment Integration
    createPaymentUrl: Generate a payment URL for VNPay gateway including security hashing.
    vnPayReturn: Process return data from VNPay after payment completion.
    vnPayIPN: Handle Instant Payment Notification (IPN) from VNPay to update transaction status.
    queryDR: Query payment details based on transaction reference.
    refund: Process payment refunds through the VNPay gateway.
    paypalRequest: Create a PayPal payment request and retrieve the payment approval URL.
    paypalReturn: Process PayPal payments upon user return from PayPal after payment approval.
##API Documentation
Access the Swagger UI to interact with the API documentation after running the server:
```bash
http://localhost:8080/api-docs
```
