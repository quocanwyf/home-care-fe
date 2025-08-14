import { Button } from '../ui/button';

const FailLoadingAndEntry = ({ content }: { content: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <p className="mb-4 text-red-500">{content}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );
};

export default FailLoadingAndEntry;
