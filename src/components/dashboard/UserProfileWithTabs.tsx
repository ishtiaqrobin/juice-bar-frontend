import { AlertTriangle, Lock, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import UserProfileComponent from "./UserProfile";

export default function UserProfileWithTabs() {

    return (
        <div className="container mx-auto px-6 py-6 max-w-full border rounded-lg p-6">
            <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6">
                {/* Vertical Tab List */}
                <TabsList className="flex flex-col h-fit md:w-64 w-full bg-transparent p-0 gap-1">
                    <TabsTrigger
                        value="profile"
                        className="w-full justify-start px-4 py-1.5"
                    >
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="w-full justify-start px-4 py-1.5"
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="account"
                        className="w-full justify-start px-4 py-1.5"
                    >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Account
                    </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <div className="flex-1">
                    {/* Profile Tab */}
                    <TabsContent value="profile" className="mt-0">
                        <UserProfileComponent />
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="mt-0">
                        <ChangePassword />
                    </TabsContent>

                    {/* Account Tab */}
                    <TabsContent value="account" className="mt-0">
                        <DeleteAccount />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}