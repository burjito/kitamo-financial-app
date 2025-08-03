
"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Goal } from "@/contexts/app-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const goalSchema = z.object({
  title: z.string().min(3, { message: "Goal title must be at least 3 characters." }),
  target: z.coerce.number().min(1, { message: "Target amount must be greater than 0." }),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Omit<Goal, 'id' | 'current' | 'status'>) => void;
  goal?: Goal;
}

export const GoalDialog = ({ open, onOpenChange, onSave, goal }: GoalDialogProps) => {

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      target: 0,
    },
  });

  useEffect(() => {
    if (open) {
        form.reset({
            title: goal?.title ?? "",
            target: goal?.target ?? 0,
        });
    }
  }, [open, goal, form]);

  const onSubmit = (data: GoalFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          <DialogDescription>
            {goal ? "Update the details of your financial goal." : "Set a new financial goal to track your progress."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Goal Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., New Laptop" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Target Amount (₱)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 80000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Goal</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
