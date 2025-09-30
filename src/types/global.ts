export const roles = ["Recruiter", "Client", "Candidate", "Other"] as const;
export type Role = (typeof roles)[number];

export type FormStatus = "idle" | "loading" | "success" | "error";
