'use client'
import { Provider as JotaiProvider } from 'jotai';
import { TooltipProvider } from 'src/ui/tooltip';

export const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <JotaiProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </JotaiProvider>
  )
}