// "use client";

// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { Loader2, LogOut } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface LogoutButtonProps {
//     variant?: "default" | "outline" | "ghost" | "destructive";
//     className?: string;
//     showIcon?: boolean;
// }

// export function LogoutButton({
//     variant = "ghost",
//     className,
//     showIcon = true
// }: LogoutButtonProps) {
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(false);

//     const handleLogout = async () => {
//         setIsLoading(true);

//         try {
//             await authClient.signOut({
//                 fetchOptions: {
//                     onSuccess: () => {
//                         toast.success("Logged out successfully");
//                         // Force refresh and redirect
//                         router.refresh();
//                         setTimeout(() => {
//                             window.location.href = "/login";
//                         }, 100);
//                     },
//                     onError: (ctx: any) => {
//                         toast.error("Logout failed");
//                         console.error("Logout error:", ctx.error);
//                         setIsLoading(false);
//                     },
//                 },
//             });
//         } catch (error) {
//             console.error("Logout error:", error);
//             toast.error("Logout failed");
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Button
//             variant={variant}
//             className={className}
//             onClick={handleLogout}
//             disabled={isLoading}
//         >
//             {isLoading ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//                 showIcon && <LogOut className="mr-2 h-4 w-4" />
//             )}
//             Logout
//         </Button>
//     );
// }
