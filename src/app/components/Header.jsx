"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from "next/link";
import Image from "next/image";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { isConnected, address } = useAccount();

    const navItems = [
        { name: "Brands", href: "/brands" },
        { name: "About Us", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Contact Us", href: "/contact" }
    ];

    // Determine button text and action based on current route
    const getHeaderButton = () => {
        if (pathname === "/get-started") {
            return {
                text: "Connect Wallet",
                action: () => {
                    console.log("Connect Wallet clicked - navigating to /connect-wallet");
                    window.location.href = "/connect-wallet";
                }
            };
        }
        
        if (pathname === "/connect-wallet") {
            return {
                text: "Dashboard",
                action: () => {
                    console.log("Dashboard clicked - navigating to /dashboard/manufacturer");
                    window.location.href = "/dashboard/manufacturer";
                }
            };
        }
        
        if (pathname === "/login") {
            return {
                text: "Dashboard",
                action: () => {
                    console.log("Dashboard clicked - navigating to /dashboard/manufacturer");
                    window.location.href = "/dashboard/manufacturer";
                }
            };
        }
        
        return {
            text: "Get Started",
            action: () => {
                console.log("Get Started clicked - navigating to /get-started");
                window.location.href = "/get-started";
            }
        };
    };

    const headerButton = getHeaderButton();

    return (
        <header className="w-full bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
            <div className="flex flex-row w-full justify-between items-center py-4 px-6 md:px-10 lg:px-[91px]">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <Image src="/genun.png" alt="genun-logo" width={80} height={80} className="h-16 md:h-20 w-auto hover:scale-105 transition-transform duration-300" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-white/80 hover:text-white transition-colors duration-300 font-medium relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </nav>

                {/* Dynamic Header Button */}
                <div className="hidden md:block">
                    {isConnected && address ? (
                        <ConnectButton.Custom>
                            {({ openAccountModal, mounted }) => {
                                return (
                                    <button
                                        onClick={openAccountModal}
                                        disabled={!mounted}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-green-400 font-mono text-sm">
                                            {address.slice(0, 6)}...{address.slice(-4)}
                                        </span>
                                    </button>
                                );
                            }}
                        </ConnectButton.Custom>
                    ) : pathname === "/get-started" ? (
                        <ConnectButton.Custom>
                            {({ openConnectModal, mounted }) => {
                                return (
                                    <button 
                                        onClick={openConnectModal}
                                        disabled={!mounted}
                                        className="px-6 py-2 text-white rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium hover:shadow-lg hover:shadow-blue-400/25"
                                        style={{backgroundColor: '#00AFFF'}}
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }}
                        </ConnectButton.Custom>
                    ) : (
                        <button 
                            onClick={headerButton.action}
                            className="px-6 py-2 text-white rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium hover:shadow-lg hover:shadow-blue-400/25"
                            style={{backgroundColor: '#00AFFF'}}
                        >
                            {headerButton.text}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col space-y-4 p-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-white/80 hover:text-white transition-colors duration-300 font-medium py-2 border-b border-white/10 last:border-b-0"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {isConnected && address ? (
                            <ConnectButton.Custom>
                                {({ openAccountModal, mounted }) => {
                                    return (
                                        <button
                                            onClick={() => {
                                                openAccountModal();
                                                setIsMenuOpen(false);
                                            }}
                                            disabled={!mounted}
                                            className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all duration-300 cursor-pointer w-full"
                                        >
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-400 font-mono text-sm">
                                                {address.slice(0, 6)}...{address.slice(-4)}
                                            </span>
                                        </button>
                                    );
                                }}
                            </ConnectButton.Custom>
                        ) : pathname === "/get-started" ? (
                            <ConnectButton.Custom>
                                {({ openConnectModal, mounted }) => {
                                    return (
                                        <button 
                                            onClick={() => {
                                                openConnectModal();
                                                setIsMenuOpen(false);
                                            }}
                                            disabled={!mounted}
                                            className="mt-4 px-6 py-3 text-white rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium w-full"
                                            style={{backgroundColor: '#00AFFF'}}
                                        >
                                            Connect Wallet
                                        </button>
                                    );
                                }}
                            </ConnectButton.Custom>
                        ) : (
                            <button 
                                onClick={() => {
                                    headerButton.action();
                                    setIsMenuOpen(false);
                                }}
                                className="mt-4 px-6 py-3 text-white rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium w-full"
                                style={{backgroundColor: '#00AFFF'}}
                            >
                                {headerButton.text}
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;