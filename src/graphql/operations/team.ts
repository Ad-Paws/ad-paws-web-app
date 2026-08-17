import { graphql } from "@/gql";

/**
 * Gestión de equipo contra el schema nuevo. El rol vive en la membresía
 * (por compañía), no en el usuario. Reemplaza a companyEmployees /
 * addEmployee / removeEmployee, que recibían companyId del cliente.
 */
export const COMPANY_MEMBERS_QUERY = graphql(`
  query CompanyMembers($role: MembershipRole) {
    companyMembers(role: $role) {
      id
      role
      status
      user {
        id
        name
        lastname
        email
        phone
        profilePicture
      }
    }
  }
`);

/** Crea la cuenta si no existe (password temporal) o vincula la existente. */
export const INVITE_MEMBER_MUTATION = graphql(`
  mutation InviteMember($input: InviteMemberInput!) {
    inviteMember(input: $input) {
      userCreated
      membership {
        id
        role
        status
      }
      user {
        id
        name
        lastname
        email
      }
    }
  }
`);

export const REVOKE_MEMBERSHIP_MUTATION = graphql(`
  mutation RevokeMembership($role: MembershipRole!, $userId: ID!) {
    revokeMembership(role: $role, userId: $userId) {
      id
      status
    }
  }
`);

export const CHANGE_MEMBER_ROLE_MUTATION = graphql(`
  mutation ChangeMemberRole($from: MembershipRole!, $to: MembershipRole!, $userId: ID!) {
    changeMemberRole(from: $from, to: $to, userId: $userId) {
      id
      role
    }
  }
`);
