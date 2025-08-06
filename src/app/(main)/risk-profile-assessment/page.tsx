
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/app-context";
import { cn } from "@/lib/utils";
import { ShieldQuestion } from "lucide-react";

const assessmentQuestions = [
    {
        section: "Investment Needs",
        questions: [
            {
                id: "objective",
                text: "1. What is your key investment objective?",
                options: [
                    { value: 5, label: "To protect the principal amount of investments and earn steady stream of interest income." },
                    { value: 10, label: "To preserve the capital or real value of investments." },
                    { value: 15, label: "To achieve growth through a balance between interest income and capital gain over a medium term period." },
                    { value: 20, label: "To achieve significant growth or capital appreciation over the medium to long term period." },
                ],
            },
            {
                id: "horizon",
                text: "2. What portion of your investment can be placed in medium or long term investments, i.e., more than 3 years?",
                options: [
                    { value: 5, label: "10% to 30%" },
                    { value: 10, label: "40% to 60%" },
                    { value: 15, label: "70% to 80%" },
                    { value: 20, label: "90% to 100%" },
                ],
            },
            {
                id: "liquidity",
                text: "3. Do you have regular liquidity requirements?",
                options: [
                    { value: 5, label: "I need to draw regular income from my investments and may use a portion of the principal in the short term." },
                    { value: 10, label: "I do not need to draw regular income from my investments nor do I see the immediate need to use any portion of the principal in the short term." },
                    { value: 15, label: "I have other sources of liquidity and do not see a real need to use funds for the next 5 to 10 years." },
                    { value: 20, label: "I have other sources of liquidity and do not see a real need to use funds for the next 10 years." },
                ],
            },
        ],
    },
    {
        section: "Investment Knowledge and Experience",
        questions: [
            {
                id: "knowledge",
                text: "4. What is your knowledge and experience on investments?",
                options: [
                    { value: 5, label: "Minimal. I know bank deposits, T-bills and money market placements." },
                    { value: 10, label: "Low. Outside deposits and short term government securities, I have experience investing in money market funds, corporate bonds and fixed income bonds." },
                    { value: 15, label: "Medium. I have experience investing in mutual funds, UITFs, foreign currencies and direct investment in listed stocks and bonds." },
                    { value: 20, label: "High. I have an extensive experience in investing and have a broad understanding of the domestic and global capital markets in general." },
                ],
            },
            {
                id: "experience",
                text: "5. How many years of experience have you had investing in securities, either directly or through a fund manager?",
                options: [
                    { value: 5, label: "1 year or less" },
                    { value: 10, label: "More than 1 year up to 5 years" },
                    { value: 15, label: "More than 5 years up to 10 years" },
                    { value: 20, label: "More than 10 years" },
                ],
            },
        ],
    },
    {
        section: "Risk Tolerance",
        questions: [
             {
                id: "tolerance",
                text: "6. What is your tolerance for risk?",
                options: [
                    { value: 5, label: "I accept steady and minimal returns without any fluctuation in the principal amount of my investments." },
                    { value: 10, label: "I accept minimal fluctuations in the principal amounts of my investments for commensurate returns." },
                    { value: 15, label: "I accept a fair amount of fluctuation in the principal amount of my investments in order to achieve above average returns and capital growth over the medium term." },
                    { value: 20, label: "I am prepared for a high degree of volatility and possibly losses in the principal amount of my investment for certain periods in order to achieve high returns or capital growth over a period of 5 years or more." },
                ],
            },
            {
                id: "reaction",
                text: "7. If the value of your portfolio decreased by 20% in one year, how would you react?",
                options: [
                    { value: 5, label: "I will be very concerned and will immediately put my investment back to cash (i.e. in the form of deposits and/or short term government securities)." },
                    { value: 10, label: "I will be very concerned and will find safer investment outlets, which are not necessarily cash." },
                    { value: 15, label: "I will be concerned and will review the aggressiveness of my portfolio." },
                    { value: 20, label: "I will NOT be concerned about the short-term fluctuation of certain investments in my portfolio." },
                ],
            },
            {
                id: "networth",
                text: "8. What is your average net worth for the last 2 years?",
                options: [
                    { value: 5, label: "PHP5M (USD100,000) and below" },
                    { value: 10, label: "Over PHP5M (USD100,000) up to PHP30M (USD600,000)" },
                    { value: 15, label: "Over PHP30M up to PHP60M (USD1.2M)" },
                    { value: 20, label: "Over PHP60M" },
                ],
            },
        ],
    },
];

export default function RiskProfileAssessmentPage() {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const router = useRouter();
    const { toast } = useToast();
    const { setRiskProfile } = useAppContext();

    const allQuestions = assessmentQuestions.flatMap(s => s.questions);
    const questionsAnswered = Object.keys(answers).length;
    const isComplete = questionsAnswered === allQuestions.length;

    const handleValueChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    };

    const handleSubmit = () => {
        if (!isComplete) {
            toast({
                title: "Incomplete Assessment",
                description: "Please answer all questions to determine your risk profile.",
                variant: "destructive"
            });
            return;
        }

        const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
        
        let profile = "Conservative";
        if (totalScore > 130) {
            profile = "Aggressive";
        } else if (totalScore > 100) {
            profile = "Moderate";
        } else if (totalScore > 60) {
            profile = "Moderately Conservative";
        }

        setRiskProfile(profile);
        
        toast({
            title: "Assessment Complete!",
            description: `Your investor profile is: ${profile}. Let's check out your new dashboard.`,
        });

        router.push("/home");
    };

    return (
        <div className="animate-in fade-in-0 duration-500 max-w-4xl mx-auto space-y-8 py-8">
             <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center pb-2">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <ShieldQuestion className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl">Risk Profile Assessment</CardTitle>
                  <CardDescription>
                    Just one more step! Answer these questions to help us understand your investment style.
                  </CardDescription>
                </CardHeader>
             </Card>
            
            {assessmentQuestions.map((section, sectionIndex) => (
                <Card key={section.section}>
                    <CardHeader>
                        <CardTitle>{section.section}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                         {section.questions.map((q, qIndex) => (
                            <div key={q.id}>
                                {qIndex > 0 && <Separator className="mb-8" />}
                                <p className="font-semibold mb-4">{q.text}</p>
                                <RadioGroup onValueChange={(value) => handleValueChange(q.id, value)}>
                                    <div className="space-y-3">
                                        {q.options.map(opt => (
                                            <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                                                <RadioGroupItem value={opt.value.toString()} id={`${q.id}-${opt.value}`} />
                                                <Label htmlFor={`${q.id}-${opt.value}`} className="font-normal flex-1 cursor-pointer">
                                                    {opt.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">
                            {questionsAnswered} of {allQuestions.length} questions answered
                        </p>
                        <Button onClick={handleSubmit} disabled={!isComplete} size="lg">
                            {isComplete ? "View My Personalized Dashboard" : "Complete Assessment"}
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-4">
                        Your Client Suitability Assessment (CSA) must be reviewed every three years or earlier should there be any changes in your personal or financial circumstances.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
