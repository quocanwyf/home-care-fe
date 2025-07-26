import { useState } from 'react';

import { Apple } from 'lucide-react';

import AppDropdown from '@/components/common/dropdowns/AppDropdown';

// import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
// import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  // const [open, setOpen] = useState(false);
  // const handleConfirm = async () => {
  //   await new Promise((res) => setTimeout(res, 1500));
  //   alert('Đã xóa thành công!');
  // };
  const [selectedOption, setSelectedOption] = useState('option1');

  const dashboardOptions = [
    { value: 'add', icon: <Apple /> },
    { label: 'Xóa mục', value: 'delete', icon: <Apple /> },
    { label: 'Sửa mục', value: 'edit', icon: <Apple /> },
  ];

  const handleOptionSelect = (option: {
    label: string;
    value: string | number;
  }) => {
    console.log('Selected option:', option);
    setSelectedOption(option.value.toString());

    switch (option.value) {
      case 'add':
        alert('Adding Analytics...');
        break;
      case 'delete':
        alert('Deleting Data...');
        break;
      case 'edit':
        alert('Editing Settings...');
        break;
    }
  };

  return (
    <>
      <div className="scrollbar-w-2">
        {/* <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Add project"
          description="You are about to add this project."
          confirmText="Yes, Add"
          cancelText="No, throw it away"
          onConfirm={handleConfirm}
          icon
          danger
        >
          <Button
            className="cursor-pointer px-4 py-2 text-white"
            onClick={() => setOpen(true)}
            variant="destructive"
          >
            Thêm mục
          </Button>
        </ConfirmDialog> */}
        <AppDropdown
          triggerLabel="Dashboard Actions"
          options={dashboardOptions}
          onSelect={handleOptionSelect}
          label="Choose Action"
          triggerClassName="min-w-[150px]"
          minWidth="min-w-[200px]"
        />
      </div>
    </>
  );
};
export default DashboardPage;
