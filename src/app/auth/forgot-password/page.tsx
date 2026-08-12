"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await authApi.forgotPassword({ email: data.email })
      router.push(`/auth/verify?from=forgot-password&email=${encodeURIComponent(data.email)}`)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
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
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your registered email address to receive a verification code.
        </p>

        {/* Error Notification */}
        {errorMessage && (
          <div className="w-full mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Form here*/}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-900">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      className="bg-[#E9ECEF] border-none text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg h-11"
                      {...field}
                    />
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending Code...
                </span>
              ) : (
                "Send Code"
              )}
            </button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Remember your password?{" "}
          <Link
            href="/auth/sign-in"
            className="text-brand-blue font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </main>
  )
}
