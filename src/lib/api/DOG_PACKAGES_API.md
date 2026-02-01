# Dog Packages API

This file defines the TypeScript types and GraphQL queries for working with dog packages in the AdPaws system.

## Types

### `DogPackageBalance`

Represents the balance/usage of a specific service within a dog's package.

**Fields:**

- `id`: Unique identifier
- `dogPackageId`: Reference to the parent DogPackage
- `serviceId`: Reference to the service
- `service`: Service details (id, name, price)
- `initialQuantity`: Starting quantity (null for unlimited)
- `usedQuantity`: Amount already used
- `remainingQuantity`: Amount remaining (null for unlimited)
- `createdAt`, `updatedAt`: Timestamps

### `Package`

Template definition for a package (e.g., "10 Hotel Nights Package").

**Fields:**

- `id`: Unique identifier
- `name`: Package name
- `description`: Optional description
- `price`: Total package price
- `type`: "QUANTITY" | "UNLIMITED" | "SUBSCRIPTION"
- `validityDays`: Days until expiration (optional)
- `active`: Whether package is currently available for purchase
- `createdAt`, `updatedAt`: Timestamps

### `DogPackage`

Instance of a package assigned to a specific dog.

**Fields:**

- `id`: Unique identifier
- `dogId`: Reference to the dog
- `packageId`: Reference to the package template
- `package`: Full package details
- `purchaseDate`: When package was purchased
- `expiryDate`: When package expires (optional)
- `renewalDate`: For subscriptions (optional)
- `billingCycle`: For subscriptions (optional)
- `status`: "ACTIVE" | "DEPLETED" | "EXPIRED" | "CANCELLED"
- `balances`: Array of service balances
- `createdAt`, `updatedAt`: Timestamps

## Queries

### `ACTIVE_DOG_PACKAGES`

Fetches all active packages for a specific dog.

**Variables:**

- `dogId: Int!` - The dog's ID

**Returns:**

- Array of `DogPackage` with full package details and balances

**Example:**

```typescript
const { data } = useQuery(ACTIVE_DOG_PACKAGES, {
  variables: { dogId: 42 },
});

// data.activeDogPackages[0].balances[0].remainingQuantity
```

### `CHECK_DOG_SERVICE_AVAILABILITY`

Checks if a dog has an available package balance for a specific service.

**Variables:**

- `dogId: Int!` - The dog's ID
- `serviceId: Int!` - The service ID

**Returns:**

- `DogPackageBalance | null` - The first available balance, or null if none

**Example:**

```typescript
const { data } = useQuery(CHECK_DOG_SERVICE_AVAILABILITY, {
  variables: { dogId: 42, serviceId: 1 },
});

if (data.checkDogServiceAvailability) {
  // Dog has package for this service
  const remaining = data.checkDogServiceAvailability.remainingQuantity;
}
```

## Usage in Components

### DogSelector Component

```typescript
import {
  ACTIVE_DOG_PACKAGES,
  type DogPackage,
} from "@/lib/api/dogPackages.api";

const { data } = useQuery<{ activeDogPackages: DogPackage[] }>(
  ACTIVE_DOG_PACKAGES,
  {
    variables: { dogId: Number(selectedDogId) },
    skip: !selectedDogId,
  }
);

// Display packages
{
  data?.activeDogPackages.map((dogPackage) => (
    <div key={dogPackage.id}>
      <h3>{dogPackage.package.name}</h3>
      {dogPackage.balances.map((balance) => (
        <div key={balance.id}>
          {balance.service.name}: {balance.remainingQuantity ?? "Ilimitado"}
        </div>
      ))}
    </div>
  ));
}
```

## Notes

- Package types:
  - **QUANTITY**: Fixed number of services (e.g., "10 nights")
  - **UNLIMITED**: Unlimited services during validity period
  - **SUBSCRIPTION**: Recurring unlimited package
- `remainingQuantity` is `null` for UNLIMITED and SUBSCRIPTION packages
- Check `expiryDate` to ensure package hasn't expired
- `status` will be "DEPLETED" when all services are used (QUANTITY only)
