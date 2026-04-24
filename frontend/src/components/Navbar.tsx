"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Menu, X, Film, Compass, Star, Clapperboard,
  Sparkles, BarChart3, User, LogOut, LogIn, ArrowLeftRight,
  History as HistoryIcon,
} from "lucide-react";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/lib/AuthContext";
import { useVoiceNavigation } from "@/hooks/useVoiceNavigation";
import { Mic, MicOff, Volume2 } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState("");
  const router = useRouter();

  // Voice Navigation Implementation
  const voiceCommands = useMemo(() => [
    { patterns: ["go to dashboard", "show stats", "my dashboard"], callback: () => router.push("/dashboard") },
    { patterns: ["go home", "take me home", "back to home"], callback: () => router.push("/") },
    { patterns: ["open mood", "find a mood", "show moods"], callback: () => router.push("/mood") },
    { patterns: ["open time machine", "take me back", "time machine"], callback: () => router.push("/time-machine") },
    { patterns: ["browse genres", "show categories", "open genres"], callback: () => router.push("/genre") },
    { patterns: ["compare movies", "open compare", "comparison"], callback: () => router.push("/compare") },
    { patterns: ["top rated", "show top rated", "best movies"], callback: () => router.push("/search?sort=top_rated") },
    { patterns: ["discover", "explore", "show discovery"], callback: () => router.push("/search") },
    { 
      patterns: ["search for", "find movies with", "find a movie called"], 
      callback: (transcript: string) => {
        let query = "";
        if (transcript.includes("search for")) query = transcript.split("search for")[1];
        else if (transcript.includes("find movies with")) query = transcript.split("find movies with")[1];
        else if (transcript.includes("find a movie called")) query = transcript.split("find a movie called")[1];
        
        if (query.trim()) {
          setSearchInitialQuery(query.trim());
          setSearchOpen(true);
        } else {
          setSearchOpen(true); // Just open if no query extracted
        }
      } 
    },
    { patterns: ["open search", "find movies"], callback: () => { setSearchInitialQuery(""); setSearchOpen(true); } },
    { patterns: ["close search", "stop searching"], callback: () => setSearchOpen(false) },
    { patterns: ["sign out", "logout"], callback: () => logout() },
  ], [router, logout]); // Dependencies for the callbacks

  const { isListening, startAssistant, stopAssistant, lastCommand } = useVoiceNavigation(voiceCommands);
  
  // Keyboard Shortcut: Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  const navLinks = [
    { href: "/search", label: "Discover", icon: Compass },
    { href: "/genre", label: "Genres", icon: Clapperboard },
    { href: "/mood", label: "Mood", icon: Sparkles },
    { href: "/compare", label: "Compare", icon: ArrowLeftRight },
    { href: "/time-machine", label: "Time Machine", icon: HistoryIcon },
    { href: "/search?sort=top_rated", label: "Top Rated", icon: Star },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center shadow-lg shadow-gold/10 group-hover:shadow-gold/20 transition-shadow">
                <Film className="w-[18px] h-[18px] text-surface-0" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-bold font-display tracking-tight">
                  Cine<span className="text-gold">Quest</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-body mt-0.5">
                  Cinema Discovery
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href + label}
                  href={href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              {/* Voice Assistant Toggle */}
              <button
                onClick={isListening ? stopAssistant : startAssistant}
                className={`p-2 rounded-lg transition-all ${
                  isListening 
                  ? "bg-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                  : "text-white/20 hover:text-white/40 hover:bg-white/5"
                }`}
                title={isListening ? "Deactivate Voice Assistant" : "Activate Voice Assistant"}
              >
                {isListening ? (
                  <div className="relative">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-surface-0" />
                  </div>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Status Indicator (Last Command) */}
              {isListening && lastCommand && (
                <div className="hidden lg:flex items-center px-3 h-8 rounded-full bg-white/[0.03] border border-white/5 animate-fade-in">
                  <span className="text-[10px] text-gold/40 uppercase tracking-tighter mr-2">Command:</span>
                  <span className="text-[10px] text-white/60 font-medium truncate max-w-[100px] italic">
                    &ldquo;{lastCommand}&rdquo;
                  </span>
                </div>
              )}

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="group flex items-center gap-2 h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-gold/20 hover:bg-white/[0.06] transition-all duration-200"
              >
                <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-gold transition-colors" />
                <span className="hidden sm:inline text-xs text-white/30">Search...</span>
                <kbd className="hidden lg:inline text-[10px] text-white/15 bg-white/5 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </button>

              {/* Auth / User */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg bg-gold/10 border border-gold/15 hover:border-gold/25 transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center">
                      <span className="text-[10px] font-bold text-surface-0">
                        {user?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-xs text-gold font-medium">
                      {user?.username}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-12 w-48 glass-card rounded-xl p-2 z-50 animate-scale-in shadow-xl shadow-black/40">
                        <div className="h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent mb-1" />
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r from-gold to-gold-dim text-surface-0 text-xs font-semibold hover:shadow-lg hover:shadow-gold/15 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Mobile menu */}
              <button
                className="md:hidden w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 px-6 py-4 space-y-1 animate-fade-in">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href + label}
                href={href}
                className="block text-sm text-white/50 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="block text-sm text-white/50 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>

      <SearchModal 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        initialQuery={searchInitialQuery} 
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
