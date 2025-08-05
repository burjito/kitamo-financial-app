
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
    <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground p-4 rounded-lg flex items-center gap-4">
        <div className="text-secondary">
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm opacity-80">{label}</div>
        </div>
    </div>
);

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <LandingHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-b from-background to-red-50/50 overflow-hidden">
                    <div className="container max-w-7xl mx-auto px-4 py-20 md:py-28">
                       <div className="grid md:grid-cols-2 gap-8 items-center">
                           <div className="space-y-6 text-center md:text-left">
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                                    Basta may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">kita</span>, may <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">matatamo</span>.
                                </h1>
                                <p className="max-w-lg mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground">
                                   Make smarter money decisions with AI-powered what-if scenarios.
                                </p>
                                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-transform hover:scale-105">
                                    <Link href="/login">
                                        Start Your Financial Journey
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>

                                <div className="grid sm:grid-cols-3 gap-4 pt-6 text-left">
                                     <StatCard icon={<CheckCircle className="w-8 h-8" />} value="10k+" label="Scenarios Simulated" />
                                     <StatCard icon={<TrendingUp className="w-8 h-8" />} value="50M+" label="Goals Achieved" />
                                     <StatCard icon={<Smile className="w-8 h-8" />} value="95%" label="Satisfaction Rate" />
                                </div>
                           </div>
                           <div className="relative h-64 md:h-auto">
                                <Image
                                    src="/final_cover.png"
                                    alt="KitaMo Financial Simulator Illustration"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                           </div>
                       </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-32 bg-background">
                    <div className="container max-w-6xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">A Future You Can See</h2>
                            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mt-4">
                                KitaMo is more than just a financial app. It's your personal flight simulator for life's most important financial decisions.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<FlaskConical className="w-8 h-8"/>}
                                title="What-If Simulator"
                                description="Experiment with different financial scenarios. See how changing your income, expenses, or timeline impacts your ability to reach your goals."
                            />
                             <FeatureCard 
                                icon={<Target className="w-8 h-8"/>}
                                title="Goal Tracker"
                                description="Create, manage, and prioritize your financial goals. Visualize your progress and get AI-powered insights to stay on track."
                            />
                             <FeatureCard 
                                icon={<Bot className="w-8 h-8"/>}
                                title="AI-Powered Insights"
                                description="Receive personalized suggestions and product recommendations from BPI to accelerate your journey to financial freedom."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 border-t bg-background">
                <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} KitaMo by BPI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
