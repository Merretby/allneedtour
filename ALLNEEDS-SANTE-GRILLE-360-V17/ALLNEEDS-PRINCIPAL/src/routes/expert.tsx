import { Outlet, createFileRoute } from '@tanstack/react-router'
import { ExpertShell } from '@/components/ExpertWorkspace'
export const Route=createFileRoute('/expert')({component:()=> <ExpertShell><Outlet/></ExpertShell>})
