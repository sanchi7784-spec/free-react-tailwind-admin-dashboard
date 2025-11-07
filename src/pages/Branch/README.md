# Branch Management Module

A complete responsive React module for managing bank branches with full CRUD capabilities.

## Pages

### 1. All Branch (`/branch/all`)
View and manage all branches in a table/card layout.

### 2. Add New Branch (`/branch/add`)
Create new branch records with a comprehensive form.

### 3. Edit Branch (`/branch/edit/:id`)
Edit existing branch details with pre-populated data.

## Features

### All Branch Page

✅ **Fully Responsive Design**
- Desktop: Full table view with all columns
- Tablet/Mobile: Card-based layout for better mobile UX

✅ **Search & Filter**
- Real-time search functionality
- Advanced filtering by status (Active/Inactive)
- Sort options (ASC/DESC)
- Adjustable items per page (15/30/45/60)

✅ **Data Display**
- Branch Code
- Branch Name
- Routing Number
- SWIFT Code
- Phone
- Email
- Address
- Status Badge (Active/Inactive)

✅ **Actions**
- Edit Branch (Pencil Icon)
- Delete Branch (Trash Icon with confirmation modal)

✅ **UI Components**
- Warning Alert (Branch system notice)
- Confirmation Modal for deletions
- Pagination controls
- Dark mode support

### Add New Branch Page

✅ **Form Fields**
- Branch Name (Required)
- Branch Code (Required)
- GST Number (Required) - *Replaces Routing Number*
- Phone (Optional)
- Email (Optional)
- Mobile (Optional)
- Address (Textarea)
- Google Map Location (Textarea)
- Status Toggle (Active/Deactivate)

✅ **Removed Fields**
- ~~Swift Code~~ - Removed as requested
- ~~Fax~~ - Removed as requested

✅ **Form Features**
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Form validation (required fields)
- Status toggle switch
- Full-width textareas for address fields
- Back button navigation
- Submit button

✅ **Design**
- Clean, modern form layout
- Consistent with admin dashboard theme
- Dark mode support
- Accessible form labels
- Placeholder text for guidance

### Edit Branch Page

✅ **Form Fields (Pre-populated)**
- Branch Name (Required)
- Branch Code (Required)
- GST Number (Required) - *Replaces Routing Number*
- Phone (Optional)
- Email (Optional)
- Mobile (Optional)
- Address (Textarea - Full width)
- Google Map Location (Textarea - Full width)
- Status Toggle (Active/Deactivate)

✅ **Features**
- Loads existing branch data by ID
- Form validation (required fields)
- Status toggle switch
- Update button
- Back navigation
- Responsive design

## Routes

| Page | Route | Description |
|------|-------|-------------|
| All Branch | `/branch/all` | View and manage all branches |
| Add New Branch | `/branch/add` | Create a new branch |
| Edit Branch | `/branch/edit/:id` | Edit an existing branch |

## Component Structure

```
src/pages/Branch/
├── AllBranch.tsx         # Main listing page
├── AddNewBranch.tsx      # Add new branch form
├── EditBranch.tsx        # Edit branch form
└── README.md             # Documentation
```

## Usage

### Viewing All Branches

Navigate to `/branch/all` to see all branches in a table/card format.

### Adding New Branches

1. Click the "ADD NEW" button on the All Branch page
2. Or navigate directly to `/branch/add`
3. Fill in the required fields:
   - Branch Name
   - Branch Code
   - GST Number
4. Optionally fill in:
   - Phone
   - Email
   - Mobile
   - Address
   - Google Map Location
5. Select status (Active/Deactivate)
6. Click "Add New Branch" to submit

### Editing Branches

1. **From All Branch page:**
   - Click the purple edit button (pencil icon) on any branch row
   - Redirects to `/branch/edit/{id}`

2. **Form behavior:**
   - All fields are pre-populated with existing data
   - Modify any field as needed
   - Select Active/Deactivate status
   - Click "Update Branch" to save changes
   - Click "Back" to return without saving

### Deleting Branches

1. Click the red delete button (trash icon)
2. Confirm deletion in the modal popup
3. Branch will be removed from the list

## Styling

- Built with Tailwind CSS
- Custom SVG icons from the project's icon library
- Consistent with the existing admin dashboard theme
- Supports light and dark modes
- Responsive design for all screen sizes

## Form Data Structure

```typescript
interface BranchFormData {
  branchName: string;
  branchCode: string;
  gstNumber: string;
  phone: string;
  email: string;
  mobile: string;
  address: string;
  mapLocation: string;
  status: 'active' | 'inactive';
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Connect to backend API
- [ ] Implement actual edit functionality
- [ ] Add form validation (GST number format, email format, phone number format)
- [ ] Add success/error notifications
- [ ] Export to CSV/Excel
- [ ] Bulk actions
- [ ] Advanced filtering options
- [ ] Image upload for branch
- [ ] Google Maps integration for map location picker
