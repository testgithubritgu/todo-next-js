'use client'

import { useFetchTask } from '@/hooks/useFetchTasks'
import React, { useEffect, useState } from 'react'

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

const TaskPage = () => {
  const [data, setData] = useState<TodoApiResponse | null>(null)
  const { fetchTask, loading, error } = useFetchTask()

  useEffect(() => {
    const getTasks = async () => {
      const res = await fetchTask()
      setData(res)
    }

    getTasks()
  }, [])

  if (loading) return <p style={{ padding: '2rem', fontSize: '1.2rem' }}>Loading...</p>
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>

  const tasks = data?.data?.tasks ?? []

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>My Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.5rem' }} className='text-black'>{task.title}</h2>
              <p style={{ margin: 0, color: '#555' }}>{task.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskPage
