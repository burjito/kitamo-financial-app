
"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Goal } from "@/contexts/app-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
  onAddFunds: (amount: number) => void;
}

export const AddFundsDialog = ({ open, onOpenChange, goal, onAddFunds }: AddFundsDialogProps) => {
  const { toast } = useToast();
  const remainingAmount = goal.target - goal.current;

  const addFundsSchema = z.object({
    amount: z.coerce
      .number()
      .min(1, { message: "Amount must be greater than 0." })
      .max(remainingAmount, { message: `Amount cannot exceed the remaining balance of ₱${remainingAmount.toLocaleString()}.` }),
  });

  type AddFundsFormValues = z.infer<typeof addFundsSchema>;

  const form = useForm<AddFundsFormValues>({
    resolver: zodResolver(addFundsSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (data: AddFundsFormValues) => {
    onAddFunds(data.amount);
    toast({
      title: "Funds Added!",
      description: `₱${data.amount.toLocaleString()} has been added to your "${goal.title}" goal.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds to {goal.title}</DialogTitle>
          <DialogDescription>
            Contribute towards your goal and see your progress grow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-yellow-500/10 p-4 rounded-md text-sm my-4">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Current Amount:</span>
                <span className="font-medium">₱{goal.current.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Target Amount:</span>
                <span className="font-medium">₱{goal.target.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-red-500 font-semibold">Remaining:</span>
                <span className="text-red-500 font-semibold">₱{remainingAmount.toLocaleString()}</span>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to Add (₱)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground pt-1">
                      Maximum: ₱{remainingAmount.toLocaleString()}
                  </p>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Funds</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

    