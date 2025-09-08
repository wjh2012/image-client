import { Link, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerInputSchema, useRegister } from "@/lib/auth.tsx";
import type { Team } from "@/types/api.ts";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

type RegisterFormProps = {
  onSuccess: () => void;
  chooseTeam: boolean;
  setChooseTeam: () => void;
  teams?: Team[];
};

export const RegisterForm = ({
  onSuccess,
  chooseTeam,
  setChooseTeam,
  teams,
}: RegisterFormProps) => {
  const registering = useRegister({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const form = useForm<z.infer<typeof registerInputSchema>>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      teamId: "",
      teamName: "",
    },
  });

  function onSubmit(values: any) {
    registering.mutate(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormDescription>
                  로그인에 사용되는 이메일입니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름 (First name)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="홍"
                      {...field}
                      autoComplete="given-name"
                    />
                  </FormControl>
                  <FormDescription>
                    실명 또는 표시할 이름의 이름 부분입니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성 (Last name)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="길동"
                      {...field}
                      autoComplete="family-name"
                    />
                  </FormControl>
                  <FormDescription>
                    실명 또는 표시할 이름의 성 부분입니다.
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
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormDescription>최소 5자 이상 입력하세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="choose-team"
              checked={chooseTeam}
              onCheckedChange={setChooseTeam}
              className={`${chooseTeam ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <Label htmlFor="airplane-mode">Join Existing Team</Label>
          </div>

          {chooseTeam && teams ? (
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="팀을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams?.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    가입 시 연결할 팀을 선택하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>팀 이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={Boolean(registering.isPending)}>
            {registering.isPending ? "가입 중..." : "회원가입"}
          </Button>
        </form>
      </Form>

      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to={paths.auth.register.getHref(redirectTo)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
