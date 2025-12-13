'use client'

import { useRouter } from "next/navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

const GetStarted = () => {
    const router = useRouter();
    const { isConnected, address } = useAccount();

    // Log wallet connection status
    useEffect(() => {
        if (isConnected && address) {
            console.log('Wallet connected:', address);
        }
    }, [isConnected, address]);

    return (
        <section className="py-24 px-8">
            <div className="max-w-md mx-auto text-center">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        We help you be just
                        <span className="text-blue-400"> YOU</span>
                    </h1>
                    <p className="text-gray-300">
                        Connect your wallet to get started with Genun
                    </p>
                </div>
                
                {isConnected ? (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Wallet Connected!</h2>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-mono text-lg">
                                {address}
                            </span>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Great! Now choose how you'd like to continue:
                        </p>
                        
                        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-6 text-center">
                                Complete Your Setup
                            </h3>
                            
                            <div className="space-y-4">
                                <button 
                                    onClick={() => router.push("/signup?wallet=connected")}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 text-white rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium hover:shadow-lg hover:shadow-blue-400/25"
                                    style={{backgroundColor: '#00AFFF'}}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Create New Account
                                </button>
                                
                                <button 
                                    onClick={() => router.push("/login?wallet=connected")}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-600 hover:border-blue-400 text-white rounded-lg transition-all duration-300 hover:bg-gray-800/50 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In to Existing Account
                                </button>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-gray-600">
                                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-blue-400 font-medium">
                                        Connected: {address?.slice(0, 8)}...{address?.slice(-6)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Connect Your Wallet
                            </h2>
                            
                            <ConnectButton.Custom>
                                {({
                                    account,
                                    chain,
                                    openAccountModal,
                                    openChainModal,
                                    openConnectModal,
                                    authenticationStatus,
                                    mounted,
                                }) => {
                                    const ready = mounted && authenticationStatus !== 'loading';
                                    const connected =
                                        ready &&
                                        account &&
                                        chain &&
                                        (!authenticationStatus ||
                                            authenticationStatus === 'authenticated');

                                    return (
                                        <div
                                            {...(!ready && {
                                                'aria-hidden': true,
                                                'style': {
                                                    opacity: 0,
                                                    pointerEvents: 'none',
                                                    userSelect: 'none',
                                                },
                                            })}
                                        >
                                            {(() => {
                                                if (!connected) {
                                                    return (
                                                        <button
                                                            onClick={openConnectModal}
                                                            type="button"
                                                            className="w-full px-8 py-4 text-white rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium hover:shadow-lg hover:shadow-blue-400/25 text-lg"
                                                            style={{backgroundColor: '#00AFFF'}}
                                                        >
                                                            🔗 Connect Wallet
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <div className="text-center">
                                                        <p className="text-green-400 mb-4">✅ Wallet Connected</p>
                                                        <p className="text-gray-300">Setting up your account...</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    );
                                }}
                            </ConnectButton.Custom>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-4">Or continue with email</p>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => router.push("/signup")}
                                    className="w-full px-6 py-3 border-2 border-gray-600 hover:border-blue-400 text-white rounded-lg transition-all duration-300 hover:bg-gray-800/50"
                                >
                                    📝 Create Account
                                </button>
                                <button 
                                    onClick={() => router.push("/login")}
                                    className="w-full px-6 py-3 border-2 border-gray-600 hover:border-blue-400 text-white rounded-lg transition-all duration-300 hover:bg-gray-800/50"
                                >
                                    🔑 Sign In
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <button
                                onClick={() => router.push('/')}
                                className="text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}


export default GetStarted;