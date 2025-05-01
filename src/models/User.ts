export interface User {
  id: number;
  email: string;
  roles: UserRoles[];
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export enum UserRoles {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export const ROLES = [
  { value: UserRoles.SUPER_ADMIN, label: "Super Admin" },
  { value: UserRoles.ADMIN, label: "Admin" },
  { value: UserRoles.CUSTOMER, label: "Cliente" },
];
