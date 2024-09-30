import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

interface TabsProps {
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const TabsList: React.FC<TabsProps> = ({ children }) => {
  return <div className="flex border-b">{children}</div>;
};

interface TabsTriggerProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`px-4 py-2 ${
        isActive
          ? "border-b-2 border-blue-500 text-blue-500"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  children: ReactNode;
  isActive: boolean;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  children,
  isActive,
}) => {
  if (!isActive) return null;
  return <div className="mt-4">{children}</div>;
};
