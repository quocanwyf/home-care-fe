import { useAppNavigate } from '@/hooks/useAppNavigate';

import Logo from '../common/icons/Logo';
import GradientText from '../common/primitives/GradientText';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const LoginForm = () => {
  const navigateTo = useAppNavigate<{ from: string }>();
  const handleSuccess = () => {
    navigateTo('/dashboard', {
      state: { from: 'login' },
      toast: { type: 'success', message: 'Login successful!' },
      delay: 700,
    });
  };
  return (
    <>
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
        <Button
          onClick={handleSuccess}
          className="mx-auto w-1/3 cursor-pointer transition duration-500 ease-in-out hover:scale-105"
        >
          Login
        </Button>
      </div>
      <div className="mt-12 -mb-4 flex items-center justify-center gap-2">
        <Logo classNameImg="h-2 w-2" />
        <div className="animate__animated animate__bounce animate__infinite animate__slow mt-1">
          <span className="text-text-primary text-sm font-bold">HOME CARE</span>
          <GradientText classNameSpan="text-sm" content="- ADMIN" />
        </div>
      </div>
    </>
  );
};

export default LoginForm;
