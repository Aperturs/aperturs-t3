import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface ToolTipSimpleProps {
  children: React.ReactNode;
  content: string;
  className?: string;
  duration?: number;
}

export default function ToolTipSimple({
  children,
  content,
  className,
  duration = 100,
}: ToolTipSimpleProps) {
  return (
    <TooltipProvider delayDuration={duration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
