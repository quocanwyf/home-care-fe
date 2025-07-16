import { useToast } from '../../hooks/useToast';

const DashboardPage = () => {
  const { showSuccess } = useToast();
  return (
    <button className="h-full w-full" onClick={() => showSuccess('cccc')}>
      ccccc
    </button>
  );
};
export default DashboardPage;
