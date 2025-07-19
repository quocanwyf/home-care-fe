import { useState } from 'react';

import StatusOrdersBadge from '@/components/common/badge/StatusOrdersBadge';
import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const handleConfirm = async () => {
    await new Promise((res) => setTimeout(res, 1500));
    alert('Đã xóa thành công!');
  };
  return (
    <>
      <div className="scrollbar-w-2 scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-y-scroll">
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Add project"
          description="You are about to add this project."
          confirmText="Yes, Add"
          cancelText="No, throw it away"
          onConfirm={handleConfirm}
          icon
        >
          <Button
            className="cursor-pointer rounded px-4 py-2 text-white"
            onClick={() => setOpen(true)}
          >
            Thêm mục
          </Button>
        </ConfirmDialog>
        <StatusOrdersBadge status="Pending" />
      </div>
    </>
  );
};
export default DashboardPage;
