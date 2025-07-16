import GradientText from '@/components/common/GradientText';
import Overlay from '@/components/common/Overlay';

import BackGroundImageLogin from '../../components/auth/BackGroundImageLogin';

const LoginPage = () => {
  return (
    <div className="shadow-md">
      <BackGroundImageLogin />
      <Overlay className="h-full opacity-50" />
      <div className="absolute inset-0 z-20 mx-6 my-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <GradientText content="LOGIN" className="flex justify-center" />
          <GradientText
            content="Enter your email and password to login"
            className="flex justify-center text-sm"
          />
          <form className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
