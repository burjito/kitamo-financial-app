
"use client";

import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getPriorityStyles = (priority: string) => {
    switch (priority.toLowerCase()) {
        case "high":
            return "bg-red-100 text-red-800 border border-red-200";
        case "medium":
            return "bg-yellow-100 text-yellow-800 border border-yellow-200";
        case "low":
            return "bg-blue-100 text-blue-800 border border-blue-200";
        default:
            return "bg-muted text-muted-foreground";
    }
};

export default function FinancialReportPage() {
    const { goals, monthlyIncome, user } = useAppContext();
    const router = useRouter();

    const totalMonthlyTarget = goals.reduce((sum, goal) => sum + goal.monthlyTarget, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
    const totalRemaining = totalTarget - totalCurrent;
    const surplus = monthlyIncome - totalMonthlyTarget;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="animate-in fade-in-0 duration-500 space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center print:hidden">
                 <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Goals
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-foreground text-center">
                    Financial Goals Report
                </h1>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Report
                </Button>
            </div>

             <div className="text-center hidden print:block">
                 <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Financial Goals Report
                </h1>
                <p className="text-muted-foreground">Generated for {user?.displayName} on {new Date().toLocaleDateString()}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Overall Summary</CardTitle>
                    <CardDescription>A high-level overview of your financial goals.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Total Goal Amount</p>
                        <p className="text-2xl font-bold">₱{totalTarget.toLocaleString()}</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Amount Saved</p>
                        <p className="text-2xl font-bold text-green-600">₱{totalCurrent.toLocaleString()}</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Remaining Amount</p>
                        <p className="text-2xl font-bold text-red-600">₱{totalRemaining.toLocaleString()}</p>
                    </Card>
                     <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Monthly Goal Funding</p>
                        <p className="text-2xl font-bold">₱{totalMonthlyTarget.toLocaleString()}</p>
                    </Card>
                     <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Monthly Income</p>
                        <p className="text-2xl font-bold">₱{monthlyIncome.toLocaleString()}</p>
                    </Card>
                     <Card className={cn("p-4", surplus >= 0 ? "bg-green-500/10" : "bg-red-500/10")}>
                        <p className="text-sm text-muted-foreground">Monthly Surplus/Shortfall</p>
                        <p className={cn("text-2xl font-bold", surplus >= 0 ? "text-green-700" : "text-red-700")}>
                           {surplus >= 0 ? `+₱${surplus.toLocaleString()}` : `-₱${Math.abs(surplus).toLocaleString()}`}
                        </p>
                    </Card>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Goal Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Goal</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead className="text-right">Target</TableHead>
                                <TableHead className="text-right">Saved</TableHead>
                                <TableHead className="text-right">Remaining</TableHead>
                                <TableHead className="text-right">Monthly</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goals.map((goal) => {
                                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                                const remaining = goal.target - goal.current;
                                return (
                                    <TableRow key={goal.id}>
                                        <TableCell className="font-medium">{goal.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("capitalize", getPriorityStyles(goal.priority))}>
                                              {goal.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={progress} className="h-2 w-24" />
                                                <span className="text-muted-foreground text-xs">{progress.toFixed(0)}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">₱{goal.target.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₱{goal.current.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₱{remaining.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₱{goal.monthlyTarget.toLocaleString()}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
