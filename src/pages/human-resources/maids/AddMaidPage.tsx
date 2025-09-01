import MaidForm from '@/components/form/maid-form/MaidForm';

const AddOrderPage = () => {
  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-2">
      <MaidForm mode="create" />
    </div>
  );
};

export default AddOrderPage;
