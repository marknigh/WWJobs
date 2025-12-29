const SpinnerCircle = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="flex w-1/2 items-center justify-center">
      <div className="w-7 h-7 border-[3px] border-primary/10 border-t-primary border-b-primary rounded-full animate-spin" />
    </div>
  </div>
);

export default SpinnerCircle;
