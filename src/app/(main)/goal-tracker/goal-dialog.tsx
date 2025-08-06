
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
import { Goal } from "@/contexts/app-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const goalSchema = z.object({
  title: z.string().min(3, { message: "Goal title must be at least 3 characters." }),
  target: z.coerce.number().min(1, { message: "Target amount must be greater than 0." }),
  monthlyTarget: z.coerce.number().min(1, { message: "Monthly target must be greater than 0." }),
  priority: z.enum(['High', 'Medium', 'Low']),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Omit<Goal, 'id' | 'current' | 'status'> | Goal) => void;
  goal?: Goal;
}

export const GoalDialog = ({ open, onOpenChange, onSave, goal }: GoalDialogProps) => {

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      target: 0,
      monthlyTarget: 0,
      priority: 'Medium',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        goal
          ? {
              title: goal.title,
              target: goal.target,
              monthlyTarget: goal.monthlyTarget,
              priority: goal.priority,
            }
          : {
              title: "",
              target: 0,
              monthlyTarget: 0,
              priority: "Medium",
            }
      );
    }
  }, [open, goal, form]);


  const onSubmit = (data: GoalFormValues) => {
    if (goal?.id) {
        onSave({ ...goal, ...data });
    } else {
        onSave(data);
    }
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
                 <FormField
                    control={form.control}
                    name="monthlyTarget"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Monthly Target (₱)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 5000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
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
