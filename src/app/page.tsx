
import LandingHeader from "@/components/layout/landing-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FlaskConical, Target, TrendingUp, Smile, CheckCircle } from "lucide-react";
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
                                        <Link href="/login">
                                            Start Your Financial Journey
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="border-2 border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:scale-105">
                                        <Link href="#features">
                                            Learn More
                                        </Link>
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
                <section id="features" className="relative py-16 md:py-24 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* Left Side - Phone Mockup */}
                            <div className="relative">
                                <Image
                                    src="/phone.png"
                                    alt="KitaMo Financial App Phone Mockup"
                                    width={800}
                                    height={900}
                                    className="w-full h-auto max-w-xl mx-auto lg:max-w-full"
                                    priority
                                />
                            </div>
                            
                            {/* Right Side - Features Content in Card */}
                            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-2xl border border-gray-100">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
                                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">A Future You Can See</span>
                                        </h2>
                                        <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                                            KitaMo is more than just a financial app. It's your personal planning partner for life's most important financial decisions.
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        {/* Kitabot Feature */}
                                        <div className="flex items-start gap-4">
                                            <div className="bg-red-100 text-red-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1">Kitabot</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Chat with your finance companion. Get instant answers, personalized guidance, and tips based on your financial goals.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* What-If Simulator Feature */}
                                        <div className="flex items-start gap-4">
                                            <div className="bg-red-100 text-red-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <FlaskConical className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1">What-If Simulator</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Experiment with different financial scenarios. See how changing your income, expenses, or timeline impacts your ability to reach your goals.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Goal Tracker Feature */}
                                        <div className="flex items-start gap-4">
                                            <div className="bg-red-100 text-red-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1">Goal Tracker</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Create, manage, and prioritize your financial goals. Visualize your progress and get AI-powered insights to stay on track.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* AI-Powered Insights Feature */}
                                        <div className="flex items-start gap-4">
                                            <div className="bg-red-100 text-red-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-1">AI-Powered Insights</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Receive personalized suggestions and product recommendations from BPI to accelerate your journey to financial freedom.
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
