"use client";

import React, { useState } from "react";
import LandingHeader from "@/components/layout/landing-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FlaskConical, Target, TrendingUp, Smile, CheckCircle, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
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
    // Mobile features state
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(-1); // -1 means showing initial "Explore Features" card
    
    // Mobile benefits state
    const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
    
    const features = [
        { 
            icon: <Bot className="w-6 h-6" />,
            title: "Kitabot", 
            desc: "Chat with your finance companion. Get instant answers, personalized guidance, and tips based on your financial data.",
            mockup: "/phone.png"
        },
        { 
            icon: <FlaskConical className="w-6 h-6" />,
            title: "What-If Simulator", 
            desc: "Experiment with scenarios. See how changes in income, expenses, or timelines affect your goals.",
            mockup: "/phone.png"
        },
        { 
            icon: <ShoppingBag className="w-6 h-6" />,
            title: "BPI Product Recommender", 
            desc: "View BPI products tailored to your simulated goals to help you achieve them faster.",
            mockup: "/phone.png"
        },
        { 
            icon: <Target className="w-6 h-6" />,
            title: "Goal Tracker", 
            desc: "Create, manage, and prioritize your financial goals. Visualize your progress and get AI-powered insights to stay on track.",
            mockup: "/phone.png"
        },
        { 
            icon: <TrendingUp className="w-6 h-6" />,
            title: "AI-Powered Insights", 
            desc: "Get personalized tips and recommendations to reach financial freedom faster.",
            mockup: "/phone.png"
        }
    ];

    const benefits = [
        {
            image: "/benefit_1.jpg",
            title: "Clarity on Your Goals",
            description: "Know exactly how much you need, how long it will take, and the trade-offs to get there—no more guessing."
        },
        {
            image: "/benefit_2.png", 
            title: "Guidance that Fits You",
            description: "Get savings and spending tips built around your real income, expenses, and priorities—not generic advice."
        },
        {
            image: "/benefit_3.jpg",
            title: "Confidence in Your Choices", 
            description: "Simulate big decisions—starting a business, buying a car, or taking a career break—and see the impact before you commit."
        }
    ];

    const handleNextFeature = () => {
        if (currentFeatureIndex < features.length - 1) {
            setCurrentFeatureIndex(currentFeatureIndex + 1);
        }
    };

    const handlePrevFeature = () => {
        if (currentFeatureIndex > 0) {
            setCurrentFeatureIndex(currentFeatureIndex - 1);
        } else if (currentFeatureIndex === 0) {
            // Go back to "Explore Features" card
            setCurrentFeatureIndex(-1);
        }
    };

    const startExploring = () => {
        setCurrentFeatureIndex(0);
    };

    const handleNextBenefit = () => {
        if (currentBenefitIndex < benefits.length - 1) {
            setCurrentBenefitIndex(currentBenefitIndex + 1);
        }
    };

    const handlePrevBenefit = () => {
        if (currentBenefitIndex > 0) {
            setCurrentBenefitIndex(currentBenefitIndex - 1);
        }
    };

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

                    {/* Mobile View - Fixed image positioning */}
                    <div className="md:hidden w-full bg-white flex flex-col pb-2">
                        {/* Mobile Content - Minimal padding */}
                        <div className="px-4 pt-0 pb-4 -mt-2">
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

                        {/* Mobile Image - Moved lower, removed negative margin */}
                        <div className="relative h-80 w-full overflow-hidden mt-2">
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

                {/* Features Section - Reduced spacing between screens */}
                <section id="features" className="relative -mt-8 py-2 md:py-24 pb-16 md:pb-24 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 relative z-10">
                        {/* Desktop View - Keep Unchanged */}
                        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
                                <div className="bg-gradient-to-br from-red-800 to-yellow-400 rounded-2xl p-0.5 max-w-lg ml-auto">
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

                        {/* Mobile Layout - Interactive Feature Showcase */}
                        <div className="lg:hidden">
                            {/* Phone Mockup - Reduced margin */}
                            <div className="relative mb-6">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <Image
                                            src={currentFeatureIndex >= 0 ? features[currentFeatureIndex].mockup : "/phone.png"}
                                            alt="KitaMo App Preview"
                                            width={300}
                                            height={600}
                                            className="w-full max-w-xs mx-auto drop-shadow-2xl relative z-10"
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Initial Explore Features Card */}
                            {currentFeatureIndex === -1 && (
                                <div className="relative px-4">
                                    <div
                                        className="relative cursor-pointer max-w-sm mx-auto h-64 flex items-center justify-center rounded-2xl shadow-lg shadow-black/10 bg-transparent"
                                        onClick={startExploring}
                                    >
                                        <Image
                                            src="/mobile_card.png"
                                            alt="Explore Features Card"
                                            width={384}
                                            height={256}
                                            className="w-full h-full object-cover rounded-2xl"
                                            priority
                                        />
                                        {/* Text overlay at top center, visually balanced and tight line spacing */}
                                        <div className="absolute top-8 left-0 right-0 text-center px-6">
                                            <div className="text-lg font-semibold text-foreground mb-1" style={{ lineHeight: "1.05" }}>
                                                Explore the Features<br />
                                                <span className="text-xl font-normal">
                                                    of <span className="font-extrabold bg-gradient-to-r from-red-700 to-yellow-400 bg-clip-text text-transparent">KitaMo</span>
                                                </span>
                                            </div>
                                        </div>
                                        {/* Arrow button at bottom center, inside the card */}
                                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                                            <button className="bg-white rounded-full p-4 shadow-lg shadow-black/10 transition-all duration-200 hover:scale-105 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Feature Cards - Shown one by one with OPTIMIZED HEIGHT and breathing space */}
                            {currentFeatureIndex >= 0 && (
                                <div className="px-4">
                                    <div className="bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-100 overflow-hidden max-w-sm mx-auto h-64">
                                        <div className="p-6 h-48 flex flex-col">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                                    {features[currentFeatureIndex].icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{features[currentFeatureIndex].title}</h3>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 flex items-start pb-2">
                                                <p className="text-gray-600 leading-relaxed text-sm">
                                                    {features[currentFeatureIndex].desc}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Navigation area - FIXED HEIGHT */}
                                        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 h-16">
                                            <button 
                                                onClick={handlePrevFeature}
                                                className="p-2 rounded-full bg-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                                            >
                                                <svg className="w-5 h-5 text-gray-600 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            
                                            <div className="flex space-x-2">
                                                {features.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-2 h-2 rounded-full transition-colors ${
                                                            index === currentFeatureIndex ? 'bg-red-500' : 'bg-gray-300'
                                                        }`}
                                                    ></div>
                                                ))}
                                            </div>
                                            
                                            <button 
                                                onClick={handleNextFeature}
                                                disabled={currentFeatureIndex === features.length - 1}
                                                className={`p-2 rounded-full bg-white shadow-md transition-all ${
                                                    currentFeatureIndex === features.length - 1 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:shadow-lg hover:scale-105'
                                                }`}
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Third Screen - Why use KitaMo? */}
                <section className="pt-0 md:pt-2 pb-20 md:pb-48 bg-white">
                    <div className="container max-w-6xl mx-auto px-4">
                        {/* Title - Size similar to "Mula ngayon" */}
                        <div className="text-center mb-4">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tighter leading-tight text-foreground">
                                Why use <span className="bg-gradient-to-r from-red-800 to-yellow-400 bg-clip-text text-transparent">KitaMo</span>?
                            </h2>
                        </div>

                        {/* Benefits Cards with Red Gradient Background */}
                        <div className="relative py-8">
                            {/* Red gradient background - extended to show below cards */}
                            {/* Desktop: original maroon background */}
                            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-1/3 bottom-0 w-full max-w-none bg-gradient-to-br from-red-800 to-red-600 rounded-[2rem] shadow-2xl" style={{width: 'calc(100vw - 18rem)'}}></div>
                            {/* Mobile: maroon background covers 75% of card from bottom, 25% pops out from top, sides reach edge */}
                            <div className="md:hidden absolute left-0 right-0 bottom-0 bg-gradient-to-br from-red-800 to-red-600 rounded-[2rem] shadow-2xl" style={{height: '75%', zIndex: 1}}></div>
                            
                            {/* Desktop Cards positioned over red gradient */}
                            <div className="hidden md:block relative">
                                <div className="grid md:grid-cols-3 gap-8 lg:gap-12 px-4 z-10">
                                    {/* Benefit Card 1 - Clarity on your goals */}
                                    <div className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden bg-white max-w-xs mx-auto">
                                        <div className="mb-0">
                                            <Image
                                                src="/benefit_1.jpg"
                                                alt="Smarter Financial Decisions"
                                                width={300}
                                                height={400}
                                                className="w-full h-80 object-cover"
                                            />
                                        </div>
                                        <div className="bg-white p-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                                                Clarity on Your Goals
                                            </h3>
                                            <p className="text-gray-600 text-xs leading-relaxed text-center">
                                                Know exactly how much you need, how long it will take, and the trade-offs to get there—no more guessing.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Benefit Card 2 - Guidance that fits you*/}
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
                                                Guidance that Fits You
                                            </h3>
                                            <p className="text-gray-600 text-xs leading-relaxed text-center">
                                                Get savings and spending tips built around your real income, expenses, and priorities—not generic advice.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Benefit Card 3 - Confidence in Your Choices */}
                                    <div className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden bg-white max-w-xs mx-auto">
                                        <div className="mb-0">
                                            <Image
                                                src="/benefit_3.jpg"
                                                alt="Confidence in Your Future"
                                                width={300}
                                                height={400}
                                                className="w-full h-80 object-cover"
                                            />
                                        </div>
                                        <div className="bg-white p-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                                                Confidence in Your Choices
                                            </h3>
                                            <p className="text-gray-600 text-xs leading-relaxed text-center">
                                                Simulate big decisions—starting a business, buying a car, or taking a career break—and see the impact before you commit.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Swipeable Benefits */}
                            <div className="md:hidden relative z-10">
                                <div className="px-4">
                                    <div className="shadow-xl rounded-xl overflow-hidden bg-white max-w-sm mx-auto">
                                        <div className="mb-0">
                                            <Image
                                                src={benefits[currentBenefitIndex].image}
                                                alt={benefits[currentBenefitIndex].title}
                                                width={300}
                                                height={400}
                                                className="w-full h-80 object-cover"
                                            />
                                        </div>
                                        <div className="bg-white p-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                                                {benefits[currentBenefitIndex].title}
                                            </h3>
                                            <p className="text-gray-600 text-xs leading-relaxed text-center">
                                                {benefits[currentBenefitIndex].description}
                                            </p>
                                        </div>
                                        
                                        {/* Mobile Navigation */}
                                        <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                                            <button 
                                                onClick={handlePrevBenefit}
                                                disabled={currentBenefitIndex === 0}
                                                className={`p-2 rounded-full bg-white shadow-md transition-all ${
                                                    currentBenefitIndex === 0 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:shadow-lg hover:scale-105'
                                                }`}
                                            >
                                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                                            </button>
                                            
                                            <div className="flex space-x-2">
                                                {benefits.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-2 h-2 rounded-full transition-colors ${
                                                            index === currentBenefitIndex ? 'bg-red-500' : 'bg-gray-300'
                                                        }`}
                                                    ></div>
                                                ))}
                                            </div>
                                            
                                            <button 
                                                onClick={handleNextBenefit}
                                                disabled={currentBenefitIndex === benefits.length - 1}
                                                className={`p-2 rounded-full bg-white shadow-md transition-all ${
                                                    currentBenefitIndex === benefits.length - 1 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:shadow-lg hover:scale-105'
                                                }`}
                                            >
                                                <ChevronRight className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Add extra space before the Get Started card above the footer */}
                <div className="w-full h-16 md:h-24"></div>
            </main>

            <footer className="bg-gradient-to-r from-red-800 to-red-700 text-white relative overflow-visible" style={{minHeight: '180px', paddingTop: '60px'}}>
                {/* Get Started Card - Responsive for mobile and desktop */}
                {/* Desktop/Web: show get_started.png at intersection */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 z-30" style={{top: 'calc(-120px + 0.5 * 120px)'}}>
                    <div className="relative hover:scale-105 transition-transform duration-300 flex items-center" style={{height: '140px', width: '360px', top: '-30px'}}>
                        <Image
                            src="/get_started.png"
                            alt="Get started with Kitamo"
                            width={520}
                            height={110}
                            className="drop-shadow-2xl shadow-2xl w-full h-full object-cover rounded-xl"
                        />
                        {/* Left side: Text */}
                        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-left">
                            <h3 className="text-2xl font-bold text-gray-800 mb-0 leading-tight">Get started with</h3>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-800 to-yellow-400 bg-clip-text text-transparent mt-0 leading-tight">KitaMo</h3>
                        </div>
                        {/* Right side: Arrow */}
                        <Link 
                            href="/signup" 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-red-800 p-2 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-red-800"
                        >
                            <ArrowRight className="w-5 h-5" stroke="currentColor" />
                        </Link>
                    </div>
                </div>

                {/* Mobile: show mobile_card.png at intersection */}
                <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 z-30 w-full flex justify-center" style={{top: 'calc(-120px + 0.5 * 120px)'}}>
                    <div className="relative w-full max-w-[300px] hover:scale-105 transition-transform duration-300" style={{height: '160px', top: '-50px'}}>
                        <Image
                            src="/mobile_card.png"
                            alt="Get started with Kitamo (Mobile)"
                            width={340}
                            height={180}
                            className="drop-shadow-2xl shadow-2xl rounded-xl"
                            priority
                        />
                        {/* Top Center Text */}
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center w-full">
                            <h3 className="text-2xl font-bold text-gray-800" style={{marginBottom: '2px'}}>Get started with</h3>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-800 to-yellow-400 bg-clip-text text-transparent" style={{marginTop: '-6px'}}>KitaMo</h3>
                        </div>
                        {/* Bottom Center Arrow - moved lower */}
                        <Link 
                            href="/signup" 
                            className="absolute bottom-[-14px] left-1/2 transform -translate-x-1/2 bg-white text-red-800 p-3 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-red-800"
                        >
                            <ArrowRight className="w-6 h-6" stroke="currentColor" />
                        </Link>
                    </div>
                </div>

                <div className="container max-w-6xl mx-auto px-4 py-8 pt-20">
                    <div className="grid md:grid-cols-3 gap-6 items-center">
                        {/* Logo and Brand Section */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-3 mb-3">
                                <Image
                                    src="/kitamo_logo_v2.png"
                                    alt="KitaMo Logo"
                                    width={40}
                                    height={40}
                                    className=""
                                />
                                <span className="text-2xl font-bold text-white">KitaMo</span>
                            </div>
                            
                            {/* Social Media Icons - White and Uniform */}
                            <div className="flex items-center gap-3 mb-2">
                                <a href="#" className="w-6 h-6 flex items-center justify-center text-white hover:text-yellow-300 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center text-white hover:text-yellow-300 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center text-white hover:text-yellow-300 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center text-white hover:text-yellow-300 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center text-white hover:text-yellow-300 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"/>
                                    </svg>
                                </a>
                            </div>

                            <p className="text-xs text-white/80">FOLLOW US</p>
                        </div>

                        {/* Navigation Links */}
                        <div className="text-center">
                            <nav className="flex justify-center gap-8">
                                <Link href="/" className="text-white hover:text-yellow-300 transition-colors">Home</Link>
                                <Link href="#features" className="text-white hover:text-yellow-300 transition-colors">Features</Link>
                                <Link href="/about" className="text-white hover:text-yellow-300 transition-colors">About</Link>
                            </nav>
                        </div>

                        {/* Contact Information */}
                        <div className="text-center md:text-right">
                            <div className="mb-3">
                                <p className="text-xs font-semibold mb-1">PHONE NO.</p>
                                <p className="text-white text-sm">+63 921 854 6737</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold mb-1">EMAIL</p>
                                <p className="text-white text-sm">kitamo@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center mt-6 pt-4 border-t border-white/20">
                        <p className="text-xs text-white/80">© Copyright 2025. All rights reserved. KitaMo by Techtonix.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}