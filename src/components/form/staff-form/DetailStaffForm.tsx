import { useParams } from 'react-router-dom';

import {
  Award,
  Briefcase,
  Building,
  Calendar,
  Camera,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';

import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { useGetStaffDetail } from '@/hooks/api/useStaffs.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';

const DetailStaffForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigateTo = useAppNavigate();

  const {
    data: staffDetailData,
    isLoading,
    error,
  } = useGetStaffDetail(id || '');

  if (!id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            Invalid Staff ID
          </h2>
          <p className="mb-6 text-gray-600">
            The staff ID provided is not valid.
          </p>
          <Button onClick={() => navigateTo('/staffs')} className="mt-4">
            Back to Staff List
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading staff details...
        </div>
      </div>
    );
  }

  if (error || !staffDetailData?.staff) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Error Loading Staff
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.message || 'Staff not found'}
          </p>
          <Button onClick={() => navigateTo('/staffs')} className="mt-4">
            Back to Staff List
          </Button>
        </div>
      </div>
    );
  }

  const staff = staffDetailData.staff;

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return dateString; // Already in DD/MM/YYYY format from API
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
          {/* Left Column - Avatar & Quick Info */}
          <div className="space-y-6 lg:col-span-1">
            {/* Avatar Card */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Camera className="-mt-1 mr-2 h-5 w-5" />
                <p className="text-sm">AVATAR</p>
              </div>

              <div className="text-center">
                {staff.avatar ? (
                  <div className="group relative">
                    <img
                      src={staff.avatar || '/public/bg-imgage/photo-1.png'}
                      alt="Staff Avatar"
                      className="mx-auto h-32 w-32 cursor-pointer rounded-full border-4 border-gray-100 object-cover transition-opacity hover:opacity-80"
                      onClick={() => openImageInNewTab(staff.avatar)}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-avatar.png';
                      }}
                    />
                  </div>
                ) : (
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Click to view full size
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Award className="-mt-1 mr-2 h-5 w-5" />
                <p className="text-sm">QUICK STATS</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="font-medium text-gray-900">
                    {staff.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusBadge(staff.status)}`}
                  >
                    {staff.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Salary</span>
                  <span className="font-medium text-gray-900">
                    {formatSalary(staff.salary)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Start Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(staff.startDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full justify-center">
              <Button
                className="bg-overlay-slider/90 hover:bg-overlay-slider w-full min-w-[140px] cursor-pointer text-white hover:text-white"
                variant="outline"
                onClick={() => {
                  navigateTo(`/staffs/edit/${staff._id}`, {
                    toast: {
                      type: 'success',
                      message: 'Direction success!',
                    },
                    delay: 1000,
                  });
                }}
              >
                Edit Staff
              </Button>
            </div>
          </div>

          {/* Right Column - Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Information */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <User className="-mt-1 mr-2 h-5.5 w-5.5" />
                <p className="text-sm">PERSONAL INFORMATION</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Staff ID
                  </label>
                  <p className="font-medium text-gray-900">{staff.staff_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="font-medium text-gray-900">{staff.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Birth Date
                  </label>
                  <p className="text-gray-900">{formatDate(staff.birthDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Birth Place
                  </label>
                  <p className="text-gray-900">{staff.birthPlace}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Phone className="-mt-1 mr-2 h-5 w-5" />
                <p className="text-sm">CONTACT INFORMATION</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  <p className="font-medium text-gray-900">{staff.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">{staff.email}</p>
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Briefcase className="-mt-1 mr-2 h-5.5 w-5.5" />
                <p className="text-sm">JOB INFORMATION</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="font-medium text-gray-900">{staff.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      staff.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {staff.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Salary
                  </label>
                  <p className="font-medium text-gray-900">
                    {formatSalary(staff.salary)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Start Date
                  </label>
                  <p className="text-gray-900">{formatDate(staff.startDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailStaffForm;
