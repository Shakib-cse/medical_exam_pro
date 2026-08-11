"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
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
import { authApi } from "@/lib/auth"
import { setSession } from "@/redux/slices/authSlice"

const verifySchema = z.object({
  code: z
    .string()
    .min(6, { message: "Verification code must be 6 digits" })
    .max(6, { message: "Verification code must be 6 digits" }),
})

type VerifyFormValues = z.infer<typeof verifySchema>

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  const emailParam = searchParams.get("email") || ""
  const fromSource = searchParams.get("from")

  const [otpValues, setOtpValues] = React.useState<string[]>(Array(6).fill(""))
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isResending, setIsResending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otpValues]
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("")
      pasted.forEach((char, i) => {
        newOtp[i] = char
      })
      setOtpValues(newOtp)
      const combined = newOtp.join("")
      form.setValue("code", combined, { shouldValidate: true })
      const lastIndex = Math.min(pasted.length - 1, 5)
      inputRefs.current[lastIndex]?.focus()
      return
    }

    newOtp[index] = value.slice(-1)
    setOtpValues(newOtp)
    const combined = newOtp.join("")
    form.setValue("code", combined, { shouldValidate: true })

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  async function onSubmit(data: VerifyFormValues) {
    if (!emailParam) {
      setErrorMessage("Missing email address. Please request a new verification code.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const type = fromSource === "signup" ? "verify_email" : "reset_password"

    try {
      const res = await authApi.verifyOtp({
        email: emailParam,
        code: data.code,
        type,
      })

      if (fromSource === "signup") {
        setSuccessMessage("Email verified successfully! Redirecting to login...")
        setTimeout(() => {
          router.push(`/auth/sign-in?verified=true&email=${encodeURIComponent(emailParam)}`)
        }, 1200)
      } else {
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(emailParam)}&code=${encodeURIComponent(data.code)}`
        )
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Verification failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResendCode() {
    if (!emailParam) {
      setErrorMessage("Missing email address to resend code.")
      return
    }

    setIsResending(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const type = fromSource === "signup" ? "verify_email" : "reset_password"

    try {
      const res = await authApi.resendOtp({ email: emailParam, type })
      setSuccessMessage(res.message || "A new 6-digit code has been sent to your email.")
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend verification code.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="w-full max-w-[440px] flex flex-col items-center">
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
        Enter Verification Code
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        We&apos;ve sent a 6-digit verification code to{" "}
        <span className="font-semibold text-gray-800">
          {emailParam || "your email"}
        </span>
        .
      </p>

      {/* Error & Success Notifications */}
      {errorMessage && (
        <div className="w-full mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium text-center">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="w-full mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs sm:text-sm font-medium text-center">
          {successMessage}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="code"
            render={() => (
              <FormItem className="w-full space-y-2 flex flex-col items-center">
                <FormLabel className="text-sm font-semibold text-gray-900 self-start">
                  Verification Code
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2 sm:gap-3 justify-between w-full">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpValues[idx]}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-12 h-12 text-center text-lg font-bold bg-[#E9ECEF] border-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue text-gray-900 transition-colors"
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="self-start" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.99] text-white font-semibold text-sm rounded-full transition-all shadow-md shadow-brand-blue/20 cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
              </span>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>
      </Form>

      {/* Resend Code */}
      <p className="text-sm text-gray-600 text-center mt-6">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          disabled={isResending}
          onClick={handleResendCode}
          className="text-brand-blue font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend Code"}
        </button>
      </p>

      {/* Back to Sign In */}
      <p className="text-xs text-gray-500 text-center mt-4">
        <Link
          href="/auth/sign-in"
          className="hover:underline text-gray-600"
        >
          ← Back to Log In
        </Link>
      </p>
    </div>
  )
}

export default function VerificationPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <React.Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <VerifyContent />
      </React.Suspense>
    </main>
  )
}
