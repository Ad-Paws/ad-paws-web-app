# Check-In Dialog - Multi-Step Process Update

## Overview

The Check-In dialog has been updated to implement a clear 4-step process that improves user experience by separating concerns and showing relevant information at each stage.

## New Flow

### Step 1: Service Type Selection
- **Purpose**: Choose which type of service the customer wants (Hotel, Daycare, Grooming, Training)
- **UI**: Grid of service type cards with icons and descriptions
- **Progress**: 1 of 4

### Step 2: Dog Selection
- **Purpose**: Select which dog will receive the service
- **UI**: 
  - Searchable dog selector with owner information
  - Selected dog details displayed below
  - Shows owner information (name)
  - **Displays active packages** with balances if the dog has any
  - "Continue" button to proceed to next step
- **Progress**: 2 of 4
- **Key Features**:
  - Search by dog name or owner name
  - Visual dog avatars
  - Package information shown immediately after selection
  - Clear indication of available package balance (e.g., "7 disponibles" or "Ilimitado")

### Step 3: Service Details
- **Purpose**: Configure the specific service details
- **UI**: 
  - Date selection (for Hotel/multi-day services)
  - Service selection (if multiple available)
  - Add-on services selection
  - Price calculation with package considerations
- **Actions**: "Atrás" (back) and "Continuar" buttons
- **Progress**: 3 of 4

### Step 4: Summary & Confirmation
- **Purpose**: Review and confirm the booking
- **UI**:
  - Summary of selected services
  - Total cost breakdown
  - Package usage information (if applicable)
  - Price exception warnings (if any dates have special pricing)
- **Actions**: "Atrás" (back) and "Confirmar Reservación" buttons
- **Progress**: 4 of 4

## Visual Improvements

### Progress Indicator
- Progress bar showing current step out of 4
- Step label showing what the current step is for

### Navigation
- Back button appears after step 1
- Clear "Cancel" link available at all steps
- "Atrás" button in forms to navigate backwards

## Component Changes

### CheckInDialog.tsx
**Added:**
- `currentStep` state management (`"service-type" | "dog-selection" | "service-form" | "summary"`)
- `selectedDogId` state tracking
- Step progress indicator UI
- Improved navigation handlers (`handleBack`, `handleDogSelect`)
- Step info helper (`getStepInfo()`)

**Changed:**
- Now passes `dogId` prop to forms instead of `dogs` array
- Added `onBack` callback to forms
- Forms handle their own internal steps (step 3 includes the summary as step 4)

### DogSelector.tsx
**Added:**
- `showContinueButton` prop - enables step 2 standalone mode
- Active packages display using `ACTIVE_DOG_PACKAGES` query
- Owner information display
- Package balance visualization
- "Continuar" button when in step 2 mode

**Changed:**
- Now accepts `selectedDogId: string | null` instead of requiring a value
- Fetches and displays dog packages when a dog is selected

### HotelForm.tsx & DaycareForm.tsx
**Changed:**
- Props changed from `dogs: Dog[]` to `dogId: string`
- Added `onBack: () => void` prop
- Removed dog selection UI (now handled in step 2)
- Updated action buttons to show "Atrás" and "Continuar" side by side
- Dog ID is set as default value in form initialization

## Key Benefits

### 1. Separation of Concerns
Each step focuses on one decision:
- What service?
- Which dog?
- What details?
- Confirm?

### 2. Package Visibility
Dog packages are shown immediately after selection, helping staff:
- Know if the dog has available package balance
- See what services are covered
- Check expiry dates

### 3. Clear Navigation
- Always know what step you're on
- Easy to go back and change selections
- Can cancel at any time

### 4. Better UX
- Less overwhelming (one decision at a time)
- Relevant information shown at the right time
- Visual feedback with progress bar
- Package information helps with pricing decisions

## Data Flow

```
1. Service Type Selected
   ↓
2. Dog Selected → Fetch active packages for dog
   ↓
3. Service Form → Use dogId for pricing/package checks
   ↓
4. Summary → Show final breakdown with package usage
   ↓
5. Confirmation → Create reservation
```

## Package Integration

When a dog is selected in Step 2:
1. Query `activeDogPackages(dogId)` 
2. Display packages with:
   - Package name
   - Package type (QUANTITY/UNLIMITED/SUBSCRIPTION)
   - Balance per service
   - Expiry date

This helps staff know:
- If the service can be covered by a package
- How many services remain
- When the package expires

## Example User Journey

### Scenario: Hotel Booking with Package

1. **Step 1**: Staff clicks "Hotel" card
2. **Step 2**: 
   - Searches for "Max"
   - Selects Max
   - Sees: "Paquete 10 Noches - 7 disponibles"
   - Clicks "Continuar"
3. **Step 3**:
   - Selects dates: Feb 10-12 (2 nights, weekdays)
   - Sees: "Incluidas en paquete" (covered by package)
   - Adds "Baño adicional" add-on
   - Clicks "Continuar"
4. **Step 4** (Summary):
   - 2 noches: $0 (paquete)
   - Baño adicional: $200
   - Total: $200
   - Package balance after: 5 noches
   - Clicks "Confirmar Reservación"

### Scenario: Weekend Booking with Exceptions

1. **Step 1**: Staff clicks "Hotel" card
2. **Step 2**: Selects Luna (has unlimited package)
3. **Step 3**:
   - Selects dates: Feb 14-16 (Fri-Sun)
   - Sees: "CARGO EXTRA - Fines de semana no incluidos en paquete"
   - Shows: 3 nights × $800 = $2,400
   - Explains package cannot be used (exception blocks it)
4. **Step 4** (Summary):
   - 3 noches fin de semana: $2,400 (excepción)
   - Paquete no aplica en estas fechas
   - Total: $2,400
   - Clicks "Confirmar Reservación"

## Migration Notes

### Breaking Changes
- Forms now expect `dogId: string` instead of `dogs: Dog[]`
- Forms now require `onBack: () => void` callback
- `DogSelector` behavior changes with `showContinueButton` prop

### Backwards Compatibility
- All existing reservation functionality preserved
- Same mutation and queries used
- No database changes required

## Future Enhancements

Potential improvements:
1. Add step 4 as a separate component (currently embedded in step 3)
2. Add ability to edit previous steps from summary
3. Show estimated check-in time based on current reservations
4. Add package purchase option if dog has no packages
5. Show historical bookings for selected dog

## Testing Checklist

- [ ] Service type selection works
- [ ] Dog search finds dogs by name and owner
- [ ] Package information displays correctly
- [ ] Navigation (back/continue/cancel) works at all steps
- [ ] Hotel form with date selection works
- [ ] Daycare form without date selection works
- [ ] Add-ons can be selected
- [ ] Price calculations include package discounts
- [ ] Price exceptions show warnings
- [ ] Final reservation creation succeeds
- [ ] Progress bar updates correctly
- [ ] Mobile responsive
