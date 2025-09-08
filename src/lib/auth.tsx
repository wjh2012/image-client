import { configureAuth } from "react-query-auth";
import { Navigate, useLocation } from "react-router";
import { z } from "zod";

import { paths } from "@/config/paths";
import type { AuthResponse, User } from "@/types/api";
import { api } from "@/lib/api-client.ts";

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

const getUser = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data;
};

const logout = (): Promise<void> => {
  return api.post("/auth/logout");
};

export const loginInputSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
  password: z.string().min(5, "Required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
  return api.post("/auth/login", data);
};

export const registerInputSchema = z
  .object({
    email: z.string().min(1, "Required"),
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    password: z.string().min(5, "Required"),
    teamId: z.string().optional(),
    teamName: z.string().optional(),
  })
  .refine((data) => Boolean(data.teamId) !== Boolean(data.teamName), {
    message: "teamId 또는 teamName 중 정확히 하나만 제공해야 합니다.",
    path: ["teamId"],
  });

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<AuthResponse> => {
  return api.post("/auth/register", data);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    return response.user;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);
    return response.user;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
