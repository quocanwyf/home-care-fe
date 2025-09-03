import ServiceForm from '@/components/form/service-form/ServiceForm';

const AddServicePage = () => {
  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-2">
      <ServiceForm mode="create" />
    </div>
  );
};

export default AddServicePage;
