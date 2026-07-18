"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Input } from "@/components/ui/input"

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: ForgotPasswordFormValues) {
    console.log("Forgot password submitted:", data)
    router.push("/auth/verify")
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] flex flex-col items-center">
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
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your registered email address to receive a verification code.
        </p>

        {/* Form */}
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
                      className="bg-[#E9ECEF] border-none text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-[#288ECB] hover:bg-[#207ab7] active:bg-[#1a6699] text-white font-semibold text-sm rounded-xl transition-colors shadow-none mt-3"
            >
              Send Code
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Remember your password?{" "}
          <Link
            href="/auth/sign-in"
            className="text-[#288ECB] font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </main>
  )
}
