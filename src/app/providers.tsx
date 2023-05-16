'use client'
import { Provider } from 'jotai';
import { TooltipProvider } from 'src/ui/tooltip';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </Provider>
  )
}