import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 ">
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">General</h2>
                            <p className="text-sm text-muted-foreground">Manage your account settings</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}