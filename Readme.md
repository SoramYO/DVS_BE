
# 💎 Diamond Valuation API 💎

Welcome to the **Diamond Valuation API**, a robust backend solution crafted to streamline operations in managing user accounts and diamond valuations. This project integrates cutting-edge technology with a SQL database to ensure efficient data handling and enhanced security features.

## 📋 Requirements

- **Node.js**: Version 12.x or higher
- **SQL Server**: 2019 edition or newer
- **Package Manager**: npm or Yarn

## 🚀 Installation

Clone the repository and set up the environment with ease:

```bash
git clone https://github.com/SoramYO/DVS_BE
cd DVS_BE
npm install # or 'yarn install' if you use Yarn
```

## 🔧 Configuration

Efficiently configure the system by adjusting the `config` file and setting up environment variables as follows:

### Environment Variables

Ensure these variables are correctly set in your `.env` file:

```env
PORT=8080
ACCESS_TOKEN_SECRET=your_secret
USER_DATABASE=your_user
PASSWORD_DATABASE=your_password
SERVER_DATABASE=your_server
DATABASE=your_db_name
EMAIL=your_email@example.com
PASSWORD=your_email_password
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## 🌟 Features

### 👤 User Management
- **Create, Update, Delete**: Fully manage user accounts.
- **Authentication**: Robust session management and user authentication.
- **Password Resets and Notifications**: Efficient handling of password security and email notifications.

### 💎 Diamond Management
- **Valuation and Tracking**: Update and assess diamond information seamlessly.

### 📝 Request Handling
- **Service Requests**: Manage and oversee valuation requests ensuring detailed results.

### 💳 Payment Integration
- **Secure Transactions**: Leverage VNPay and PayPal for secure financial transactions.

## 📚 API Documentation

Explore our comprehensive API documentation to get started:

```url
http://localhost:8080/api-docs
```

## 🤝 Contributing

Join our vibrant community! We encourage contributions that help us improve and evolve:

- **Submit Pull Requests**
- **Open Issues**
- **Provide Feedback**

## 📄 License

This project is protected under the MIT License - for more details see the [LICENSE](LICENSE) file.

## 👥 Contributors

- **[SoramYO](https://github.com/SoramYO)** - Project Lead
- **[ductain](https://github.com/ductain)** - Principal Developer

---

Thank you for using the User and Diamond Management API! If you have any questions or need further assistance, feel free to reach out.
