import { useState } from 'react';

import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import { Button } from '@/components/ui/button';

const MaidsPage = () => {
  const [open, setOpen] = useState(false);
  const handleConfirm = async () => {
    await new Promise((res) => setTimeout(res, 1500));
    alert('Đã xóa thành công!');
  };
  return (
    <>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Xóa người giúp việc"
        description="Bạn có chắc chắn muốn xóa người giúp việc này không?"
        confirmText="Có, xóa"
        cancelText="Không, hủy"
        onConfirm={handleConfirm}
        icon
        danger
      >
        <Button
          className="cursor-pointer rounded px-4 py-2 text-white"
          onClick={() => setOpen(true)}
          variant={'destructive'}
        >
          Xóa người giúp việc
        </Button>
      </ConfirmDialog>
    </>
  );
};

export default MaidsPage;
