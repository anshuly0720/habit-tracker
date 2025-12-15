import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-background">
                <Sidebar username={session.user.name} />
                {/* Add padding-top on mobile for fixed header, margin-left on desktop for sidebar */}
                <main className="pt-16 lg:pt-0 lg:ml-64 min-h-screen p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}
