import { useState } from 'react';

import { MESSAGES_AUTH } from '@/constants/messages/messages-auth';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import type { LoginRequest } from '@/types/auth';

import Logo from '../common/icons/Logo';
import GradientText from '../common/primitives/GradientText';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const LoginForm = () => {
  const { t } = useLanguage();
  const navigateTo = useAppNavigate<{ from: string }>();
  const [formData, setFormData] = useState<LoginRequest>({
    hmrId: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const { login, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.hmrId.trim()) {
      setError(MESSAGES_AUTH.USER_ID_REQUIRED);
      return;
    }
    if (!formData.password.trim()) {
      setError(MESSAGES_AUTH.PASSWORD_REQUIRED);
      return;
    }

    try {
      await login(formData);
      navigateTo('/dashboard', {
        state: { from: 'login' },
        delay: 700,
      });
    } catch (error: any) {
      setError(MESSAGES_AUTH.LOGIN_FAILED || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-4 mt-6 flex flex-wrap justify-center gap-6 md:flex-row">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label className="font-semibold" htmlFor="hmrId">
            {t('userId')}
          </Label>
          <Input
            type="text"
            id="hmrId"
            name="hmrId"
            placeholder="Enter your User ID"
            className="focus:border-border-primary/50 shadow-sm"
            value={formData.hmrId}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label className="font-semibold" htmlFor="password">
            {t('password')}
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="focus:border-border-primary/50 shadow-sm"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        {error && (
          <div className="w-full rounded bg-red-50 p-2 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <Button
          type="submit" // Thay đổi từ onClick thành type submit
          disabled={isLoading}
          className="mx-auto w-1/3 cursor-pointer transition duration-500 ease-in-out hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
      <div className="mt-8 flex items-center justify-center gap-2">
        <Logo classNameImg="h-2 w-2" />
        <div className="animate__animated animate__bounce animate__infinite animate__slow mt-1">
          <span className="text-text-primary text-sm font-bold">HOME CARE</span>
          <GradientText classNameSpan="text-sm" content="- ADMIN" />
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
