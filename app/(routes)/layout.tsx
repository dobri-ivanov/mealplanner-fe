import { Navigation } from "@/components/navigation"

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  )
}

