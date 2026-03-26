import { z } from "zod";

export const inviteFormSchema = z.object({
  name: z.string("Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  designation: z.string("Please select a role"),
  role: z.string("Please select a role"),
});
