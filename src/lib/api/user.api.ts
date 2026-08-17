// Todas las operaciones de usuario migraron a src/graphql/operations/
// (tipadas por codegen contra el schema nuevo):
// - signUser, me, logoutUser        → session.ts
// - createUser                      → account.ts
// - companyDogOwners                → clients.ts (companyClients)
// - companyEmployees, addEmployee,
//   removeEmployee                  → team.ts (companyMembers, inviteMember,
//                                    revokeMembership — el rol vive en la
//                                    membresía, por compañía)
export {};
