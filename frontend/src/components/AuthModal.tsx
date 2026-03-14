import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { BackgroundBeams } from "./BackgroundBeams";
import { Meteors } from "./Meteors";
import { cn } from "../lib/utils";

export const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Cinematic Background Layer */}
      <BackgroundBeams className="opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(9,9,11,1)_100%)]" />
      
      <div className="z-10 w-full max-w-md relative group">
        {/* Frosty Background Ray Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-[2.5rem] blur-2xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative px-8 py-12 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
          {/* Internal Meteor Effect for the card */}
          <Meteors number={15} className="z-0 opacity-20" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-white mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Join the Club"}
            </h2>
            <p className="text-zinc-400 text-center mb-10 text-sm">
              {isLogin ? "Enter your credentials to access your dashboard" : "Start your career acceleration today"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 ml-4 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-sans"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 ml-4 mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 ml-4 mb-1 block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-sans"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4">
                  <p className="text-red-400 text-xs text-center font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full relative group/btn h-14 bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-2xl font-bold shadow-[0px_1px_0px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_0px_0px_rgba(255,255,255,0.1)_inset] hover:scale-[1.01] active:scale-[0.98] transition duration-200"
              >
                <span className="relative z-10">{isLogin ? "Sign In →" : "Create Account →"}</span>
                {/* Bottom Gradient for Button */}
                <div className="absolute inset-x-0 -bottom-px h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover/btn:scale-x-100 transition duration-500" />
              </button>
            </form>

            <div className="mt-8 text-center">
              {isLogin ? (
                <p className="text-sm text-zinc-500">
                  New member?{" "}
                  <button onClick={() => setIsLogin(false)} className="text-white font-medium hover:text-purple-400 transition-colors underline underline-offset-4">
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-sm text-zinc-500">
                  Been here before?{" "}
                  <button onClick={() => setIsLogin(true)} className="text-white font-medium hover:text-purple-400 transition-colors underline underline-offset-4">
                    Log in instead
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
