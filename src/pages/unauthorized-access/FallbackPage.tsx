import { useNavigate } from 'react-router-dom';

import { ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-mobile:mx-4 flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <img
          src="/bg-imgage/deny.gif"
          alt="Loading..."
          className="mix-blend-multiply"
          style={{
            filter: 'contrast(1.1) brightness(1.1)    ',
          }}
        />

        <h1 className="mt-6 text-4xl font-bold text-gray-900">Access Denied</h1>

        <p className="mt-4 text-lg text-gray-600">
          You don't have permission to access this page.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Please contact your administrator if you believe this is an error.
        </p>

        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-overlay-slider flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
