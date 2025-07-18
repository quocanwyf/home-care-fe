import LoginForm from '@/components/auth/LoginForm';
import GradientText from '@/components/common/GradientText';
import Overlay from '@/components/common/Overlay';

import BackGroundImageLogin from '../../components/auth/BackGroundImageLogin';

const LoginPage = () => {
  return (
    <div className="shadow-md">
      <BackGroundImageLogin />
      <Overlay className="h-full opacity-50" />
      <div className="absolute inset-0 z-20 mx-6 my-4 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <GradientText
            content="LOGIN"
            className="flex justify-center text-xl"
          />
          <GradientText
            content="Enter your email and password to login"
            className="flex justify-center text-sm"
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
