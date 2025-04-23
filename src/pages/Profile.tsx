
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import NotificationPreferences from "@/components/profile/NotificationPreferences";
import ProfileSecurity from "@/components/profile/ProfileSecurity";

interface ProfileFormData {
  fullName: string;
  email: string;
  bio: string;
  title: string;
  phone: string;
  location: string;
}

export function Profile() {
  const form = useForm<ProfileFormData>({
    defaultValues: {
      fullName: "Alex Johnson",
      email: "alex.johnson@example.com",
      bio: "Learning enthusiast and software developer",
      title: "Software Developer",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA"
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    toast.success("Profile updated successfully");
    console.log("Profile data:", data);
  };

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <NotificationPreferences />
        <ProfileSecurity />
      </div>
    </div>
  );
}

export default Profile;
