import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <div>Ok, this place I will introduce about myself and my work.</div>
}
