/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      id\n      uuid\n      name\n      logoUrl\n      currency\n      timezone\n    }\n  }\n": typeof types.CreateCompanyDocument,
    "\n  query CompanyClients($search: String, $first: Int) {\n    companyClients(search: $search, first: $first) {\n      id\n      profilePicture\n      email\n      phone\n      status\n      name\n      lastname\n    }\n  }\n": typeof types.CompanyClientsDocument,
    "\n  query Dogs($search: String, $first: Int) {\n    dogs(search: $search, first: $first) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      companyProfile {\n        firstVisitAt\n        lastVisitAt\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n": typeof types.DogsDocument,
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n        birthDate\n        gender\n        status\n      }\n    }\n  }\n": typeof types.DogDocument,
    "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      color\n      size\n      gender\n      birthDate\n      imageUrl\n    }\n  }\n": typeof types.CreateDogDocument,
    "\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n": typeof types.UploadDogImageDocument,
    "\n  query DogPackages($dogId: ID!, $activeOnly: Boolean) {\n    dogPackages(dogId: $dogId, activeOnly: $activeOnly) {\n      id\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      status\n      package {\n        id\n        name\n        type\n        validityDays\n        billingCycle\n      }\n      # Un paquete se puede renovar a lo más una vez (la cadena es una lista).\n      # Si ya tiene sucesor, la UI oculta el botón en vez de dejar que el\n      # servidor rechace la segunda renovación.\n      renewedTo {\n        id\n      }\n      balances {\n        id\n        initialQuantity\n        usedQuantity\n        remainingQuantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n": typeof types.DogPackagesDocument,
    "\n  query CoveringBalance($dogId: ID!, $serviceId: ID!, $date: DateTime!) {\n    coveringBalance(dogId: $dogId, serviceId: $serviceId, date: $date) {\n      id\n      initialQuantity\n      usedQuantity\n      remainingQuantity\n      daysMask\n      service {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CoveringBalanceDocument,
    "\n  query Packages($activeOnly: Boolean) {\n    packages(activeOnly: $activeOnly) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      billingCycle\n      active\n      items {\n        id\n        quantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n": typeof types.PackagesDocument,
    "\n  mutation CreatePackage($input: CreatePackageInput!) {\n    createPackage(input: $input) {\n      id\n      name\n      type\n      price\n      validityDays\n      billingCycle\n      active\n    }\n  }\n": typeof types.CreatePackageDocument,
    "\n  mutation DeactivatePackage($id: ID!) {\n    deactivatePackage(id: $id) {\n      id\n      active\n    }\n  }\n": typeof types.DeactivatePackageDocument,
    "\n  mutation PurchasePackage($input: PurchasePackageInput!) {\n    purchasePackage(input: $input) {\n      id\n      status\n      expiryDate\n      renewalDate\n    }\n  }\n": typeof types.PurchasePackageDocument,
    "\n  mutation RenewDogPackage(\n    $id: ID!\n    $startDate: DateTime\n    $paymentMethod: PaymentMethod\n    $markPaid: Boolean\n  ) {\n    renewDogPackage(\n      id: $id\n      startDate: $startDate\n      paymentMethod: $paymentMethod\n      markPaid: $markPaid\n    ) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      renewedFrom {\n        id\n      }\n    }\n  }\n": typeof types.RenewDogPackageDocument,
    "\n  mutation CancelDogPackage($id: ID!, $reason: String) {\n    cancelDogPackage(id: $id, reason: $reason) {\n      id\n      status\n      cancelledAt\n    }\n  }\n": typeof types.CancelDogPackageDocument,
    "\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 30) {\n      id\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      status\n      paymentStatus\n      total\n      createdAt\n      dog {\n        id\n        name\n        breed\n        imageUrl\n        primaryOwner {\n          id\n          name\n          lastname\n        }\n      }\n      items {\n        kind\n        name\n        service {\n          type\n        }\n      }\n    }\n  }\n": typeof types.ReservationsDocument,
    "\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n      dates {\n        date\n        price\n      }\n    }\n  }\n": typeof types.QuoteReservationDocument,
    "\n  mutation MarkReservationPaid($id: ID!, $method: String, $reference: String) {\n    markReservationPaid(id: $id, method: $method, reference: $reference) {\n      id\n      paymentStatus\n    }\n  }\n": typeof types.MarkReservationPaidDocument,
    "\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      paymentStatus\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n    }\n  }\n": typeof types.CreateReservationDocument,
    "\n  mutation CheckInReservation($id: ID!) {\n    checkInReservation(id: $id) {\n      id\n      status\n      actualCheckInAt\n    }\n  }\n": typeof types.CheckInReservationDocument,
    "\n  mutation CheckOutReservation($id: ID!, $at: DateTime) {\n    checkOutReservation(id: $id, at: $at) {\n      id\n      status\n      actualCheckOutAt\n      total\n      paymentStatus\n    }\n  }\n": typeof types.CheckOutReservationDocument,
    "\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n    }\n  }\n": typeof types.CancelReservationDocument,
    "\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n": typeof types.CreateServiceDocument,
    "\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n": typeof types.UpdateServiceDocument,
    "\n  query Services($type: ServiceType, $status: ServiceStatus) {\n    services(type: $type, status: $status) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n": typeof types.ServicesDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      profilePicture\n      status\n      memberships {\n        id\n        role\n        status\n        company {\n          id\n          uuid\n          name\n          logoUrl\n          currency\n          timezone\n        }\n      }\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n    }\n  }\n": typeof types.SignInUserDocument,
    "\n  mutation LogoutUser {\n    logoutUser {\n      success\n    }\n  }\n": typeof types.LogoutUserDocument,
    "\n  query GuestStats($date: DateTime) {\n    guestStats(date: $date) {\n      totalDogs\n      checkedInNow\n      arrivingToday\n      departingToday\n      newDogsThisMonth\n    }\n  }\n": typeof types.GuestStatsDocument,
    "\n  query RevenueStats($date: DateTime) {\n    revenueStats(date: $date) {\n      total\n      paid\n      unpaid\n      previousUnpaid\n      byServiceType {\n        serviceType\n        amount\n      }\n    }\n  }\n": typeof types.RevenueStatsDocument,
    "\n  query CompanyMembers($role: MembershipRole) {\n    companyMembers(role: $role) {\n      id\n      role\n      status\n      user {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n": typeof types.CompanyMembersDocument,
    "\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) {\n      userCreated\n      membership {\n        id\n        role\n        status\n      }\n      user {\n        id\n        name\n        lastname\n        email\n      }\n    }\n  }\n": typeof types.InviteMemberDocument,
    "\n  mutation RevokeMembership($role: MembershipRole!, $userId: ID!) {\n    revokeMembership(role: $role, userId: $userId) {\n      id\n      status\n    }\n  }\n": typeof types.RevokeMembershipDocument,
    "\n  mutation ChangeMemberRole($from: MembershipRole!, $to: MembershipRole!, $userId: ID!) {\n    changeMemberRole(from: $from, to: $to, userId: $userId) {\n      id\n      role\n    }\n  }\n": typeof types.ChangeMemberRoleDocument,
};
const documents: Documents = {
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      id\n      uuid\n      name\n      logoUrl\n      currency\n      timezone\n    }\n  }\n": types.CreateCompanyDocument,
    "\n  query CompanyClients($search: String, $first: Int) {\n    companyClients(search: $search, first: $first) {\n      id\n      profilePicture\n      email\n      phone\n      status\n      name\n      lastname\n    }\n  }\n": types.CompanyClientsDocument,
    "\n  query Dogs($search: String, $first: Int) {\n    dogs(search: $search, first: $first) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      companyProfile {\n        firstVisitAt\n        lastVisitAt\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n": types.DogsDocument,
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n        birthDate\n        gender\n        status\n      }\n    }\n  }\n": types.DogDocument,
    "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      color\n      size\n      gender\n      birthDate\n      imageUrl\n    }\n  }\n": types.CreateDogDocument,
    "\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n": types.UploadDogImageDocument,
    "\n  query DogPackages($dogId: ID!, $activeOnly: Boolean) {\n    dogPackages(dogId: $dogId, activeOnly: $activeOnly) {\n      id\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      status\n      package {\n        id\n        name\n        type\n        validityDays\n        billingCycle\n      }\n      # Un paquete se puede renovar a lo más una vez (la cadena es una lista).\n      # Si ya tiene sucesor, la UI oculta el botón en vez de dejar que el\n      # servidor rechace la segunda renovación.\n      renewedTo {\n        id\n      }\n      balances {\n        id\n        initialQuantity\n        usedQuantity\n        remainingQuantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n": types.DogPackagesDocument,
    "\n  query CoveringBalance($dogId: ID!, $serviceId: ID!, $date: DateTime!) {\n    coveringBalance(dogId: $dogId, serviceId: $serviceId, date: $date) {\n      id\n      initialQuantity\n      usedQuantity\n      remainingQuantity\n      daysMask\n      service {\n        id\n        name\n      }\n    }\n  }\n": types.CoveringBalanceDocument,
    "\n  query Packages($activeOnly: Boolean) {\n    packages(activeOnly: $activeOnly) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      billingCycle\n      active\n      items {\n        id\n        quantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n": types.PackagesDocument,
    "\n  mutation CreatePackage($input: CreatePackageInput!) {\n    createPackage(input: $input) {\n      id\n      name\n      type\n      price\n      validityDays\n      billingCycle\n      active\n    }\n  }\n": types.CreatePackageDocument,
    "\n  mutation DeactivatePackage($id: ID!) {\n    deactivatePackage(id: $id) {\n      id\n      active\n    }\n  }\n": types.DeactivatePackageDocument,
    "\n  mutation PurchasePackage($input: PurchasePackageInput!) {\n    purchasePackage(input: $input) {\n      id\n      status\n      expiryDate\n      renewalDate\n    }\n  }\n": types.PurchasePackageDocument,
    "\n  mutation RenewDogPackage(\n    $id: ID!\n    $startDate: DateTime\n    $paymentMethod: PaymentMethod\n    $markPaid: Boolean\n  ) {\n    renewDogPackage(\n      id: $id\n      startDate: $startDate\n      paymentMethod: $paymentMethod\n      markPaid: $markPaid\n    ) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      renewedFrom {\n        id\n      }\n    }\n  }\n": types.RenewDogPackageDocument,
    "\n  mutation CancelDogPackage($id: ID!, $reason: String) {\n    cancelDogPackage(id: $id, reason: $reason) {\n      id\n      status\n      cancelledAt\n    }\n  }\n": types.CancelDogPackageDocument,
    "\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 30) {\n      id\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      status\n      paymentStatus\n      total\n      createdAt\n      dog {\n        id\n        name\n        breed\n        imageUrl\n        primaryOwner {\n          id\n          name\n          lastname\n        }\n      }\n      items {\n        kind\n        name\n        service {\n          type\n        }\n      }\n    }\n  }\n": types.ReservationsDocument,
    "\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n      dates {\n        date\n        price\n      }\n    }\n  }\n": types.QuoteReservationDocument,
    "\n  mutation MarkReservationPaid($id: ID!, $method: String, $reference: String) {\n    markReservationPaid(id: $id, method: $method, reference: $reference) {\n      id\n      paymentStatus\n    }\n  }\n": types.MarkReservationPaidDocument,
    "\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      paymentStatus\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n    }\n  }\n": types.CreateReservationDocument,
    "\n  mutation CheckInReservation($id: ID!) {\n    checkInReservation(id: $id) {\n      id\n      status\n      actualCheckInAt\n    }\n  }\n": types.CheckInReservationDocument,
    "\n  mutation CheckOutReservation($id: ID!, $at: DateTime) {\n    checkOutReservation(id: $id, at: $at) {\n      id\n      status\n      actualCheckOutAt\n      total\n      paymentStatus\n    }\n  }\n": types.CheckOutReservationDocument,
    "\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n    }\n  }\n": types.CancelReservationDocument,
    "\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n": types.CreateServiceDocument,
    "\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n": types.UpdateServiceDocument,
    "\n  query Services($type: ServiceType, $status: ServiceStatus) {\n    services(type: $type, status: $status) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n": types.ServicesDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      profilePicture\n      status\n      memberships {\n        id\n        role\n        status\n        company {\n          id\n          uuid\n          name\n          logoUrl\n          currency\n          timezone\n        }\n      }\n    }\n  }\n": types.MeDocument,
    "\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n    }\n  }\n": types.SignInUserDocument,
    "\n  mutation LogoutUser {\n    logoutUser {\n      success\n    }\n  }\n": types.LogoutUserDocument,
    "\n  query GuestStats($date: DateTime) {\n    guestStats(date: $date) {\n      totalDogs\n      checkedInNow\n      arrivingToday\n      departingToday\n      newDogsThisMonth\n    }\n  }\n": types.GuestStatsDocument,
    "\n  query RevenueStats($date: DateTime) {\n    revenueStats(date: $date) {\n      total\n      paid\n      unpaid\n      previousUnpaid\n      byServiceType {\n        serviceType\n        amount\n      }\n    }\n  }\n": types.RevenueStatsDocument,
    "\n  query CompanyMembers($role: MembershipRole) {\n    companyMembers(role: $role) {\n      id\n      role\n      status\n      user {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n": types.CompanyMembersDocument,
    "\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) {\n      userCreated\n      membership {\n        id\n        role\n        status\n      }\n      user {\n        id\n        name\n        lastname\n        email\n      }\n    }\n  }\n": types.InviteMemberDocument,
    "\n  mutation RevokeMembership($role: MembershipRole!, $userId: ID!) {\n    revokeMembership(role: $role, userId: $userId) {\n      id\n      status\n    }\n  }\n": types.RevokeMembershipDocument,
    "\n  mutation ChangeMemberRole($from: MembershipRole!, $to: MembershipRole!, $userId: ID!) {\n    changeMemberRole(from: $from, to: $to, userId: $userId) {\n      id\n      role\n    }\n  }\n": types.ChangeMemberRoleDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      id\n      uuid\n      name\n      logoUrl\n      currency\n      timezone\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      id\n      uuid\n      name\n      logoUrl\n      currency\n      timezone\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CompanyClients($search: String, $first: Int) {\n    companyClients(search: $search, first: $first) {\n      id\n      profilePicture\n      email\n      phone\n      status\n      name\n      lastname\n    }\n  }\n"): (typeof documents)["\n  query CompanyClients($search: String, $first: Int) {\n    companyClients(search: $search, first: $first) {\n      id\n      profilePicture\n      email\n      phone\n      status\n      name\n      lastname\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Dogs($search: String, $first: Int) {\n    dogs(search: $search, first: $first) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      companyProfile {\n        firstVisitAt\n        lastVisitAt\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n"): (typeof documents)["\n  query Dogs($search: String, $first: Int) {\n    dogs(search: $search, first: $first) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      companyProfile {\n        firstVisitAt\n        lastVisitAt\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n        birthDate\n        gender\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      color\n      birthDate\n      gender\n      imageUrl\n      size\n      weightKg\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n        birthDate\n        gender\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      color\n      size\n      gender\n      birthDate\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      color\n      size\n      gender\n      birthDate\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DogPackages($dogId: ID!, $activeOnly: Boolean) {\n    dogPackages(dogId: $dogId, activeOnly: $activeOnly) {\n      id\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      status\n      package {\n        id\n        name\n        type\n        validityDays\n        billingCycle\n      }\n      # Un paquete se puede renovar a lo más una vez (la cadena es una lista).\n      # Si ya tiene sucesor, la UI oculta el botón en vez de dejar que el\n      # servidor rechace la segunda renovación.\n      renewedTo {\n        id\n      }\n      balances {\n        id\n        initialQuantity\n        usedQuantity\n        remainingQuantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query DogPackages($dogId: ID!, $activeOnly: Boolean) {\n    dogPackages(dogId: $dogId, activeOnly: $activeOnly) {\n      id\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      status\n      package {\n        id\n        name\n        type\n        validityDays\n        billingCycle\n      }\n      # Un paquete se puede renovar a lo más una vez (la cadena es una lista).\n      # Si ya tiene sucesor, la UI oculta el botón en vez de dejar que el\n      # servidor rechace la segunda renovación.\n      renewedTo {\n        id\n      }\n      balances {\n        id\n        initialQuantity\n        usedQuantity\n        remainingQuantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CoveringBalance($dogId: ID!, $serviceId: ID!, $date: DateTime!) {\n    coveringBalance(dogId: $dogId, serviceId: $serviceId, date: $date) {\n      id\n      initialQuantity\n      usedQuantity\n      remainingQuantity\n      daysMask\n      service {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query CoveringBalance($dogId: ID!, $serviceId: ID!, $date: DateTime!) {\n    coveringBalance(dogId: $dogId, serviceId: $serviceId, date: $date) {\n      id\n      initialQuantity\n      usedQuantity\n      remainingQuantity\n      daysMask\n      service {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Packages($activeOnly: Boolean) {\n    packages(activeOnly: $activeOnly) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      billingCycle\n      active\n      items {\n        id\n        quantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Packages($activeOnly: Boolean) {\n    packages(activeOnly: $activeOnly) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      billingCycle\n      active\n      items {\n        id\n        quantity\n        daysMask\n        service {\n          id\n          name\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePackage($input: CreatePackageInput!) {\n    createPackage(input: $input) {\n      id\n      name\n      type\n      price\n      validityDays\n      billingCycle\n      active\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePackage($input: CreatePackageInput!) {\n    createPackage(input: $input) {\n      id\n      name\n      type\n      price\n      validityDays\n      billingCycle\n      active\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeactivatePackage($id: ID!) {\n    deactivatePackage(id: $id) {\n      id\n      active\n    }\n  }\n"): (typeof documents)["\n  mutation DeactivatePackage($id: ID!) {\n    deactivatePackage(id: $id) {\n      id\n      active\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PurchasePackage($input: PurchasePackageInput!) {\n    purchasePackage(input: $input) {\n      id\n      status\n      expiryDate\n      renewalDate\n    }\n  }\n"): (typeof documents)["\n  mutation PurchasePackage($input: PurchasePackageInput!) {\n    purchasePackage(input: $input) {\n      id\n      status\n      expiryDate\n      renewalDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RenewDogPackage(\n    $id: ID!\n    $startDate: DateTime\n    $paymentMethod: PaymentMethod\n    $markPaid: Boolean\n  ) {\n    renewDogPackage(\n      id: $id\n      startDate: $startDate\n      paymentMethod: $paymentMethod\n      markPaid: $markPaid\n    ) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      renewedFrom {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RenewDogPackage(\n    $id: ID!\n    $startDate: DateTime\n    $paymentMethod: PaymentMethod\n    $markPaid: Boolean\n  ) {\n    renewDogPackage(\n      id: $id\n      startDate: $startDate\n      paymentMethod: $paymentMethod\n      markPaid: $markPaid\n    ) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      renewedFrom {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelDogPackage($id: ID!, $reason: String) {\n    cancelDogPackage(id: $id, reason: $reason) {\n      id\n      status\n      cancelledAt\n    }\n  }\n"): (typeof documents)["\n  mutation CancelDogPackage($id: ID!, $reason: String) {\n    cancelDogPackage(id: $id, reason: $reason) {\n      id\n      status\n      cancelledAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 30) {\n      id\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      status\n      paymentStatus\n      total\n      createdAt\n      dog {\n        id\n        name\n        breed\n        imageUrl\n        primaryOwner {\n          id\n          name\n          lastname\n        }\n      }\n      items {\n        kind\n        name\n        service {\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 30) {\n      id\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      status\n      paymentStatus\n      total\n      createdAt\n      dog {\n        id\n        name\n        breed\n        imageUrl\n        primaryOwner {\n          id\n          name\n          lastname\n        }\n      }\n      items {\n        kind\n        name\n        service {\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n      dates {\n        date\n        price\n      }\n    }\n  }\n"): (typeof documents)["\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n      dates {\n        date\n        price\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkReservationPaid($id: ID!, $method: String, $reference: String) {\n    markReservationPaid(id: $id, method: $method, reference: $reference) {\n      id\n      paymentStatus\n    }\n  }\n"): (typeof documents)["\n  mutation MarkReservationPaid($id: ID!, $method: String, $reference: String) {\n    markReservationPaid(id: $id, method: $method, reference: $reference) {\n      id\n      paymentStatus\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      paymentStatus\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n    }\n  }\n"): (typeof documents)["\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      paymentStatus\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CheckInReservation($id: ID!) {\n    checkInReservation(id: $id) {\n      id\n      status\n      actualCheckInAt\n    }\n  }\n"): (typeof documents)["\n  mutation CheckInReservation($id: ID!) {\n    checkInReservation(id: $id) {\n      id\n      status\n      actualCheckInAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CheckOutReservation($id: ID!, $at: DateTime) {\n    checkOutReservation(id: $id, at: $at) {\n      id\n      status\n      actualCheckOutAt\n      total\n      paymentStatus\n    }\n  }\n"): (typeof documents)["\n  mutation CheckOutReservation($id: ID!, $at: DateTime) {\n    checkOutReservation(id: $id, at: $at) {\n      id\n      status\n      actualCheckOutAt\n      total\n      paymentStatus\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CreateService($input: CreateServiceInput!) {\n    createService(input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {\n    updateService(id: $id, input: $input) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Services($type: ServiceType, $status: ServiceStatus) {\n    services(type: $type, status: $status) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n"): (typeof documents)["\n  query Services($type: ServiceType, $status: ServiceStatus) {\n    services(type: $type, status: $status) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      daysMask\n      capacity\n      checkoutCutoffMinute\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      profilePicture\n      status\n      memberships {\n        id\n        role\n        status\n        company {\n          id\n          uuid\n          name\n          logoUrl\n          currency\n          timezone\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      profilePicture\n      status\n      memberships {\n        id\n        role\n        status\n        company {\n          id\n          uuid\n          name\n          logoUrl\n          currency\n          timezone\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogoutUser {\n    logoutUser {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation LogoutUser {\n    logoutUser {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GuestStats($date: DateTime) {\n    guestStats(date: $date) {\n      totalDogs\n      checkedInNow\n      arrivingToday\n      departingToday\n      newDogsThisMonth\n    }\n  }\n"): (typeof documents)["\n  query GuestStats($date: DateTime) {\n    guestStats(date: $date) {\n      totalDogs\n      checkedInNow\n      arrivingToday\n      departingToday\n      newDogsThisMonth\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RevenueStats($date: DateTime) {\n    revenueStats(date: $date) {\n      total\n      paid\n      unpaid\n      previousUnpaid\n      byServiceType {\n        serviceType\n        amount\n      }\n    }\n  }\n"): (typeof documents)["\n  query RevenueStats($date: DateTime) {\n    revenueStats(date: $date) {\n      total\n      paid\n      unpaid\n      previousUnpaid\n      byServiceType {\n        serviceType\n        amount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CompanyMembers($role: MembershipRole) {\n    companyMembers(role: $role) {\n      id\n      role\n      status\n      user {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n"): (typeof documents)["\n  query CompanyMembers($role: MembershipRole) {\n    companyMembers(role: $role) {\n      id\n      role\n      status\n      user {\n        id\n        name\n        lastname\n        email\n        phone\n        profilePicture\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) {\n      userCreated\n      membership {\n        id\n        role\n        status\n      }\n      user {\n        id\n        name\n        lastname\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) {\n      userCreated\n      membership {\n        id\n        role\n        status\n      }\n      user {\n        id\n        name\n        lastname\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevokeMembership($role: MembershipRole!, $userId: ID!) {\n    revokeMembership(role: $role, userId: $userId) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation RevokeMembership($role: MembershipRole!, $userId: ID!) {\n    revokeMembership(role: $role, userId: $userId) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeMemberRole($from: MembershipRole!, $to: MembershipRole!, $userId: ID!) {\n    changeMemberRole(from: $from, to: $to, userId: $userId) {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeMemberRole($from: MembershipRole!, $to: MembershipRole!, $userId: ID!) {\n    changeMemberRole(from: $from, to: $to, userId: $userId) {\n      id\n      role\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;