import GradientText from '@/components/common/GradientText';
import Logo from '@/components/common/Logo';
import Overlay from '@/components/common/Overlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <div className="mt-6 flex flex-wrap items-center gap-6 md:flex-row">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="id">Identifier </Label>
              <Input
                type="text"
                id="id"
                placeholder="Enter your ID"
                className="border-border-primary shadow-md"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="border-border-primary shadow-md"
              />
            </div>
            <Button className="mx-auto cursor-pointer transition duration-500 ease-in-out hover:scale-105">
              Login
            </Button>
          </div>
          <div className="mt-12 -mb-4 flex items-center justify-center gap-2">
            <Logo classNameImg="h-2 w-2" />
            <div className="animate__animated animate__bounce animate__infinite animate__slow mt-1">
              <span className="text-text-primary text-sm font-bold">
                HOME CARE
              </span>
              <GradientText classNameSpan="text-sm" content="- ADMIN" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
