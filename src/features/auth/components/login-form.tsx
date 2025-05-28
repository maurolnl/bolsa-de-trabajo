import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PATHS } from "@/router/paths";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginFormSchema } from "./login-form-validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export type LoginFormType = z.infer<typeof loginFormSchema>;

interface Props {
  onSubmit: (values: LoginFormType) => Promise<void>;
}

export const LoginForm: React.FC<Props> = ({ onSubmit }) => {
  // const [visiblePassword, setVisiblePassword] = useState
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="test@example.com"
                      required
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your private email to register your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between flex-row items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    to={PATHS.main.home}
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>
      </form>
    </Form>
  );
};
