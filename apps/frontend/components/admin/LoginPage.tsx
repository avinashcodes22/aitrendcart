"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Mail, Lock, Chrome } from "lucide-react";
import { toast } from "sonner";

export const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: replace this with real API call: POST /api/admin/auth/login
    setTimeout(() => {
      if (email && password) {
        toast.success("Login successful!");
        router.push("/admin");
      } else {
        toast.error("Please enter valid credentials");
      }
      setLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    toast.info("Google OAuth integration coming soon");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber/10 via-background to-cyber-pink/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyber/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-pink/20 rounded-full blur-3xl animate-pulse-slow" />

      {/* Login Card */}
      <div className="relative glass-card p-8 rounded-2xl w-full max-w-md border border-border/50 neon-glow">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyber to-cyber-pink flex items-center justify-center neon-glow">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 font-orbitron">
          <span className="text-cyber">AI</span>trendcart
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Admin Portal Access
        </p>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyber" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@aitrendcart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-cyber"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyber" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-cyber"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyber to-cyber-pink hover:opacity-90 neon-glow"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background/50 border-border/50 focus:border-cyber"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-border/50 focus:border-ccyber"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-border/50 focus:border-cyber"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyber to-cyber-pink hover:opacity-90 neon-glow"
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4 border-border/50 hover:bg-white/5"
            onClick={handleGoogleLogin}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Google OAuth
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
