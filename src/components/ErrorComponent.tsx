import React from 'react';

interface ErrorComponentProps {
  mainText: string;
  secondaryText: string;
  customButton?: React.ReactNode;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  mainText,
  secondaryText,
  customButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
      <div className="text-2xl font-semibold leading-10">{mainText}</div>
      <div className="text-sm">{secondaryText}</div>
      {customButton && customButton}{' '}
    </div>
  );
};

export default ErrorComponent;
