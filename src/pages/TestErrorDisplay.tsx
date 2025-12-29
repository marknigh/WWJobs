import ErrorDisplay from '@/components/ErrorDisplay';

export default function TestErrorDisplay() {
  return (
    <div>
      <ErrorDisplay code="404" message="Page not found" />
      <ErrorDisplay code="500" message="Internal server error" />
    </div>
  );
}
