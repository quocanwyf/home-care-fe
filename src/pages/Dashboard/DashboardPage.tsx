import OrderForm from '@/components/form/OrderForm';

const DashboardPage = () => {
  return (
    <div className="h-full w-full rounded-2xl bg-white p-10">
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

      <OrderForm />
    </div>
  );
};

export default DashboardPage;
