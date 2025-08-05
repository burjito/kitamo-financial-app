import LandingHeader from "@/components/layout/landing-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FlaskConical, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-card/80 backdrop-blur-sm border border-border/20 rounded-xl p-6 shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl">
        <div className="bg-primary/10 text-primary w-14 h-14 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);


export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <LandingHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[85vh] flex items-center justify-center text-center text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/hero-image.png"
                            alt="KitaMo Hero Image"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                    <div className="relative z-10 p-4 space-y-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                            Basta may <span className="text-secondary">kita</span>, may <span className="text-secondary">matatamo</span>.
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80">
                           Your AI-powered planning tool to explore life’s biggest financial “what-ifs” with clarity, confidence, and control.
                        </p>
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-transform hover:scale-105">
                            <Link href="/login">
                                Start Your Financial Journey
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-32">
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

            <footer className="py-8 border-t">
                <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} KitaMo by BPI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
