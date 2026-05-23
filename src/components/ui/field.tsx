import * as React from "react";
import { cn } from "@/lib/utils";

// Field wrapper - handles data-invalid styling
const Field = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("space-y-1.5", className)}
        {...props}
    />
));
Field.displayName = "Field";

// FieldGroup - wraps multiple fields
const FieldGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props} />
));
FieldGroup.displayName = "FieldGroup";

// FieldLabel
const FieldLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium text-gray-800",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            // When parent Field has data-invalid, turn label red
            "group-data-[invalid=true]:text-destructive",
            className
        )}
        {...props}
    />
));
FieldLabel.displayName = "FieldLabel";

// FieldDescription - helper text
const FieldDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-xs text-muted-foreground", className)}
        {...props}
    />
));
FieldDescription.displayName = "FieldDescription";

// FieldError - shows validation errors from TanStack Form
interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
    errors?: (string | { message?: string })[];
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
    ({ className, errors, ...props }, ref) => {
        if (!errors || errors.length === 0) return null;

        return (
            <p
                ref={ref}
                className={cn("text-xs font-medium text-destructive", className)}
                {...props}
            >
                {errors.map((error, i) => (
                    <span key={i}>
                        {typeof error === "string" ? error : error?.message ?? "Invalid"}
                    </span>
                ))}
            </p>
        );
    }
);
FieldError.displayName = "FieldError";

export { Field, FieldGroup, FieldLabel, FieldDescription, FieldError };
