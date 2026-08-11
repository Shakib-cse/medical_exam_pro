"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"

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
import { setSession } from "@/redux/slices/authSlice"

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})

type SignInFormValues = z.infer<typeof signInSchema>

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  const verifiedParam = searchParams.get("verified")
  const emailParam = searchParams.get("email") || ""

  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    verifiedParam === "true" ? "Email verified successfully! You can now log in." : null
  )

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: emailParam,
      password: "",
    },
  })

  React.useEffect(() => {
    if (emailParam) {
      form.setValue("email", emailParam)
    }
  }, [emailParam, form])

  async function onSubmit(data: SignInFormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const response = await authApi.login(data)
      if (response.data?.token && response.data?.user) {
        dispatch(setSession({ token: response.data.token, user: response.data.user }))
        router.push("/dashboard")
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please try again.")
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

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">
        Log in to your account
      </h1>

      {/* Success Notification */}
      {successMessage && (
        <div className="w-full mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-medium flex items-center gap-2 justify-center">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Password
                    </FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-semibold text-brand-orange hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password..."
                        className="bg-[#E9ECEF] border-none text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg h-11 pr-10"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-brand-orange hover:bg-brand-orange/90 active:scale-[0.99] text-white font-semibold text-sm rounded-full transition-all shadow-md shadow-brand-orange/20 cursor-pointer disabled:opacity-50 mt-3 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-brand-orange font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
  )
}

export default function SignInPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <React.Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SignInContent />
      </React.Suspense>
    </main>
  )
}
