// Pages/Profile/CompleteProfile.jsx

// Inertia
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

// Icons
import {
  FaUser,
  FaShieldAlt,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaAmbulance,
  FaInfoCircle,
  FaEye,
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Step Components
import AddressStep from './Steps/AddressStep';
import PreviewStep from './Steps/PreviewStep';
import EmergencyStep from './Steps/EmergencyStep';
import BasicInfoStep from './Steps/BasicInfoStep';

export default function CompleteProfile({ user }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data persistence across steps
  const { data, setData, post, processing, errors } = useForm({
    // Basic Info
    name: user?.name || '',
    email: user?.email || '',
    phone_primary: user?.phone_primary || '',
    phone_secondary: user?.phone_secondary || '',
    blood_group: user?.blood_group || '',
    date_of_birth: '',
    gender: '',
    // Address Info
    address_division: '',
    address_district: '',
    address_police_station: '',
    address_postal_code: '',
    address_details: '',
    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
  });

  // Validate current step before proceeding
  const validateStep = (step) => {
    const stepErrors = {};

    if (step === 1) {
      if (!data.name) stepErrors.name = 'Full name is required';
      if (!data.email) stepErrors.email = 'Email is required';
      if (!data.phone_primary) stepErrors.phone_primary = 'Primary phone is required';
    }

    return Object.keys(stepErrors).length === 0;
  };

  // Mark step as completed
  const markStepCompleted = (step) => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
  };

  // Next step handler
  const nextStep = () => {
    if (validateStep(currentStep)) {
      markStepCompleted(currentStep);
      setCurrentStep(prev => Math.min(prev + 1, 4)); // Now 4 steps (including preview)
    }
  };

  // Previous step handler
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Navigate to specific step
  const goToStep = (step) => {
    if (step < currentStep || completedSteps[step - 1]) {
      setCurrentStep(step);
    }
  };

  // Edit from preview - go back to specific step
  const editStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  // Final submit - ONLY when user clicks submit button on preview page
  const submit = (e) => {
    e.preventDefault();
    if (!isSubmitting && !processing) {
      setIsSubmitting(true);
      post(route('profile.complete.store'), {
        onFinish: () => {
          setIsSubmitting(false);
        }
      });
    }
  };

  // Steps configuration
  const steps = [
    { number: 1, title: 'Basic Info', icon: FaUser, description: 'Personal details' },
    { number: 2, title: 'Address', icon: FaHome, description: 'Location information' },
    { number: 3, title: 'Emergency', icon: FaAmbulance, description: 'Emergency contacts' },
    { number: 4, title: 'Preview', icon: FaEye, description: 'Review & submit' }
  ];

  return (
    <AuthenticatedLayout>
      <Head title={`Complete Profile - Step ${currentStep} of 4`} />

      <div className="w-full min-h-screen">
        {/* Header Section */}
        <div className="mb-8 text-center w-full">
          <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3">
            <FaShieldAlt className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Step {currentStep} of 4: {steps[currentStep - 1].description}
          </p>
          <div className="mt-2 flex justify-center w-full">
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8 w-full">
          <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => goToStep(step.number)}
                    disabled={step.number > currentStep && !completedSteps[step.number - 1]}
                    className={`
                      relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300
                      ${step.number === currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                        : completedSteps[step.number]
                          ? 'bg-green-500 text-white cursor-pointer hover:scale-105'
                          : step.number < currentStep
                            ? 'bg-green-500 text-white cursor-pointer hover:scale-105'
                            : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {completedSteps[step.number] || step.number < currentStep ? (
                      <FaCheck className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </button>
                  <span className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-2 flex-1">
                    <div className={`
                      h-1 rounded-full transition-all duration-300
                      ${completedSteps[step.number] || step.number < currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-gray-300 dark:bg-gray-700'
                      }
                    `} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form - NO AUTO SUBMIT */}
        <form onSubmit={submit} className="w-full">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <BasicInfoStep
              data={data}
              setData={setData}
              errors={errors}
              user={user}
            />
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <AddressStep
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <EmergencyStep
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {/* Step 4: Preview & Submit */}
          {currentStep === 4 && (
            <PreviewStep
              data={data}
              user={user}
              onEdit={editStep}
              isSubmitting={isSubmitting || processing}
            />
          )}

          {/* Navigation Buttons - Only show for non-preview steps */}
          {currentStep !== 4 && (
            <div className="mt-8 flex justify-between w-full">
              <button
                type="button"
                onClick={prevStep}
                className={`inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${currentStep === 1 ? 'invisible' : ''}`}
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Next Step
                <FaArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          {/* Progress Summary */}
          {currentStep !== 4 && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 w-full">
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
                <FaInfoCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  {Object.keys(completedSteps).length} of 3 sections completed
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </AuthenticatedLayout>
  );
}