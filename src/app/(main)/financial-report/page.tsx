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

// KitaMo Logo Component for Print
const PrintLogo = () => (
    <svg viewBox="0 0 64 64" fill="none" className="print-logo-svg">
      <defs>
        <linearGradient id="eyeGradientPrint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 100%, 25%)" />
          <stop offset="100%" stopColor="hsl(45, 100%, 50%)" />
        </linearGradient>
      </defs>
      <path d="M2 32 C2 32 10 12 32 12 C54 12 62 32 62 32 C62 32 54 52 32 52 C10 52 2 32 2 32 Z" stroke="url(#eyeGradientPrint)" strokeWidth="4" fill="none"/>
      <circle cx="32" cy="32" r="8" stroke="url(#eyeGradientPrint)" strokeWidth="2" fill="url(#eyeGradientPrint)"/>
    </svg>
);

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
        <>
            <style jsx global>{`
            @media print {
                /* Remove browser UI elements */
                @page {
                    margin: 0.5in;
                    size: auto;
                }
                
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                html, body {
                    height: auto !important;
                    overflow: visible !important;
                    font-size: 10px !important;
                    line-height: 1.2 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                }
                
                body * {
                    visibility: hidden;
                }
                
                .print-container, .print-container * {
                    visibility: visible;
                }
                
                .print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                }
                
                /* Hide all navigation, tabs, and browser elements */
                nav, header, footer, aside, .nav, .navbar, .header, .footer, .sidebar {
                    display: none !important;
                    visibility: hidden !important;
                }
                
                /* Print header styling */
                .print-header {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                }
                
                .print-logo-section {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                
                .print-separator-line {
                    width: 100%;
                    height: 2px;
                    background: hsl(0, 100%, 25%);
                    margin: 15px 0;
                    border: none;
                }
                
                .print-logo-svg {
                    width: 32px;
                    height: 32px;
                }
                
                .print-brand {
                    font-size: 24px;
                    font-weight: bold;
                    color: hsl(0, 100%, 25%);
                    margin: 0;
                }
                
                .print-header h1 {
                    font-size: 20px !important;
                    margin: 0 0 8px 0 !important;
                    font-weight: bold;
                    color: #000 !important;
                    text-align: center;
                }
                
                .print-header p {
                    font-size: 11px !important;
                    margin: 0 !important;
                    color: #666 !important;
                    text-align: center;
                }
                
                /* Summary grid */
                .print-summary {
                    margin-bottom: 20px;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                
                .print-summary-card {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: center;
                    background: #f9f9f9;
                    border-radius: 4px;
                }
                
                .print-summary-label {
                    font-size: 9px;
                    color: #666;
                    margin-bottom: 4px;
                    font-weight: normal;
                }
                
                .print-summary-value {
                    font-size: 13px;
                    font-weight: bold;
                    margin: 0;
                    color: #000;
                }
                
                /* Table styling */
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                    font-size: 10px;
                    background: white;
                }
                
                .print-table th,
                .print-table td {
                    border: 1px solid #ddd;
                    padding: 6px 8px;
                    text-align: left;
                    vertical-align: middle;
                }
                
                .print-table th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                    font-size: 9px;
                    color: #000;
                }
                
                .print-table .text-right {
                    text-align: right;
                }
                
                .print-priority {
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 8px;
                    font-weight: bold;
                    display: inline-block;
                }
                
                .print-priority.high {
                    background: #fecaca;
                    color: #991b1b;
                    border: 1px solid #f87171;
                }
                
                .print-priority.medium {
                    background: #fef3c7;
                    color: #92400e;
                    border: 1px solid #fbbf24;
                }
                
                .print-priority.low {
                    background: #dbeafe;
                    color: #1e40af;
                    border: 1px solid #60a5fa;
                }
                
                .print-progress {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .print-progress-bar {
                    width: 50px;
                    height: 8px;
                    background: #e5e7eb;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #d1d5db;
                }
                
                .print-progress-fill {
                    height: 100%;
                    background: linear-gradient(135deg, hsl(0, 100%, 25%) 0%, hsl(45, 100%, 50%) 100%);
                    transition: none;
                }
                
                .print-progress-text {
                    font-size: 8px;
                    color: #666;
                    font-weight: 500;
                }
                
                /* Hide screen elements completely */
                .print\\:hidden {
                    display: none !important;
                    visibility: hidden !important;
                }
                
                /* Show print elements */
                .print\\:block {
                    display: block !important;
                    visibility: visible !important;
                }
                
                /* Remove any page breaks within table rows */
                .print-table tr {
                    page-break-inside: avoid;
                }
                
                /* Ensure clean page breaks */
                .print-break {
                    page-break-before: always;
                }
            }
            
            @media screen {
                .print\\:hidden {
                    display: inherit;
                }
                
                .print\\:block {
                    display: none;
                }
            }
        `}</style>

            <div className="animate-in fade-in-0 duration-500 space-y-4 md:space-y-6 max-w-4xl mx-auto print-container">
                <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-center md:space-y-0 print:hidden">
                    <div></div>
                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground text-center">
                        Financial Goals Report
                    </h1>
                    <Button onClick={handlePrint} className="md:w-auto">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Report
                    </Button>
                </div>

                {/* Print Header with KitaMo Branding*/}
                <div className="print:block print-header hidden">
                    <div className="print-logo-section">
                        <PrintLogo />
                        <h2 className="print-brand">KitaMo</h2>
                    </div>
                    <hr className="print-separator-line" />
                    <h1>Financial Goals Report</h1>
                    <p>Generated on {new Date().toLocaleDateString()} • {user?.email}</p>
                </div>

                {/* Screen Version */}
                <Card className="print:hidden">
                    <CardHeader className="flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div>
                            <CardTitle className="text-lg md:text-xl">Overall Summary</CardTitle>
                            <CardDescription className="text-sm">A high-level overview of your financial goals.</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => router.back()} className="w-full md:w-auto">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Goals
                        </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        <Card className="p-3 md:p-4">
                            <p className="text-xs md:text-sm text-muted-foreground">Total Goal Amount</p>
                            <p className="text-lg md:text-2xl font-bold">₱{totalTarget.toLocaleString()}</p>
                        </Card>
                        <Card className="p-3 md:p-4">
                            <p className="text-xs md:text-sm text-muted-foreground">Amount Saved</p>
                            <p className="text-lg md:text-2xl font-bold text-green-600">₱{totalCurrent.toLocaleString()}</p>
                        </Card>
                        <Card className="p-3 md:p-4">
                            <p className="text-xs md:text-sm text-muted-foreground">Remaining Amount</p>
                            <p className="text-lg md:text-2xl font-bold text-red-600">₱{totalRemaining.toLocaleString()}</p>
                        </Card>
                         <Card className="p-3 md:p-4">
                            <p className="text-xs md:text-sm text-muted-foreground">Monthly Goal Funding</p>
                            <p className="text-lg md:text-2xl font-bold">₱{totalMonthlyTarget.toLocaleString()}</p>
                        </Card>
                         <Card className="p-3 md:p-4">
                            <p className="text-xs md:text-sm text-muted-foreground">Monthly Income</p>
                            <p className="text-lg md:text-2xl font-bold">₱{monthlyIncome.toLocaleString()}</p>
                        </Card>
                         <Card className={cn("p-4", surplus >= 0 ? "bg-green-500/10" : "bg-red-500/10")}>
                            <p className="text-sm text-muted-foreground">Monthly Surplus/Shortfall</p>
                            <p className={cn("text-2xl font-bold", surplus >= 0 ? "text-green-700" : "text-red-700")}>
                               {surplus >= 0 ? `+₱${surplus.toLocaleString()}` : `-₱${Math.abs(surplus).toLocaleString()}`}
                            </p>
                        </Card>
                    </CardContent>
                </Card>

                {/* Print Version Summary */}
                <div className="print:block hidden print-summary">
                    <div className="print-summary-card">
                        <div className="print-summary-label">Total Goal Amount</div>
                        <div className="print-summary-value">₱{totalTarget.toLocaleString()}</div>
                    </div>
                    <div className="print-summary-card">
                        <div className="print-summary-label">Amount Saved</div>
                        <div className="print-summary-value">₱{totalCurrent.toLocaleString()}</div>
                    </div>
                    <div className="print-summary-card">
                        <div className="print-summary-label">Remaining</div>
                        <div className="print-summary-value">₱{totalRemaining.toLocaleString()}</div>
                    </div>
                    <div className="print-summary-card">
                        <div className="print-summary-label">Monthly Target</div>
                        <div className="print-summary-value">₱{totalMonthlyTarget.toLocaleString()}</div>
                    </div>
                    <div className="print-summary-card">
                        <div className="print-summary-label">Monthly Income</div>
                        <div className="print-summary-value">₱{monthlyIncome.toLocaleString()}</div>
                    </div>
                    <div className="print-summary-card">
                        <div className="print-summary-label">Surplus/Shortfall</div>
                        <div className="print-summary-value">
                            {surplus >= 0 ? `+₱${surplus.toLocaleString()}` : `-₱${Math.abs(surplus).toLocaleString()}`}
                        </div>
                    </div>
                </div>

                {/* Screen Version Table */}
                <Card className="print:hidden">
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl">Detailed Goal Breakdown</CardTitle>
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

                {/* Print Version Table */}
                <div className="print:block hidden">
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>Goal</th>
                                <th>Priority</th>
                                <th>Progress</th>
                                <th className="text-right">Target</th>
                                <th className="text-right">Saved</th>
                                <th className="text-right">Remaining</th>
                                <th className="text-right">Monthly</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.map((goal) => {
                                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                                const remaining = goal.target - goal.current;
                                return (
                                    <tr key={goal.id}>
                                        <td>{goal.title}</td>
                                        <td>
                                            <span className={`print-priority ${goal.priority.toLowerCase()}`}>
                                                {goal.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="print-progress">
                                                <div className="print-progress-bar">
                                                    <div 
                                                        className="print-progress-fill" 
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="print-progress-text">{progress.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className="text-right">₱{goal.target.toLocaleString()}</td>
                                        <td className="text-right">₱{goal.current.toLocaleString()}</td>
                                        <td className="text-right">₱{remaining.toLocaleString()}</td>
                                        <td className="text-right">₱{goal.monthlyTarget.toLocaleString()}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div> 
            </div>
        </>
    );
}