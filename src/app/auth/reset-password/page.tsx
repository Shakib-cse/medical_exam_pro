"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/auth"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailParam = searchParams.get("email") || ""
  const codeParam = searchParams.get("code") || ""

  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!emailParam || !codeParam) {
      setErrorMessage("Missing email or verification code. Please request a new password reset.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await authApi.resetPassword({
        email: emailParam,
        code: codeParam,
        password: data.password,
      })
      router.push("/auth/sign-in")
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col items-center">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Link href="/">
          <Image
            src="/images/commonLayout/logo.png"
            alt="MedicalExamPro Logo"
            width={220}
            height={70}
            priority
            className="h-auto w-auto max-h-16 object-contain"
          />
        </Link>
      </div>

      {/* Title & Description */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
        Set New Password
      </h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        Your new password must be different from previously used passwords.
      </p>

      {/* Error Notification */}
      {errorMessage && (
        <div className="w-full mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium text-center">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-900">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password..."
                      className="bg-[#E9ECEF] border-none text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg h-11 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-900">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password..."
                      className="bg-[#E9ECEF] border-none text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg h-11 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.99] text-white font-semibold text-sm rounded-full transition-all shadow-md shadow-brand-blue/20 cursor-pointer disabled:opacity-50 mt-3 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Updating...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-sm text-gray-600 text-center mt-6">
        Back to{" "}
        <Link
          href="/auth/sign-in"
          className="text-brand-blue font-semibold hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <React.Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <ResetPasswordContent />
      </React.Suspense>
    </main>
  )
}
