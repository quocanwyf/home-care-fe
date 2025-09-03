import { useParams } from 'react-router-dom';

import StaffForm from '@/components/form/staff-form/StaffForm';

const EditStaffPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Invalid Staff ID
          </h2>
          <p className="text-gray-500">
            Please provide a valid staff ID to edit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-2">
      <StaffForm mode="edit" staffId={id} />
    </div>
  );
};

export default EditStaffPage;
