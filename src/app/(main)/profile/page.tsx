
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, LogOut, DollarSign, ShieldQuestion } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabase-client";
import { Badge } from "@/components/ui/badge";


const accountSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AccountFormValues = z.infer<typeof accountSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const SettingsNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };

  return (
    <nav className="flex flex-col gap-1">
      <Button
        variant="ghost"
        className={cn(
          "justify-start",
          activeTab === 'account' && 'bg-accent text-accent-foreground'
        )}
        onClick={() => setActiveTab('account')}
      >
        <User className="mr-2 h-4 w-4" />
        Account
      </Button>
       <Button
        variant="ghost"
        className={cn(
          "justify-start",
          activeTab === 'financials' && 'bg-accent text-accent-foreground'
        )}
        onClick={() => setActiveTab('financials')}
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Financials
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "justify-start",
          activeTab === 'security' && 'bg-accent text-accent-foreground'
        )}
        onClick={() => setActiveTab('security')}
      >
        <Shield className="mr-2 h-4 w-4" />
        Security
      </Button>
      <Button variant="ghost" className="justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>
    </nav>
  )
}

const AccountSettings = () => {
    const { user, profile, updateProfile } = useAppContext();
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            first_name: "",
            last_name: ""
        }
    });

    useEffect(() => {
        if(profile) {
            reset({
                first_name: profile.first_name,
                last_name: profile.last_name,
            });
        }
    }, [profile, reset]);

    const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
        try {
            await updateProfile(data);
            toast({
                title: "Account Updated",
                description: "Your personal information has been saved.",
            });
        } catch {
             toast({
                title: "Error",
                description: "Could not update your account. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="@alex" data-ai-hint="person" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" type="button">Change Photo</Button>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register("first_name")} />
                            {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("last_name")} />
                             {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={user?.email || ''} readOnly disabled />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
};

const FinancialSettings = () => {
    const { profile, updateProfile } = useAppContext();
    const { toast } = useToast();
    const router = useRouter();
    
    const [income, setIncome] = useState(profile?.monthly_income || 0);
    const [expenses, setExpenses] = useState(profile?.monthly_expenses || 0);

    useEffect(() => {
        if(profile) {
            setIncome(profile.monthly_income || 0);
            setExpenses(profile.monthly_expenses || 0);
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await updateProfile({
                monthly_income: income,
                monthly_expenses: expenses,
            });
            toast({
                title: "Settings Saved",
                description: "Your financial settings have been updated.",
            });
        } catch(e) {
             toast({
                title: "Error",
                description: "Could not update settings. Please try again.",
                variant: "destructive"
            });
        }
    }
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                    <CardDescription>Manage your core financial information to personalize your app experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">Default Monthly Income (PHP)</Label>
                        <Input id="monthlyIncome" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                         <p className="text-sm text-muted-foreground">
                            Used as the starting income for calculations in the simulator and goal tracking.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="monthlyExpenses">Default Monthly Expenses (PHP)</Label>
                        <Input id="monthlyExpenses" type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} />
                         <p className="text-sm text-muted-foreground">
                           Set your typical monthly spending to get a more accurate starting point in simulations.
                        </p>
                    </div>
                     <div className="flex justify-end">
                        <Button onClick={handleSave}>Save Financial Settings</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Risk Profile</CardTitle>
                    <CardDescription>Your risk profile helps us tailor financial advice for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {profile?.risk_profile ? (
                     <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                        <div>
                            <p className="text-sm text-muted-foreground">Your current profile is</p>
                            <Badge variant={profile.risk_profile === "Aggressive" ? "destructive" : "secondary"} className="text-lg mt-1">{profile.risk_profile}</Badge>
                        </div>
                        <Button asChild variant="link">
                            <Link href="/risk-profile-assessment">Retake Assessment</Link>
                        </Button>
                     </div>
                   ) : (
                     <div className="flex items-center justify-between p-4 rounded-lg border border-dashed">
                        <div className="flex items-center gap-3">
                            <ShieldQuestion className="h-8 w-8 text-primary" />
                            <div>
                                <h3 className="font-semibold">Assessment Incomplete</h3>
                                <p className="text-sm text-muted-foreground">Complete the assessment to unlock personalized insights.</p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href="/risk-profile-assessment">Take Assessment</Link>
                        </Button>
                     </div>
                   )}
                </CardContent>
            </Card>
        </div>
    )
}

const SecuritySettings = () => {
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema)
    });

    const onSubmit: SubmitHandler<PasswordFormValues> = (data) => {
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
        });
        reset();
    };
    
    return (
         <Card>
            <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. It's a good practice to use a strong password.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                 <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" {...register("currentPassword")} />
                        {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" {...register("newPassword")} />
                             {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Update Password</Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
};


export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div className="space-y-8 animate-in fade-in-0 duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                   <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="md:col-span-3">
                    {activeTab === 'account' && <AccountSettings />}
                    {activeTab === 'financials' && <FinancialSettings />}
                    {activeTab === 'security' && <SecuritySettings />}
                </div>
            </div>
        </div>
    );
}
