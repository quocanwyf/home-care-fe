import { useParams } from 'react-router-dom';

import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  Camera,
  Clock,
  Edit3,
  FileText,
  Heart,
  MapPin,
  Phone,
  Ruler,
  User,
  Weight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGetHelperDetail } from '@/hooks/api/useHelpers.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';

const DetailMaidPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigateTo = useAppNavigate();

  const { data: helperData, isLoading, error } = useGetHelperDetail(id || '');

  console.log(helperData);
  if (!id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            Invalid Helper ID
          </h2>
          <p className="mb-6 text-gray-600">
            The helper ID provided is not valid.
          </p>
          <Button onClick={() => navigateTo('/maids')} className="mt-4">
            Back to Helpers List
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
          Loading helper details...
        </div>
      </div>
    );
  }

  if (error || !helperData?.helper) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Error Loading Helper
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.message || 'Helper not found'}
          </p>
          <Button onClick={() => navigateTo('/maids')} className="mt-4">
            Back to Helpers List
          </Button>
        </div>
      </div>
    );
  }

  const helper = helperData.helper;

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const getWorkingStatusBadge = (status: string) => {
    const statusStyles = {
      working: 'bg-blue-100 text-blue-800 border-blue-200',
      offline: 'bg-gray-100 text-gray-800 border-gray-200',
      available: 'bg-green-100 text-green-800 border-green-200',
    };

    return (
      statusStyles[status as keyof typeof statusStyles] || statusStyles.offline
    );
  };

  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-6">
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
                {helper.avatar ? (
                  <div className="group relative">
                    <img
                      src={helper.avatar}
                      alt="Helper Avatar"
                      className="mx-auto h-32 w-32 cursor-pointer rounded-full border-4 border-gray-100 object-cover transition-opacity hover:opacity-80"
                      onClick={() => openImageInNewTab(helper.avatar)}
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
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">
                    {helper.yearOfExperience} years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Working Status</span>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-medium ${getWorkingStatusBadge(helper.workingStatus)}`}
                  >
                    {helper.workingStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Height</span>
                  <span className="font-medium text-gray-900">
                    {helper.height} cm
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="font-medium text-gray-900">
                    {helper.weight} kg
                  </span>
                </div>
                {helper.baseFactor && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base Factor</span>
                    <span className="font-medium text-gray-900">
                      {helper.baseFactor}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex w-full justify-center">
              <Button
                className="bg-overlay-slider/90 hover:bg-overlay-slider w-full min-w-[140px] cursor-pointer text-white hover:text-white"
                variant="outline"
                onClick={() => {
                  navigateTo(`/maids/edit/${helper._id}`, {
                    toast: {
                      type: 'success',
                      message: 'Direction success!',
                    },
                    delay: 1000,
                  });
                }}
              >
                Edit Helper
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
                    Helper ID
                  </label>
                  <p className="font-medium text-gray-900">
                    {helper.helper_id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="font-medium text-gray-900">{helper.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Birth Date
                  </label>
                  <p className="text-gray-900">{helper.birthDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Birth Place
                  </label>
                  <p className="text-gray-900">{helper.birthPlace}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Gender
                  </label>
                  <p className="text-gray-900 capitalize">{helper.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Nationality
                  </label>
                  <p className="text-gray-900">{helper.nationality}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Education Level
                  </label>
                  <p className="text-gray-900 capitalize">
                    {helper.educationLevel}
                  </p>
                </div>
                {helper.startDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Start Date
                    </label>
                    <p className="text-gray-900">{helper.startDate}</p>
                  </div>
                )}
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
                  <p className="font-medium text-gray-900">{helper.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-gray-900">{helper.address}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <Briefcase className="-mt-1 mr-2 h-5.5 w-5.5" />
                <p className="text-sm">SERVICES</p>
              </div>

              {helper.jobs && helper.jobs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {helper.jobs.map((job: any, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {job.title}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No services assigned</p>
              )}
            </div>

            {/* Experience */}
            <div className="bg-overlay-slider/8 rounded-lg p-6">
              <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                <FileText className="-mt-1 mr-2 h-5 w-5" />
                <p className="text-sm">EXPERIENCE & DESCRIPTION</p>
              </div>

              <div className="space-y-4">
                <div className="mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-gray-700" />
                  <span className="font-medium text-gray-900">
                    {helper.yearOfExperience} years of experience
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <div
                    className="prose mt-2 max-w-none text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html: helper.experienceDescription,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Health Certificates */}
            {helper.healthCertificates &&
              helper.healthCertificates.length > 0 && (
                <div className="bg-overlay-slider/8 rounded-lg p-6">
                  <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
                    <Heart className="-mt-1 mr-2 h-5 w-5" />
                    <p className="text-sm">HEALTH CERTIFICATES</p>
                  </div>

                  <div className="space-y-2">
                    {helper.healthCertificates.map(
                      (cert: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => openImageInNewTab(cert)}
                          className="flex w-full items-center gap-3 rounded border bg-white p-3 text-left transition-colors hover:bg-gray-50"
                        >
                          <FileText className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-blue-600 hover:underline">
                            Certificate {index + 1} - Click to view
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMaidPage;
