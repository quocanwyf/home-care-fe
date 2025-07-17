const BackGroundImageLogin = () => {
  return (
    <div className="flex min-h-screen min-w-screen flex-col justify-around">
      <div className="mr-40 ml-40 flex justify-between">
        <div className="h-[220px] w-[400px]">
          <img
            src="/bg-imgage/photo-9.png"
            alt="Service 1"
            className="h-full w-full object-cover"
          />{' '}
        </div>
        <div className="h-[220px] w-[500px]">
          {' '}
          <img
            src="/bg-imgage/photo-4.png"
            alt="Service 1"
            className="h-full w-full object-cover"
          />{' '}
        </div>
      </div>
      <div className="mr-40 mb-10 ml-40 flex justify-between">
        <div className="h-[220px] w-[500px]">
          {' '}
          <img
            src="/bg-imgage/photo-3.png"
            alt="Service 1"
            className="h-full w-full object-cover"
          />{' '}
        </div>
        <div className="h-[220px] w-[400px]">
          <img
            src="/bg-imgage/photo-1.png"
            alt="Service 1"
            className="h-full w-full object-cover"
          />{' '}
        </div>
      </div>
    </div>
  );
};

export default BackGroundImageLogin;
