import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface IconButtonProps extends ComponentProps<'button'> {
  transparent?: boolean 
}

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button 
      className={twMerge(
        "border border-white/10 rounded-md p-1.5",
        transparent ? "bg-black/10" : "bg-white/10",
        props.disabled ? "opacity-50" : null,
      )}
      {...props} 
    />
  )
}