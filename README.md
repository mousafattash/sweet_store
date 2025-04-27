# SweetStore

## Project Idea
SweetStore is a management system for a sweet shop chain. It helps handle everything—customers, employees, products, inventory, orders, payments, and branch operations—all in one place.

## Project Details

### People Management
- One main table for all people (`People`).
- Employees have extra info like role, salary, and shifts.
- Customers can save multiple addresses (billing & shipping).

### Product & Inventory
- Products are made from raw materials.
- A Bill of Materials table connects products to the materials they need.
- Raw materials are stored at branches or in a central warehouse.
- Vendors are tracked for all raw material purchases.

### Orders & Payments
- Orders can include multiple products.
- Each order has payment info (method, status, amount).
- Shipping info is also stored (method, tracking number, delivery estimate).

### Branches & Employees
- Each branch has its own expenses like electricity, water, and maintenance.
- Employees work in branches on shifts.
- A Branch Manager table tracks who's managing each branch and when.

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MySQL/PostgreSQL**: Database (configured in .env)
- **JWT**: Authentication and authorization
- **Joi**: Request validation
- **Bcrypt**: Password hashing

## Project Structure

```
src/
├── index.js                # Application entry point
├── index.router.js         # Main router that connects all module routers
├── middleware/            
│   └── catchError.js       # Global error handling
├── modules/               
│   ├── branch/            
│   │   ├── branch.controller.js
│   │   ├── branch.router.js
│   │   └── branch.validation.js
│   ├── employee/          
│   │   ├── employee.controller.js
│   │   ├── employee.router.js
│   │   └── employee.validation.js
│   ├── inventory/         
│   │   ├── inventory.controller.js
│   │   ├── inventory.router.js
│   │   └── inventory.validation.js
│   ├── order/             
│   │   ├── order.controller.js
│   │   ├── order.router.js
│   │   └── order.validation.js
│   ├── product/           
│   │   ├── product.controller.js
│   │   ├── product.router.js
│   │   └── product.validation.js
│   └── user/              
│       ├── user.controller.js
│       ├── user.router.js
│       └── user.validation.js
DB/
└── connection.js          # Database connection setup
```

## API Documentation

A complete Postman collection is included in the project. Import `postman_collection.json` into Postman to explore all available endpoints.

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

Most endpoints require authentication. After logging in, include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

### Main Endpoints

#### Users
- `POST /users/register` - Register a new user
- `POST /users/login` - User login
- `PATCH /users/profile` - Update user profile
- `PATCH /users/change-password` - Change password
- `POST /users/forgot-password` - Request password reset
- `POST /users/reset-password/:token` - Reset password with token

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Orders
- `POST /orders` - Create a new order
- `GET /orders/:id` - Get order by ID
- `PATCH /orders/:id` - Update order status
- `GET /orders/user` - Get current user's orders

#### Employees
- `POST /employees` - Create a new employee
- `GET /employees/:id` - Get employee by ID
- `PATCH /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

#### Branches
- `GET /branches` - Get all branches
- `GET /branches/:id` - Get branch by ID
- `POST /branches` - Create a new branch
- `PATCH /branches/:id` - Update branch

#### Inventory
- `POST /inventory` - Update inventory levels
- `GET /inventory/branch/:branch_id` - Get inventory by branch
- `GET /inventory/material/:material_id` - Get inventory by material

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL or PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/sweet_store.git
   cd sweet_store
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=sweet_store
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   NODE_ENV=development
   ```

4. Start the server
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error message details"
}
```

## Validation

All input data is validated using Joi validation schemas before processing.