import { httpClient } from "@/core/services/httpClient";
import { useMutation } from "@tanstack/react-query";
import { User } from "src/models/User";

// type IUpdatePassword = {
//   code: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

// // type IVerifyCode = {
// //   code: string;
// // };

// type IResetPassword = {
//   email: string;
// };

// type IRegister = {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
// };

export class AuthRepository {
  login = (x: { email: string; password: string }) =>
    httpClient.post<string>("auth/login", x);

  getLoggedUser = () => httpClient.get<User>("auth/users/me");

  // updatePassword = (args: IUpdatePassword) =>
  //   new Promise((res) => {
  //     setTimeout(() => res('OK'), 4000);
  //   });

  // verifyCode = (args: IVerifyCode) =>
  //   new Promise((res) => {
  //     setTimeout(() => res('OK'), 4000);
  //   });

  // resetPassword = (args: IResetPassword) =>
  //   new Promise((res) => {
  //     setTimeout(() => res('OK'), 4000);
  //   });

  // register = (args: IRegister) =>
  register = () =>
    new Promise((res) => {
      setTimeout(() => res("OK"), 4000);
    });
}

const repo = new AuthRepository();

export const useLoginMutation = () => useMutation({ mutationFn: repo.login });
export const useRegisterMutation = () =>
  useMutation({ mutationFn: repo.register });

// export const useUpdatePasswordMutation = () =>
//   useMutation({ mutationFn: repo.updatePassword });
// export const useVerifyCodeMutation = () =>
//   useMutation({ mutationFn: repo.verifyCode });
// export const useResetPasswordMutation = () =>
//   useMutation({ mutationFn: repo.resetPassword });
