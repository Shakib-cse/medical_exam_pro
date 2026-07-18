"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

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
  const fromSource = searchParams.get("from")

  const [otpValues, setOtpValues] = React.useState<string[]>(Array(6).fill(""))
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
    // Handle pasted content
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

    // Auto-focus next input
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

  function onSubmit(data: VerifyFormValues) {
    console.log("Verification submitted:", data)
    if (fromSource === "signup") {
      router.push("/auth/sign-in")
    } else {
      router.push("/auth/reset-password")
    }
  }

  return (
    <div className="w-full max-w-[440px] flex flex-col items-center">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/images/commonLayout/logo.png"
          alt="MedicalExamPro Logo"
          width={220}
          height={70}
          priority
          className="h-auto w-auto max-h-16 object-contain"
        />
      </div>

      {/* Title & Description */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
        Enter Verification Code
      </h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        We&apos;ve sent a 6-digit verification code to your email.
      </p>

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
                        className="w-12 h-12 text-center text-lg font-bold bg-[#E9ECEF] border-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 text-gray-900 transition-colors"
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="self-start" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-[#288ECB] hover:bg-[#207ab7] active:bg-[#1a6699] text-white font-semibold text-sm rounded-xl transition-colors shadow-none mt-2"
          >
            Verify Code
          </Button>
        </form>
      </Form>

      {/* Resend Code */}
      <p className="text-sm text-gray-600 text-center mt-6">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={() => console.log("Resend code clicked")}
          className="text-[#288ECB] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Resend Code
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
