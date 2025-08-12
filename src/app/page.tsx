
import LandingHeader from "@/components/layout/landing-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FlaskConical, Target, TrendingUp, Smile, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-card/90 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-card">
        <div className="bg-primary/10 text-primary w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
            {icon}
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
    <div className="relative p-0.5 rounded-xl bg-gradient-to-r from-primary to-yellow-400 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div className="bg-white rounded-xl p-3 md:p-4 h-full flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-1">
                <div className="text-yellow-500 flex-shrink-0">
                    {icon}
                </div>
                <div className="text-lg md:text-xl font-bold text-red-900">{value}</div>
            </div>
            <div className="text-xs md:text-sm text-red-700 font-medium">{label}</div>
        </div>
    </div>
);

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full min-h-screen">
                    {/* Desktop - Full Background Image */}
                    <div className="hidden md:flex md:min-h-screen md:items-center md:relative">
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src="/final_cover.png"
                                alt="KitaMo Financial Simulator background"
                                fill
                                className="object-cover object-center"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                        
                        <div className="relative container max-w-7xl mx-auto px-4 md:px-6 z-10">
                            <div className="max-w-2xl text-left">
                                <div className="space-y-6 md:space-y-8">
                                    <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight text-foreground">
                                        Basta may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">kita</span>,<br />
                                        may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">matatamo.</span>
                                    </h1>
                                    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
                                       Make smarter money decisions with AI-powered what-if scenarios and achieve your financial dreams.
                                    </p>
                                    <div className="flex flex-row gap-4">
                                        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                            <Link href="/login">
                                                Start Your Financial Journey
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90">
                                            <Link href="#features">
                                                Learn More
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Desktop Stats */}
                                    <div className="grid grid-cols-3 gap-4 pt-8">
                                         <StatCard icon={<CheckCircle className="w-6 md:h-6" />} value="10k+" label="Scenarios Simulated" />
                                         <StatCard icon={<TrendingUp className="w-6 md:h-6" />} value="50M+" label="Goals Achieved" />
                                         <StatCard icon={<Smile className="w-6 md:h-6" />} value="95%" label="Satisfaction Rate" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile - Content Above, Image Below */}
                    <div className="md:hidden bg-gradient-to-b from-orange-50 to-orange-100 min-h-screen flex flex-col">
                        {/* Mobile Content */}
                        <div className="flex-1 container mx-auto px-4 pt-16 pb-6">
                            <div className="text-center space-y-6">
                                <h1 className="text-4xl font-extrabold tracking-tighter leading-tight text-foreground">
                                    Basta may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">kita</span>,<br />
                                    may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">matatamo.</span>
                                </h1>
                                <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                                   Make smarter money decisions with AI-powered what-if scenarios.
                                </p>

                                {/* Mobile Stats */}
                                <div className="grid grid-cols-3 gap-3 py-4">
                                     <StatCard icon={<CheckCircle className="w-5 h-5" />} value="10k+" label="Scenarios Simulated" />
                                     <StatCard icon={<TrendingUp className="w-5 h-5" />} value="50M+" label="Goals Achieved" />
                                     <StatCard icon={<Smile className="w-5 h-5" />} value="95%" label="Satisfaction Rate" />
                                </div>

                                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full max-w-sm">
                                    <Link href="/login" className="text-center">
                                        Start Your Financial Journey
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Image - Below Content */}
                        <div className="relative h-96 w-full overflow-hidden">
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
                <section id="features" className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white">
                    <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">A Future You Can See</h2>
                            <p className="max-w-3xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
                                KitaMo is more than just a financial app. It's your personal planning partner for life's most important financial decisions.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            <FeatureCard 
                                icon={<FlaskConical className="w-6 h-6 md:w-8 md:h-8"/>}
                                title="What-If Simulator"
                                description="Experiment with different financial scenarios. See how changing your income, expenses, or timeline impacts your ability to reach your goals."
                            />
                             <FeatureCard 
                                icon={<Target className="w-6 h-6 md:w-8 md:h-8"/>}
                                title="Goal Tracker"
                                description="Create, manage, and prioritize your financial goals. Visualize your progress and get AI-powered insights to stay on track."
                            />
                             <FeatureCard 
                                icon={<Bot className="w-6 h-6 md:w-8 md:h-8"/>}
                                title="AI-Powered Insights"
                                description="Receive personalized suggestions and product recommendations from BPI to accelerate your journey to financial freedom."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-6 md:py-8 border-t bg-background">
                <div className="container max-w-7xl mx-auto px-4 md:px-6 text-center text-muted-foreground">
                    <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} KitaMo by Techtonix. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
