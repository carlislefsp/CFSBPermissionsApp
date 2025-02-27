import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface UserRuleViolationIndicatorProps {
  violations: {
    ruleId: string;
    ruleName: string;
    message: string;
  }[];
}

export function UserRuleViolationIndicator({
  violations,
}: UserRuleViolationIndicatorProps) {
  if (violations.length === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex items-center'>
            <AlertCircle className='h-4 w-4 text-red-500' />
            <span className='ml-1 text-xs text-red-500'>
              {violations.length}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className='space-y-2'>
            {violations.map(violation => (
              <div key={violation.ruleId} className='text-sm'>
                <strong>{violation.ruleName}:</strong>
                <p>{violation.message}</p>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
