// import OrderForm from '@/components/form/order-form/OrderForm';
import DragAndDropUpload from '@/components/common/upload-files/DragAndDropUpload';
import MaidForm from '@/components/form/maid-form/MaidForm';
import { ALLOWED_TYPES } from '@/constants/upload-files/allowed-types';

const AddOrderPage = () => {
  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-2">
      {/* <Label className="font-semibold" htmlFor="hmrId">
            <Phone className="inline-block h-4 w-4" />
            User ID
          </Label>
          <Input
            type="text"
            id="hmrId"
            name="hmrId" // ✅ Thêm name attribute
            placeholder="Enter your User ID"
            className="focus:border-border-primary/50 shadow-sm"
            required
          /> */}
      {/* <div className="flex gap-4">
        <div className="flex w-full flex-col gap-2">
          <label className="ml-2">Upload avatar</label>
          <DragAndDropUpload
            acceptedTypes={ALLOWED_TYPES}
            maxFileSizeByMB={20}
            maxFiles={1}
            browseText="Browse"
            showFileSize={true}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <label className="ml-2">Upload Health Certifications</label>
          <DragAndDropUpload
            acceptedTypes={ALLOWED_TYPES}
            maxFileSizeByMB={20}
            maxFiles={1}
            browseText="Browsesss"
            showFileSize={true}
          />
        </div>
      </div> */}
      <MaidForm />
    </div>
  );
};

export default AddOrderPage;
