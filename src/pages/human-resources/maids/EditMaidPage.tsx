import { useParams } from 'react-router-dom';

import MaidForm from '@/components/form/maid-form/MaidForm';

const EditMaidPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid helper ID</div>;
  }

  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-2">
      <MaidForm mode="edit" helperId={id} />
    </div>
  );
};

export default EditMaidPage;
