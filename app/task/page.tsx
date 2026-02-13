'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDeleteTask } from '@/hooks/useDeleteTask'
import { useFetchTask } from '@/hooks/useFetchTasks'
import { ClipboardList, Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
}

interface TodoApiResponse {
  success: boolean
  data?: { tasks: Task[] }
}

function TaskSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
          <div className="flex gap-1">
            <div className="size-8 rounded-md bg-muted" />
            <div className="size-8 rounded-md bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'done':
      return 'default' as const
    case 'in-progress':
    case 'in progress':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

const TaskPage = () => {
  const [data, setData] = useState<TodoApiResponse | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { fetchTask, loading, error } = useFetchTask()
  const { deleteTask } = useDeleteTask()

  useEffect(() => {
    const getTasks = async () => {
      const res = await fetchTask()
      setData(res)
    }
    getTasks()
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteTask(id)
  }

  const tasks = data?.data?.tasks ?? []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Link href="/task/new">
            <Button>
              <Plus className="size-4" />
              Add Task
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-destructive">
                Failed to load tasks: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <ClipboardList className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No tasks yet</h3>
            <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
              Get started by creating your first task.
            </p>
            <Link href="/task/new">
              <Button variant="outline">
                <Plus className="size-4" />
                Create a task
              </Button>
            </Link>
          </div>
        )}

        {/* Task List */}
        {!loading && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <h2 className="truncate text-base font-semibold">
                        {task.title}
                      </h2>
                      {task.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Link href={`/task/${task.id}/edit`}>
                        <Button variant="ghost" size="icon-sm">
                          <Edit className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={deletingId === task.id}
                        onClick={() => handleDelete(task.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        {deletingId === task.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskPage
