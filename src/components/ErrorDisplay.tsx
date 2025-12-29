interface ErrorDisplayProps {
  code: string;
  message: string;
}

const ErrorDisplay = ({ code, message }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-column items-center justify-center min-h-screen text-center gap-6">
      <div className="text-2xl/7 font-semibold inline-block leading-10">
        {' '}
        {code}{' '}
      </div>
      {/* <Separator orientation="vertical" /> */}
      <div className="text-sm"> {message} </div>
    </div>
  );
};

export default ErrorDisplay;
