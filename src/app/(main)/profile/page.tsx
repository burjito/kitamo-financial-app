"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CreditCard, LogOut, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        // Simulate logout process
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.push('/login');
    };

    return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Profile & Settings
            </h1>
            <p className="text-muted-foreground">
                Manage your account details and preferences.
            </p>
        </div>

        <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="@alex" data-ai-hint="person" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-grow">
                    <h2 className="text-2xl font-bold">Alex Doe</h2>
                    <p className="text-muted-foreground">alex.doe@email.com</p>
                    <p className="text-sm text-muted-foreground">Member since: Jan 2022</p>
                </div>
                <div className="flex flex-row gap-2 mt-4 md:mt-0">
                    <Button variant="outline">Edit Profile</Button>
                     <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:border-primary/50 hover:bg-secondary/30 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                    <User className="h-6 w-6 text-primary"/>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Update your name, address, and contact details.</p>
                </CardContent>
            </Card>

            <Card className="hover:border-primary/50 hover:bg-secondary/30 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Shield className="h-6 w-6 text-primary"/>
                    <CardTitle>Security & Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Change your password and manage two-factor authentication.</p>
                </CardContent>
            </Card>

            <Card className="hover:border-primary/50 hover:bg-secondary/30 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                    <CreditCard className="h-6 w-6 text-primary"/>
                    <CardTitle>BPI Connections</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Manage your linked BPI accounts and products.</p>
                </CardContent>
            </Card>

            <Card className="hover:border-primary/50 hover:bg-secondary/30 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Bell className="h-6 w-6 text-primary"/>
                    <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Choose how and when you receive alerts and updates.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
