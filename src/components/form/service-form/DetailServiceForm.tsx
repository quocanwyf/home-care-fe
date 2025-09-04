import { useParams } from 'react-router-dom';

import { Award, Building, DollarSign, Settings } from 'lucide-react';

import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { useGetServiceDetail } from '@/hooks/api/useServices.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';

const DetailServiceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigateTo = useAppNavigate();

  const {
    data: serviceDetailData,
    isLoading,
    error,
  } = useGetServiceDetail(id || '');

  if (!id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <Building className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            Invalid Service ID
          </h2>
          <p className="mb-6 text-gray-600">
            The service ID provided is not valid.
          </p>
          <Button onClick={() => navigateTo('/services')} className="mt-4">
            Back to Services List
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingFallback content="Loading order information..." />;
  }

  //  Show error state
  if (error || !serviceDetailData?.result) {
    return <FailLoadingAndEntry content="Failed to load order information" />;
  }

  const service = serviceDetailData.result;
  const coefficient = service.coefficient;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive
    );
  };

  return (
    <>
      {/* Content */}
      <div className="h-full overflow-y-auto pb-26">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Info & Stats */}
          <div className="space-y-6 lg:col-span-1">
            {/* Service Status Card */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Award className="-mt-1 mr-2 h-5 w-5" />
                <p className="text-sm">SERVICE STATUS</p>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <span
                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium ${getStatusBadge(service?.status)}`}
                  >
                    {service?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {service?.title}
                </h3>
                <p className="mt-2 text-xl font-bold text-blue-600">
                  {formatPrice(service?.basicPrice)}
                </p>
                <p className="text-sm text-gray-500">Basic Price</p>
              </div>
            </div>

            {/* Coefficient Quick Stats */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Settings className="-mt-1 mr-2 h-5 w-5" />
                <p className="text-sm">COEFFICIENT INFO</p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      {coefficient?.value}x
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {coefficient?.title}
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-2 py-1 text-xs font-medium ${getStatusBadge(coefficient?.status)}`}
                  >
                    {coefficient?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full justify-center">
              <Button
                className="bg-overlay-slider/90 hover:bg-overlay-slider w-full min-w-[140px] cursor-pointer text-white hover:text-white"
                variant="outline"
                onClick={() => {
                  navigateTo(`/services/edit/${service?._id}`, {
                    toast: {
                      type: 'success',
                      message: 'Direction success!',
                    },
                    delay: 1000,
                  });
                }}
              >
                Edit Service
              </Button>
            </div>
          </div>

          {/* Right Column - Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Service Information */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Building className="-mt-1 mr-2 h-5.5 w-5.5" />
                <p className="text-sm">SERVICE INFORMATION</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Service ID
                  </label>
                  <p className="font-medium text-gray-900">{service?._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Service Title
                  </label>
                  <p className="font-medium text-gray-900">{service?.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Basic Price
                  </label>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatPrice(service.basicPrice)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        service?.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service?.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Service Description
                </label>
                <div className="mt-2 rounded-lg bg-gray-50 p-4">
                  <p className="leading-relaxed text-gray-700">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Coefficient Information */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Settings className="-mt-1 mr-2 h-5.5 w-5.5" />
                <p className="text-sm">COEFFICIENT DETAILS</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Coefficient ID
                  </label>
                  <p className="font-medium text-gray-900">
                    {coefficient?._id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Coefficient Title
                  </label>
                  <p className="font-medium text-gray-900">
                    {coefficient?.title}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Coefficient Value
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {coefficient?.value}x
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        coefficient?.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coefficient?.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Coefficient Description
                </label>
                <div className="mt-2 rounded-lg bg-gray-50 p-4">
                  <p className="leading-relaxed text-gray-700">
                    {coefficient?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Calculation Example */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <DollarSign className="-mt-1 mr-2 h-5.5 w-5.5" />
                <p className="text-sm">PRICE CALCULATION</p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Basic Price:</span>
                  <span className="font-medium">
                    {formatPrice(service?.basicPrice)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Coefficient:</span>
                  <span className="font-medium">{coefficient?.value}x</span>
                </div>
                <hr className="my-2 border-blue-200" />
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-700">Final Price:</span>
                  <span className="text-lg text-blue-600">
                    {formatPrice(service?.basicPrice * coefficient?.value)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailServiceForm;
