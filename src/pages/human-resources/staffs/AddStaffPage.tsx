import StaffForm from '@/components/form/staff-form/StaffForm';

const AddStaffPage = () => {
  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-2">
      <StaffForm mode="create" />
    </div>
  );
};

export default AddStaffPage;
