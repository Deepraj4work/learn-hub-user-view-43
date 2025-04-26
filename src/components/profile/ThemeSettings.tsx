
import React from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup defaultValue={theme || "system"} onValueChange={(value) => setTheme(value)}>
          <div className="flex items-center space-x-2 p-4 rounded-lg border bg-accent/20 hover:bg-accent/40 transition-colors duration-300">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light" className="flex items-center gap-3 cursor-pointer">
              <Sun className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium">Light Theme</p>
                <p className="text-sm text-muted-foreground">Bright interface for daylight usage</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 rounded-lg border bg-accent/20 hover:bg-accent/40 transition-colors duration-300">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark" className="flex items-center gap-3 cursor-pointer">
              <Moon className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="font-medium">Dark Theme</p>
                <p className="text-sm text-muted-foreground">Dark interface for low-light environments</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 rounded-lg border bg-accent/20 hover:bg-accent/40 transition-colors duration-300">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system" className="flex items-center gap-3 cursor-pointer">
              <Monitor className="h-5 w-5 text-teal-500" />
              <div>
                <p className="font-medium">System Default</p>
                <p className="text-sm text-muted-foreground">Match your device's appearance settings</p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <div className="space-y-4 pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Animation Effects</Label>
              <p className="text-sm text-muted-foreground">
                Enable subtle animations throughout the interface
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better accessibility
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
