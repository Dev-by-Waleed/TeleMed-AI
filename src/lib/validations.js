import { z } from "zod"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const onboardingSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: "Age is required" })
    .min(1, "Age is required")
    .max(150, "Invalid age"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  height_cm: z.coerce
    .number({ invalid_type_error: "Height is required" })
    .min(1, "Height is required")
    .max(300, "Invalid height"),
  weight_kg: z.coerce
    .number({ invalid_type_error: "Weight is required" })
    .min(1, "Weight is required")
    .max(500, "Invalid weight"),
  blood_group: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  conditions: z.string().optional(),
  emergency_contact: z.string().min(1, "Emergency contact is required"),
  notes: z.string().optional(),
  past_surgeries: z.string().optional(),
  smoking_status: z.string().optional(),
  chronic_illness_notes: z.string().optional(),
})

export const patientProfileSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: "Age is required" })
    .min(1, "Age is required")
    .max(150, "Invalid age"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  height_cm: z.coerce
    .number({ invalid_type_error: "Height is required" })
    .min(1, "Height is required")
    .max(300, "Invalid height"),
  weight_kg: z.coerce
    .number({ invalid_type_error: "Weight is required" })
    .min(1, "Weight is required")
    .max(500, "Invalid weight"),
  blood_group: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  conditions: z.string().optional(),
  emergency_contact: z.string().min(1, "Emergency contact is required"),
  notes: z.string().optional(),
  past_surgeries: z.string().optional(),
  smoking_status: z.string().optional(),
  chronic_illness_notes: z.string().optional(),
})

export const bookingSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  scheduledAt: z.string().min(1, "Please select a date and time"),
  reason: z.string().optional(),
})

export const createDoctorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  specialty: z.string().min(1, "Please select a specialty"),
  deliveryMode: z.enum(["direct", "invite"], {
    errorMap: () => ({ message: "Please select a delivery mode" }),
  }),
})

export const doctorProfileSchema = z.object({
  bio: z.string().optional(),
})

export const profileRequestSchema = z.object({
  requested_full_name: z.string().optional(),
  requested_specialty: z.string().optional(),
  reason: z.string().min(1, "Please provide a reason for this change"),
})

export const prescriptionSchema = z.object({
  patient_id: z.string().min(1, "Please select a patient"),
  medication_name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  instructions: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.coerce
    .number({ invalid_type_error: "Rating is required" })
    .min(1, "Rating is required")
    .max(5, "Maximum rating is 5"),
  comment: z.string().optional(),
})

export const broadcastSchema = z.object({
  audience: z.enum(["all", "patients", "doctors", "admins"], {
    errorMap: () => ({ message: "Please select an audience" }),
  }),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Message body is required"),
  link: z.string().optional(),
})
