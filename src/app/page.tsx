
"use client";

import React from "react";
import LandingHeader from "@/components/layout/landing-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FlaskConical, Target, TrendingUp, Smile, CheckCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-card/80 backdrop-blur-sm border border-border/20 rounded-xl p-6 shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl">
        <div className="bg-primary/10 text-primary w-14 h-14 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
    <div className="relative p-0.5 rounded-lg bg-gradient-to-r from-primary to-yellow-400 shadow-lg">
        <div className="bg-white rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-1">
                <div className="text-yellow-500 flex-shrink-0">
                    {icon}
                </div>
                <div className="text-xl font-bold text-red-900">{value}</div>
            </div>
            <div className="text-sm text-red-700">{label}</div>
        </div>
    </div>
);

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <LandingHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full min-h-[120vh] flex items-start pt-36">
                    {/* Desktop View - Unchanged */}
                    <div className="hidden md:block absolute inset-0 w-full h-full">
                        <Image
                            src="/final_cover.png"
                            alt="KitaMo Financial Simulator background"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                    <div className="hidden md:block relative container max-w-7xl mx-auto px-4 z-10">
                       <div className="max-w-xl text-center md:text-left">
                           <div className="space-y-6">
                                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-foreground">
                                    Basta may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">kita</span>,<br />
                                    may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">matatamo.</span>
                                </h1>
                                <p className="max-w-lg mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground">
                                   Make smarter money decisions with AI-powered what-if scenarios.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button asChild size="lg" className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground shadow-xl transition-transform hover:scale-105">
                                        <Link href="/signup">
                                            Start Your Financial Journey
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="lg" 
                                        className="border-2 border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:scale-105"
                                        onClick={() => {
                                            const featuresSection = document.getElementById('features');
                                            if (featuresSection) {
                                                const offsetTop = featuresSection.offsetTop - -80; // Center the section with equal spacing
                                                window.scrollTo({
                                                    top: offsetTop,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
                                     <StatCard icon={<CheckCircle className="w-6 h-6" />} value="10k+" label="Scenarios Simulated" />
                                     <StatCard icon={<TrendingUp className="w-6 h-6" />} value="50M+" label="Goals Achieved" />
                                     <StatCard icon={<Smile className="w-6 h-6" />} value="95%" label="Satisfaction Rate" />
                                </div>
                           </div>
                       </div>
                    </div>

                    {/* Mobile View - New Layout */}
                    <div className="md:hidden w-full min-h-screen bg-white flex flex-col">
                        {/* Mobile Content */}
                        <div className="px-4 pt-0 pb-1 -mt-2">
                            <div className="text-center space-y-4">
                                <h1 className="text-[2.70rem] font-extrabold tracking-tighter leading-tight text-foreground">
                                    Basta may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">kita</span>,<br />
                                    may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">matatamo.</span>
                                </h1>
                                <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                                   Make smarter money decisions with<br />AI-powered what-if scenarios.
                                </p>

                                <div className="pt-2">
                                    <Button asChild size="default" className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full max-w-xs">
                                        <Link href="/login" className="text-center">
                                            Start Your Financial Journey
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Image - Moved Lower */}
                        <div className="relative h-80 w-full overflow-hidden mt-10">
                            <Image
                                src="/mobile_cover.png"
                                alt="KitaMo Financial Simulator mobile illustration"
                                fill
                                className="object-contain object-center"
                                priority
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="relative py-16 md:py-24 pb-16 md:pb-24 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* Left Side - Phone Mockup with Title */}
                            <div className="relative">
                                <Image
                                    src="/phone.png"
                                    alt="KitaMo Financial App Phone Mockup"
                                    width={1700}
                                    height={2000}
                                    className="w-full h-auto max-w-2xl mx-auto lg:max-w-none lg:w-[120%] lg:-ml-[10%]"
                                    priority
                                />
                                {/* Upper Right Text */}
                                <div className="absolute top-12 lg:top-18 right-0 lg:right-[-16%] z-10">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tighter leading-tight text-right">
                                        <span className="text-foreground">Kita mo</span><br />
                                        <span className="text-foreground">ang </span>
                                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">bukas.</span><br />
                                    </h2>
                                </div>
                                
                                {/* Bottom Left Text */}
                                <div className="absolute bottom-8 lg:bottom-12 left-0 lg:left-[-1%] z-10">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tighter leading-tight text-left">
                                        <span className="text-foreground">Mula</span><br />
                                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ngayon.</span>
                                    </h2>
                                </div>
                            </div>
                            
                            {/* Right Side - Features Card */}
                            <div className="relative lg:-ml-[5%]">
                                <div className="bg-gradient-to-br from-red-800 to-yellow-400 rounded-2xl p-1 max-w-lg ml-auto">
                                    <div className="bg-white rounded-2xl p-6 lg:p-6 h-full">
                                        {/* Features Header */}
                                        <div className="mb-4 -m-6 mb-6 p-4 px-6 bg-gradient-to-r from-primary to-yellow-400 rounded-t-2xl">
                                            <h3 className="text-xl font-bold text-white tracking-tight">KitaMo Features</h3>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {/* Kitabot Feature */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:shadow-lg group">
                                            <div className="bg-red-100 text-red-700 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:bg-red-200">
                                                <Bot className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300 group-hover:text-red-800">Kitabot</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Chat with your finance companion. Get instant answers, personalized guidance, and tips based on your financial data.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* What-If Simulator Feature */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:shadow-lg group">
                                            <div className="bg-red-100 text-red-700 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:bg-red-200">
                                                <FlaskConical className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300 group-hover:text-red-800">What-If Simulator</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Experiment with scenarios. See how changes in income, expenses, or timelines affect your goals.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* BPI Product Recommender Feature */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:shadow-lg group">
                                            <div className="bg-red-100 text-red-700 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:bg-red-200">
                                                <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300 group-hover:text-red-800">BPI Product Recommender</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    View BPI products tailored to your simulated goals to help you achieve them faster.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Goal Tracker Feature */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:shadow-lg group">
                                            <div className="bg-red-100 text-red-700 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:bg-red-200">
                                                <Target className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300 group-hover:text-red-800">Goal Tracker</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Create, manage, and prioritize your financial goals. Visualize your progress and get AI-powered insights to stay on track.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* AI-Powered Insights Feature */}
                                        <div className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:shadow-lg group">
                                            <div className="bg-red-100 text-red-700 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:bg-red-200">
                                                <TrendingUp className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300 group-hover:text-red-800">AI-Powered Insights</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Get personalized tips and recommendations to reach financial freedom faster.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>            {/* Third Screen - Why use KitaMo? */}
            <section className="pt-0 md:pt-2 pb-20 md:pb-48 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-foreground">
                            Why use <span className="bg-gradient-to-r from-red-800 to-yellow-400 bg-clip-text text-transparent">KitaMo</span>?
                        </h2>
                    </div>

                    {/* Benefits Cards with Gradient Background */}
                    <div className="relative">
                        {/* Gradient background matching second screen full width */}
                        <div className="absolute inset-0 top-32 bottom-16">
                            <div className="container max-w-7xl mx-auto px-4">
                                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
                                    {/* Left side starting from "Mula ngayon" position */}
                                    <div className="bg-gradient-to-br from-red-800 to-yellow-400 rounded-3xl h-full lg:-mr-4"></div>
                                    {/* Right side ending at features card edge */}
                                    <div className="bg-gradient-to-br from-red-800 to-yellow-400 rounded-3xl h-full lg:-ml-[5%]"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Cards positioned over gradient */}
                        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
                            {/* Benefit Card 1 - Smarter Financial Decisions */}
                            <div className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden bg-white max-w-xs mx-auto">
                                <div className="mb-0">
                                    <Image
                                        src="/benefit_1.png"
                                        alt="Smarter Financial Decisions"
                                        width={300}
                                        height={400}
                                        className="w-full h-80 object-cover"
                                    />
                                </div>
                                <div className="bg-white p-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                                        Smarter Financial Decisions
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed text-center">
                                        Get AI-powered insights and personalized recommendations to help you choose the best financial path for your goals.
                                    </p>
                                </div>
                            </div>

                            {/* Benefit Card 2 - Clearer Goal Tracking */}
                            <div className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden bg-white max-w-xs mx-auto">
                                <div className="mb-0">
                                    <Image
                                        src="/benefit_2.png"
                                        alt="Clearer Goal Tracking"
                                        width={300}
                                        height={400}
                                        className="w-full h-80 object-cover"
                                    />
                                </div>
                                <div className="bg-white p-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                                        Clearer Goal Tracking
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed text-center">
                                        Easily monitor your progress toward savings, investments, or debt reduction with intuitive visual tools.
                                    </p>
                                </div>
                            </div>

                            {/* Benefit Card 3 - Confidence in Your Future */}
                            <div className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden bg-white max-w-xs mx-auto">
                                <div className="mb-0">
                                    <Image
                                        src="/benefit_3.png"
                                        alt="Confidence in Your Future"
                                        width={300}
                                        height={400}
                                        className="w-full h-80 object-cover"
                                    />
                                </div>
                                <div className="bg-white p-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                                        Confidence in Your Future
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed text-center">
                                        Plan ahead with simulations and guidance that keep you on track. No more guesswork!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-8 border-t bg-background">
                <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} KitaMo by Techtonix. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
