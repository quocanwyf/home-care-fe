import DashboardForm from '@/components/form/dashboard-form/DashboardForm';

const DashboardPage = () => {
  return (
    <div className="h-full w-full overflow-scroll rounded-xl bg-white px-8 py-2">
      <DashboardForm />;
    </div>
  );
};

export default DashboardPage;
