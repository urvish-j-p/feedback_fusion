"use client";

import { Map, MessageSquare, Shield, Sparkle, Menu, X } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { useState } from "react";

type NavbarClientProps = {
  isAdmin: boolean;
};

export default function NavbarClient({ isAdmin }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link
        href="/roadmap"
        onClick={() => setIsMenuOpen(false)}
        className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
      >
        <Map className="h-4 w-4" />
        Roadmap
      </Link>
      <Link
        href="/feedback"
        onClick={() => setIsMenuOpen(false)}
        className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Feedback
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          onClick={() => setIsMenuOpen(false)}
          className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Admin
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Sparkle className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold truncate">Feedback Fusion</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            <SignedOut>
              <SignInButton>
                <Button asChild size="sm" className="cursor-pointer">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 border-t flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200 bg-background">
            <div className="flex flex-col gap-4 px-2">
              <NavLinks />
            </div>
            <div className="border-t sm:hidden flex items-center h-14">
              <ThemeToggle label="Toggle Theme" className="w-full h-full px-2" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
