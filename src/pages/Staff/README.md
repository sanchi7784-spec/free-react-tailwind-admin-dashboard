# Branch Staff Management

This folder contains the Branch Staff management pages for the admin dashboard.

## Pages Created

### 1. AllBranchStaff.tsx (`/staff/all`)
-Lists all branch staff members in a responsive table include:
-Search Functionality
-Filtering by Branch and order
-Pagination
-Edit and delete actions for each staff member
-Responsive design (table for desktop, cards for mobile)
-Delete confirmation modal
-Empty state when no data is available

### 2. AddNewBranchStaff.tsx (`/staff/add`)
-Form to ADD a new branch staff member
-Form Fields:
-Name(required)
-Email(required)
-Phone(required)
-password(required)
-Role selection (dropdown)
-Branch Selection (dropdown)
-Address (textarea)
-Status Toggle (Active/Deactivate)
-"Back" button to return to the staff list
-Full validation and responsive design

## Routes

The following routes have been added to the application:
- `/staff/all`-view all branch staff
-`/staff/add`-Add new branch staff

## Navigation

The pages are accessible from the sidebar under:
**Manage Bank Branches > Branch Staff**

## Features

- ✅ Fully responsive design (mobile and desktop)
- ✅ Dark mode support
- ✅ Tailwind CSS styling
- ✅ TypeScript support
- ✅ Search and filter functionality
- ✅ Form validation
- ✅ Modal confirmations
- ✅ Pagination ready
- ✅ Consistent with existing UI patterns

## Future Enhancements

To make these pages fully functional, you'll need to:

1. **Add Edit Staff Page**- Create `EditBranceStaff.tsx` for editing existing staff.
2. **Connect to API**-Integrate with backend API for CRUD operations
3.**

## Usage Example

```tsx
// Navigate to staff list
<Link to="/staff/all">View All Staff</Link>

// Navigate to add new staff
<Link to="/staff/add">Add New Staff</Link>
```
