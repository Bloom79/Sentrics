import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import bgImage from '@/assets/images/Designer.jpeg';

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.login({
        email: values.email,
        password: values.password,
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2FCE2] via-[#E5DEFF] to-[#F1F0FB]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: 'brightness(1.1) contrast(1.05)'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-2xl px-8">
        {/* Login Container with Glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-3xl px-16 py-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/30 transform transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          {/* Logo and Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-semibold text-gray-800">
              SentricS
            </h1>
            <p className="text-lg text-gray-600/90 mt-4">Enter your credentials to continue</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        disabled={isLoading}
                        autoComplete="email"
                        className="h-14 text-lg bg-white/50 border-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/60 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="h-14 text-lg bg-white/50 border-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/60 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-base" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg bg-gray-800/90 hover:bg-gray-700 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center mt-6">
                <a href="#" className="text-lg text-gray-600/90 hover:text-gray-800 transition-colors duration-300">
                  Forgot your password?
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Auth;