import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <React.Fragment>
      <h1 className="text-5xl font-bold">Hey, I'm Nam!</h1>
      <p className="text-lg mt-2">
        I'm a junior frontend software engineer. I've been working in the
        industry for nearly 4 years now. I'm currently working at{' '}
        <a
          href="https://career.teko.vn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Teko Solution
        </a>
        .
      </p>
    </React.Fragment>
  )
}
