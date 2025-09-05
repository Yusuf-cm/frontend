"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/auth/useAuth";
import SearchBar from "./SearchBar";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const { user, logoutUser } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const wishlistCount = user?.wishlist?.length || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---- Account Dropdown (desktop) ----
  const authLinksDesktop = user ? (
    <div className="relative">
      <button
        onClick={() => setIsAccountOpen(!isAccountOpen)}
        className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <FiUser className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {isAccountOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100"
          >
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.username}
              </p>
            </div>
            <Link
              href="/account"
              onClick={() => setIsAccountOpen(false)}
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              My Account
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setIsAccountOpen(false)}
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              My Orders
            </Link>
            <Link
              href="/account/wishlist"
              onClick={() => setIsAccountOpen(false)}
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              Wishlist
            </Link>
            <button
              onClick={() => {
                logoutUser();
                setIsAccountOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <Link
      href="/login"
      className="text-gray-600 hover:text-indigo-600 transition-colors"
    >
      <FiUser className="h-5 w-5" />
    </Link>
  );

  const authLinksMobile = user ? (
    <>
      <Link
        href="/account"
        onClick={toggleMenu}
        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
      >
        <FiUser className="mr-3 h-5 w-5" />
        My Account
      </Link>
      <Link
        href="/account/wishlist"
        onClick={toggleMenu}
        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
      >
        <FiHeart className="mr-3 h-5 w-5" />
        Wishlist
      </Link>
      <button
        onClick={() => {
          logoutUser();
          toggleMenu();
        }}
        className="w-full text-left flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50"
      >
        <FiUser className="mr-3 h-5 w-5" />
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        onClick={toggleMenu}
        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
      >
        <FiUser className="mr-3 h-5 w-5" />
        Login
      </Link>
      <Link
        href="/register"
        onClick={toggleMenu}
        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
      >
        <FiUser className="mr-3 h-5 w-5" />
        Register
      </Link>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-transform hover:scale-105"
            >
              <Image
                src="/favicon.svg"
                alt="Ronohs Decor Logo"
                width={36}
                height={36}
                priority
              />
              <span className="text-2xl font-serif font-bold text-gray-900 group-hover:text-indigo-600">
                Ronohs Decor
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <div className="w-64">
              <SearchBar />
            </div>
            {authLinksDesktop}
            <Link
              href="/account/wishlist"
              className="text-gray-600 hover:text-indigo-600 transition-colors relative"
            >
              <FiHeart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <div className="flow-root">
              <Link
                href="/cart"
                className="group -m-2 p-2 flex items-center relative"
              >
                <FiShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mobile-menu-container bg-white overflow-hidden absolute w-full shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              <div className="p-2">
                <SearchBar onSearch={() => toggleMenu()} />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={toggleMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-2" />
              {authLinksMobile}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
