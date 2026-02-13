'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Task } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ClipboardList, Edit, Loader2, Plus, RefreshCcw, Trash2 } from 'lucide-react'
import Link from 'next/link'

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

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/tasks')
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to fetch tasks')
  }
  const data = await res.json()
  return data.tasks
}

async function deleteTaskApi(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to delete task')
  }
}

function TaskCard({
  task,
  onDelete,
  isDeleting,
}: {
  task: Task
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  const handleDelete = () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    onDelete(task.id)
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={getStatusVariant(task.status)}>
                {task.status}
              </Badge>
            </div>
            <h2 className="truncate text-base font-semibold">{task.title}</h2>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href={`/task/${task.id}/edit`} aria-label={`Edit ${task.title}`}>
                <Edit className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isDeleting}
              onClick={handleDelete}
              aria-label={`Delete ${task.title}`}
              className="text-muted-foreground hover:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TaskPage() {
  const queryClient = useQueryClient()

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTaskApi,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.filter((t) => t.id !== deletedId)
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
     
    },
  })

 
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="mt-1 text-sm text-muted-foreground flex justify-center items-center gap-4">
              {isLoading
                ? 'Loading...'
                : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
                <span><RefreshCcw onClick={()=>{
                  window.location.reload()

                }} className='size-4 cursor-pointer' /></span>
            </p>
          </div>
          <Button asChild>
            <Link href="/task/new">
              <Plus className="size-4" />
              Add Task
            </Link>
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-destructive">
                Failed to load tasks:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Delete Error */}
        {deleteMutation.error && (
          <Card className="mb-3 border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center justify-between p-4">
              <p className="text-sm font-medium text-destructive">
                Failed to delete task:{' '}
                {deleteMutation.error instanceof Error
                  ? deleteMutation.error.message
                  : 'Unknown error'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.reset()}
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-3">
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <ClipboardList className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No tasks yet</h3>
            <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
              Get started by creating your first task.
            </p>
            <Button variant="outline" asChild>
              <Link href="/task/new">
                <Plus className="size-4" />
                Create a task
              </Link>
            </Button>
          </div>
        )}

        {/* Task List */}
        {!isLoading && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === task.id
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
