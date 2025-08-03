
"use client";

import { useState } from "react";
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
import { Shield, User, LogOut } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const accountSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
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
    await new Promise(resolve => setTimeout(resolve, 500));
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
    const { user } = useAppContext();
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors } } = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            firstName: user?.displayName?.split(' ')[0] || "Alex",
            lastName: user?.displayName?.split(' ')[1] || "Doe",
            email: "alex.doe@email.com"
        }
    });

    const onSubmit: SubmitHandler<AccountFormValues> = (data) => {
        toast({
            title: "Account Updated",
            description: "Your personal information has been saved.",
        });
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
                            <Input id="firstName" {...register("firstName")} />
                            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName")} />
                             {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" {...register("email")} />
                         {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
};

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
                    {activeTab === 'security' && <SecuritySettings />}
                </div>
            </div>
        </div>
    );
}
