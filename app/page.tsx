import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  ClipboardList,
  ListTodo,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}


      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
        {/* Glow */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex animate-pulse items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-4" />
            Simple. Fast. Organized.
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Manage your tasks{" "}
            <span className="bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              effortlessly
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Stay on top of your work with a clean, distraction-free task
            manager. Create, organize, and complete your tasks with
            ease.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="text-base shadow-lg shadow-primary/30"
            >
              <Link href="/task">
                <ClipboardList className="size-5" />
                View My Tasks
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base transition-all hover:scale-105 hover:bg-muted"
            >
              <Link href="/task/new">Create a Task</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">
            Everything you need to stay productive
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <FeatureCard
              icon={<ListTodo className="size-6 text-primary" />}
              title="Create Tasks"
              description="Quickly add tasks with titles, descriptions, and status tracking."
            />
            <FeatureCard
              icon={<CheckCircle2 className="size-6 text-primary" />}
              title="Track Progress"
              description="Mark tasks as pending, in-progress, or completed at a glance."
            />
            <FeatureCard
              icon={<Sparkles className="size-6 text-primary" />}
              title="Clean Interface"
              description="A minimal, distraction-free design that keeps you focused."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-muted-foreground">
          Built with Next.js and shadcn/ui
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-xl border bg-background p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 transition group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
