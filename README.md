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
- A Branch Manager table tracks who’s managing each branch and when.