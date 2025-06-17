"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { auth, db, FieldValue } from '@/lib/firebase';
import { LockKeyhole, User, ArrowLeft, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type RegisterFormInputs = z.infer<typeof registerSchema>;

const AuthForm: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await auth.signInWithEmailAndPassword(data.email, data.password);
      // Auth state change will handle redirect in parent component
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error: any) {
      setAuthError(error.message);
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(data.email, data.password);
      const user = userCredential.user;
      if (user) {
        await user.updateProfile({ displayName: data.fullName });
        await db.collection('users').doc(user.uid).set({
          name: data.fullName,
          email: user.email,
          balance: 2458.32, // Default starting balance
          createdAt: FieldValue.serverTimestamp(),
        });
        toast({ title: "Registration Successful", description: "Welcome to MAE!" });
        // Auth state change will handle redirect
      }
    } catch (error: any) {
      setAuthError(error.message);
      toast({ variant: "destructive", title: "Registration Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoginView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md shadow-2xl rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary p-4 rounded-full w-fit mb-4">
              <Landmark className="h-10 w-10 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-3xl">Welcome to MAE</CardTitle>
            <CardDescription className="font-body">Sign in to access your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="loginEmail" className="font-body">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="you@example.com"
                  {...loginForm.register('email')}
                  className="font-body"
                  aria-invalid={loginForm.formState.errors.email ? "true" : "false"}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword" className="font-body">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register('password')}
                  className="font-body"
                  aria-invalid={loginForm.formState.errors.password ? "true" : "false"}
                />
                 {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
                <div className="flex justify-end">
                  <Button variant="link" type="button" className="p-0 h-auto text-sm text-primary font-body" onClick={() => alert('Forgot password functionality not implemented.')}>
                    Forgot password?
                  </Button>
                </div>
              </div>
              {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
              <Button type="submit" className="w-full font-headline text-lg py-3" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'} <LockKeyhole className="ml-2 h-5 w-5" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground font-body">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto text-primary font-bold" onClick={() => setIsLoginView(false)}>
                Register
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => setIsLoginView(true)} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="font-headline text-3xl">Create Account</CardTitle>
          </div>
          <CardDescription className="font-body">Join MAE and manage your finances effectively.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="registerName" className="font-body">Full Name</Label>
              <Input
                id="registerName"
                placeholder="John Doe"
                {...registerForm.register('fullName')}
                className="font-body"
                aria-invalid={registerForm.formState.errors.fullName ? "true" : "false"}
              />
              {registerForm.formState.errors.fullName && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerEmail" className="font-body">Email</Label>
              <Input
                id="registerEmail"
                type="email"
                placeholder="you@example.com"
                {...registerForm.register('email')}
                className="font-body"
                aria-invalid={registerForm.formState.errors.email ? "true" : "false"}
              />
              {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerPassword" className="font-body">Password</Label>
              <Input
                id="registerPassword"
                type="password"
                placeholder="••••••••"
                {...registerForm.register('password')}
                className="font-body"
                aria-invalid={registerForm.formState.errors.password ? "true" : "false"}
              />
              {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
              )}
              <p className="text-xs text-muted-foreground font-body">Password must be at least 6 characters.</p>
            </div>
            {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
            <Button type="submit" className="w-full font-headline text-lg py-3" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'} <User className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
