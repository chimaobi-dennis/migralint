import { z } from 'zod';

export const studentProfileSchema = z.object({
  degree: z.string().min(1, "Degree is required").max(100),
  field_of_study: z.string().min(1, "Field of study is required").max(100),
  area_of_study: z.string().min(1, "Area of study is required").max(100),
  country: z.string().min(1, "Origin country is required").max(100),
  university: z.string().min(1, "University country is required").max(100),
  language: z.string().min(1, "Language is required").max(50),
  language_test_type: z.string().max(50).optional(),
  language_test_score: z.number().int().min(0).max(120).optional(),
  language_test_year: z.number().int().min(2000).max(2100).optional(),
  has_language_test: z.number().int().min(0).max(1),
  study_envs: z.array(z.string()).optional(),
  interest_keywords: z.array(z.string()).optional(),
  work_experience: z.string().max(1000).optional(),
  fee_preference: z.string().max(100).optional(),
  desired_degree_type: z.string().max(100).optional(),
});

export const applicationSchema = z.object({
  degree: z.string().min(1).max(100),
  studyField: z.string().min(1).max(100),
  university: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  status: z.string().max(50).optional(),
  type: z.string().max(50).optional(),
  track: z.string().max(100).optional(),
  study_period: z.string().max(100).optional(),
});

export const emailSchema = z.string().email("Invalid email address").max(255);

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const phoneSchema = z.string()
  .min(8, "Phone number must be at least 8 digits")
  .max(20, "Phone number must be less than 20 digits")
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");
