
"use client";

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
                <section id="features" className="relative py-16 md:py-24 pb-48 md:pb-64 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* Left Side - Phone Mockup with Title */}
                            <div className="relative">
                                <Image
                                    src="/phone.png"
                                    alt="KitaMo Financial App Phone Mockup"
                                    width={1700}
                                    height={2000}
                                    className="w-full h-auto max-w-2xl mx-auto lg:max-w-none lg:w-[120%] lg:-ml-[15%]"
                                    priority
                                />
                                {/* Title Positioning */}
                                <div className="absolute top-12 lg:top-18 right-0 lg:right-[-14%] z-10">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter leading-tight text-right">
                                        <span className="text-foreground">KitaMo ang</span><br />
                                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">bukas.</span><br />
                                    </h2>
                                </div>
                                
                                {/* "May gabay ngayon" text at bottom left */}
                                <div className="absolute bottom-8 lg:bottom-12 left-0 lg:left-[-5%] z-10">
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter leading-tight text-left">
                                        <span className="text-foreground">May</span><br />
                                        <span className="text-foreground">gabay</span><br />
                                        <span className="text-foreground">ngayon</span>
                                    </h3>
                                </div>
                            </div>
                            
                            {/* Right Side - Features Card */}
                            <div className="relative lg:ml-8">
                                <div className="bg-white rounded-2xl p-6 lg:p-6 shadow-2xl border border-gray-100 max-w-lg ml-auto">
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
                                                    Chat with your finance companion. Get instant answers, personalized guidance, and tips based on your financial goals.
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
                </section>
            </main>

            <footer className="py-8 border-t bg-background">
                <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} KitaMo by Techtonix. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
