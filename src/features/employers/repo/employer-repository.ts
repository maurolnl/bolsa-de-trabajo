export type EmployerRepository = {
  getByUserId(userId: number): Promise<unknown>;
};
