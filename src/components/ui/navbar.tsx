"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Sprout, User } from "lucide-react";
import ModeToggle from "./ModeToggle";
import { authClient } from "@/lib/auth/client";

function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  if (session?.user) {
    const { user } = session;

    const handleSignOut = async () => {
      await authClient.signOut();
      setMenuOpen(false);
      router.refresh();
    };

    return (
      <div className="relative" ref={menuRef}>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full overflow-hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open profile menu"
          aria-expanded={menuOpen}
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
              <User className="h-4 w-4" />
            </div>
          )}
        </Button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background py-1 shadow-lg">
            <div className="border-b px-3 py-2">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/sign-up"
        className="inline-flex text-lg text-indigo-400 hover:underline"
      >
        Sign-up
      </Link>
      <Link
        href="/sign-in"
        className="inline-flex text-lg text-indigo-400 hover:underline"
      >
        Sign-in
      </Link>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-primary font-momo tracking-wider"
          >
            🌱 Plantventory
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/plants">
              <Sprout className="w-4 h-4" />
              <span className="hidden lg:inline">Plants</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/">
              <Sprout className="w-4 h-4" />
              <span className="hidden lg:inline">Home</span>
            </Link>
          </Button>
          <ModeToggle />
          <AuthNav />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
