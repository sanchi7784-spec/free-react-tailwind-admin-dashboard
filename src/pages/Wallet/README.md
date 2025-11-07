# Wallet Management

This folder contains components for managing user wallets in the dashboard.

## Components

### AllWallets.tsx
- **Purpose**: Displays a comprehensive list of all user wallets with their currency information and balances
- **Route**: `/wallet/all`
- **Features**:
  - Sortable table columns (Date, User, Currency, Currency Symbol, Balance)
  - User links to edit customer details
  - Responsive design with Tailwind CSS
  - Dark mode support
  - Pagination controls
  - Hover effects on table rows

## Usage

Navigate to the Wallets page through:
- **Sidebar**: Transactions → Wallets
- **Direct URL**: `/wallet/all`

## Data Structure

```typescript
interface Wallet {
  id: number;
  date: string;
  user: string;
  userId: number;
  currency: string;
  currencySymbol: string;
  balance: string;
}
```

## Features

1. **Sortable Headers**: Click on column headers to sort data
2. **User Navigation**: Click on usernames to view/edit user details
3. **Pagination**: Navigate through multiple pages of wallet data
4. **Responsive Design**: Works on all screen sizes
5. **Dark Mode**: Automatically adapts to theme preference

## Styling

The component uses Tailwind CSS with the following key features:
- Responsive table layout with horizontal scroll on mobile
- Hover states for better UX
- Dark mode color scheme
- Clean, modern design matching the dashboard aesthetic
