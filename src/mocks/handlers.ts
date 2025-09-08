import { http, HttpResponse } from "msw";
import type { Team, User } from "@/types/api.ts";

export const handlers = [
  http.get("http://localhost:8080/api/auth/me", () => {
    // return HttpResponse.json({
    //   data: {
    //     firstName: "lee",
    //     lastName: "joo",
    //     email: "lee.joo@example.com",
    //     role: "USER",
    //     teamId: "team-123",
    //     bio: "안녕하세요, 풀스택 개발자입니다.",
    //   } as User,
    // });
    return HttpResponse.json({
      data: 0,
    });
  }),
  http.post("http://localhost:8080/api/auth/login", () => {
    return HttpResponse.json({
      jwt: "string",
      user: {
        id: "1",
        createdAt: 20250908,
        firstName: "lee",
        lastName: "joo",
        email: "lee.joo@example.com",
        role: "USER",
        teamId: "team-123",
        bio: "안녕하세요, 풀스택 개발자입니다.",
      } as User,
    });
    // return HttpResponse.json({
    //   jwt: "string",
    //   user: 0,
    // });
  }),
  http.post("http://localhost:8080/api/auth/register", () => {
    return HttpResponse.json({
      jwt: "string",
      user: {
        id: "1",
        createdAt: 20250908,
        firstName: "lee",
        lastName: "joo",
        email: "lee.joo@example.com",
        role: "USER",
        teamId: "team-123",
        bio: "안녕하세요, 풀스택 개발자입니다.",
      } as User,
    });
  }),
  http.get("http://localhost:8080/api/teams", () => {
    return HttpResponse.json({
      data: [
        {
          id: "1",
          createdAt: 20250908,
          name: "aTeam",
          description: "Hello A Team",
        },
        {
          id: "2",
          createdAt: 20250908,
          name: "bTeam",
          description: "Hello B Team",
        },
      ] as Team[],
    });
  }),
];
