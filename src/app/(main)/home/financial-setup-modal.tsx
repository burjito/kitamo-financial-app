
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/app-context";
import { DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface FinancialSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (income: number, expenses: number) => void;
}

export const FinancialSetupModal = ({ isOpen, onClose, onSave }: FinancialSetupModalProps) => {
  const { updateProfile } = useAppContext();
  const { toast } = useToast();
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    const incomeNum = parseFloat(income);
    const expensesNum = parseFloat(expenses);

    if (isNaN(incomeNum) || incomeNum <= 0) {
      toast({ title: "Invalid Input", description: "Please enter a valid monthly income.", variant: "destructive" });
      return;
    }
    if (isNaN(expensesNum) || expensesNum < 0) {
      toast({ title: "Invalid Input", description: "Please enter a valid monthly expense.", variant: "destructive" });
      return;
    }
    
    try {
        await updateProfile({
            monthly_income: incomeNum,
            monthly_expenses: expensesNum,
        });

        toast({
          title: "Details Saved!",
          description: "Next, let's figure out your investment style.",
        });
        
        onSave(incomeNum, expensesNum);

    } catch (e) {
        toast({ title: "Error", description: "Could not save your details. Please try again.", variant: "destructive"});
    }

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
           <div className="flex justify-center items-center pb-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
           </div>
          <DialogTitle className="text-center text-2xl">Welcome to KitaMo!</DialogTitle>
          <DialogDescription className="text-center">
            To personalize your experience, let's start with your finances.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income (₱)</Label>
            <Input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g., 50000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenses">Monthly Expenses (₱)</Label>
            <Input
              id="expenses"
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="e.g., 35000"
            />
             <p className="text-xs text-muted-foreground pt-1">
                Enter your average monthly spending.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full">Continue to Assessment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
