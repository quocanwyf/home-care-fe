import { MENU_ITEMS } from '@/constants/mock-data-sidebar';

export default function Sidebar() {
  return (
    <div className=" max-h-screen h-full w-full bg-background-second border-border-primary shadow-md rounded-4xl ">
      <div className="  flex items-center justify-center gap-2 p-4">
        <div className="rounded-full w-10 h-10 bg-overlay-slider items-center  flex">
          <img
            src="/icon-image/shell.png"
            alt="Logo"
            className="w-4 h-4 object-cover mx-auto rounded-full"
          />
        </div>
        <span className=" font-bold text-text-primary">HOME CARE</span>
        <span className="bg-gradient-to-b  from-text-linear1 via-text-linear2 to-text-linear3 text-transparent bg-clip-text">
          <span className="font-bold ">- ADMIN</span>
        </span>
      </div>

      <div className="border-b border-border-primary mx-4 mb-4" />

      <nav>
        {MENU_ITEMS.map((item, idx) => (
          <div key={idx}>
            {item.children ? (
              <div className=" text-text-primary font-bold flex justify-center mr-10 my-2">
                {item.label}
              </div>
            ) : (
              <div className=" group flex items-center gap-4 cursor-pointer p-4 pl-8 rounded-xl mx-4 transition-all duration-500 ease-in-out hover:bg-tab-hover ">
                {item.icon && (
                  <img
                    src={item?.icon}
                    alt={item?.label}
                    className="w-4 h-4 object-cover"
                  />
                )}
                <span className=" text-text-primary group-hover:text-text-secondary group-hover:font-semibold ">
                  {item.label}
                </span>
              </div>
            )}
            {item.children && (
              <div>
                {item.children.map((child, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-4 pl-8 cursor-pointer p-4 rounded-xl mx-4 transition-all duration-500 ease-in-out hover:bg-tab-hover "
                  >
                    {child.icon && (
                      <img
                        src={child?.icon}
                        alt={child?.label}
                        className="w-4 h-4 object-cover"
                      />
                    )}
                    <span className="text-base group-hover:text-text-secondary group-hover:font-semibold text-text-primary ">
                      {child.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="flex justify-center items-center">
        <div className="absolute bottom-8 group  flex items-center  gap-4 cursor-pointer  rounded-2xl mr-10 p-4 transition-all duration-500 ease-in-out hover:bg-tab-hover">
          <img
            src={'/icon-image/log-out.png'}
            alt={'Log out'}
            className="w-4 h-4 object-cover"
          />
          <span className=" text-base group-hover:text-red-500 group-hover:font-semibold text-text-primary  ">
            Log out
          </span>
        </div>
      </div>
    </div>
  );
}
