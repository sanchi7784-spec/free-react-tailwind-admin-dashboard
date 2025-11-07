# Wallet Management

This folder contains components for managing user wallets and virtual cards in the dashboard.

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

### VirtualCards.tsx
- **Purpose**: Displays and manages virtual cards with top-up and activation features
- **Route**: `/wallet/virtual-cards`
- **Features**:
  - Sortable table columns (Date, User, Card No., Expiry, Balance)
  - Advanced filtering (search by user/card number, filter by status)
  - Top-up modal for adding/subtracting card balance
  - Activate/Deactivate cards with visual status indicators
  - User links to edit customer details
  - Responsive design with Tailwind CSS
  - Dark mode support
  - Pagination controls
  - Real-time filtering

## Usage

Navigate to the Wallet pages through:
- **Sidebar**: Transactions → Wallets (for All Wallets)
- **Sidebar**: Transactions → Virtual Cards (for Virtual Cards)
- **Direct URLs**: 
  - `/wallet/all` (All Wallets)
  - `/wallet/virtual-cards` (Virtual Cards)

## Data Structures

### Wallet
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

### VirtualCard
```typescript
interface VirtualCard {
  id: number;
  date: string;
  user: string;
  userId: number;
  cardNumber: string;
  expiry: string;
  balance: string;
  isActive: boolean;
  cardId: string;
}
```

## Features

### All Wallets Features
1. **Sortable Headers**: Click on column headers to sort data
2. **User Navigation**: Click on usernames to view/edit user details
3. **Pagination**: Navigate through multiple pages of wallet data
4. **Responsive Design**: Works on all screen sizes
5. **Dark Mode**: Automatically adapts to theme preference

### Virtual Cards Features
1. **Advanced Filtering**:
   - Search by user name or card number
   - Filter by card status (All/Active/Inactive)
   - Clear filters button to reset all filters

2. **Card Actions**:
   - **Top Up**: Click the blue plus icon to open top-up modal
     - Add or subtract balance in USD
     - Input validation (numbers with up to 2 decimal places)
   - **Activate/Deactivate**: Click the status button
     - Red button with shield-off icon for active cards (to deactivate)
     - Green button with shield-check icon for inactive cards (to activate)

3. **Top-Up Modal**:
   - Modal overlay with backdrop
   - Amount input with USD prefix
   - Form validation
   - Apply/Cancel actions

4. **Sortable Headers**: Click on column headers to sort data
5. **User Navigation**: Click on usernames to view/edit user details
6. **Pagination**: Navigate through multiple pages of card data
7. **Responsive Design**: Works on all screen sizes
8. **Dark Mode**: Automatically adapts to theme preference

## Styling

The components use Tailwind CSS with the following key features:
- Responsive table layout with horizontal scroll on mobile
- Hover states for better UX
- Dark mode color scheme
- Clean, modern design matching the dashboard aesthetic
- Action buttons with icon indicators
- Modal dialogs with backdrop overlay

## Future Enhancements

- [ ] Backend API integration for real data
- [ ] Server-side sorting and pagination
- [ ] Export to CSV/PDF functionality
- [ ] Bulk actions for multiple cards
- [ ] Card details view with transaction history
- [ ] Advanced analytics and reporting
- [ ] Email notifications for card actions
