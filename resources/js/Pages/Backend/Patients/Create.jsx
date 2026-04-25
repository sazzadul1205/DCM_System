// Pages/Backend/Patients/Create.jsx

// Inertia
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

// Icons
import {
  FaUser,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaAmbulance,
  FaAllergies,
  FaHeartbeat,
  FaPills,
  FaUserMd,
  FaEye,
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// SweetAlert
import Swal from 'sweetalert2';

// Step Components
import PatientBasicInfo from './components/PatientBasicInfo';
import PatientAddress from './components/PatientAddress';
import PatientEmergencyContact from './components/PatientEmergencyContact';
import PatientReferral from './components/PatientReferral';
import PatientAllergies from './components/PatientAllergies';
import PatientConditions from './components/PatientConditions';
import PatientMedications from './components/PatientMedications';
import PatientReview from './components/PatientReview';

export default function Create({ referrers, availableAllergies, availableConditions }) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});

  // Form data persistence across steps
  const { data, setData, post, processing, errors, clearErrors } = useForm({
    // Basic Info
    name: '',
    phone_primary: '',
    phone_secondary: '',
    email: '',
    gender: '',
    date_of_birth: '',
    blood_group: '',
    status: 'active',
    registration_date: new Date().toISOString().split('T')[0],
    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    // Address
    address_division: '',
    address_district: '',
    address_police_station: '',
    address_postal_code: '',
    address_details: '',
    // Referral
    referred_by_user_id: '',
    referral_source: '',
    referral_notes: '',
    // Allergies
    allergies: [],
    // Medical Conditions
    conditions: [],
    // Medications
    medications: [],
  });

  // Validate current step before proceeding
  const validateStep = (step) => {
    clearErrors();

    if (step === 1) {
      if (!data.name) {
        return false;
      }
      if (!data.phone_primary) {
        return false;
      }
      if (!data.gender) {
        return false;
      }
      if (!data.date_of_birth) {
        return false;
      }
    }

    return true;
  };

  // Mark step as completed
  const markStepCompleted = (step) => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
  };

  // Next step handler
  const nextStep = () => {
    if (validateStep(currentStep)) {
      markStepCompleted(currentStep);
      setCurrentStep(prev => Math.min(prev + 1, 8));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all required fields before proceeding.',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  // Previous step handler
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to specific step
  const goToStep = (step) => {
    if (step < currentStep || completedSteps[step - 1]) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Edit from preview
  const editStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show error toast
  const showErrorToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  // Show success toast
  const showSuccessToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  // Final submit
  const submit = (e) => {
    e.preventDefault();

    if (!processing) {
      // Prepare payload - send as JSON strings
      const payload = {
        ...data,
        allergies: JSON.stringify(data.allergies),
        conditions: JSON.stringify(data.conditions),
        medications: JSON.stringify(data.medications),
      };

      post(route('patients.store'), {
        data: payload,
        preserveScroll: true,
        onSuccess: () => {
          showSuccessToast('Patient registered successfully!');
          router.get(route('patients.index'));
        },
        onError: (errors) => {
          console.error('Submission errors:', errors);
          const errorMessage = Object.values(errors).flat()[0] || 'Failed to create patient. Please try again.';
          showErrorToast(errorMessage);
        },
        onFinish: () => {
          // Optional: any cleanup after request finishes
        },
      });
    }
  };

  // Steps configuration
  const steps = [
    { number: 1, title: 'Basic Info', icon: FaUser, description: 'Personal details' },
    { number: 2, title: 'Emergency', icon: FaAmbulance, description: 'Emergency contact' },
    { number: 3, title: 'Address', icon: FaHome, description: 'Location information' },
    { number: 4, title: 'Referral', icon: FaUserMd, description: 'Referral source' },
    { number: 5, title: 'Allergies', icon: FaAllergies, description: 'Patient allergies' },
    { number: 6, title: 'Conditions', icon: FaHeartbeat, description: 'Medical conditions' },
    { number: 7, title: 'Medications', icon: FaPills, description: 'Current medications' },
    { number: 8, title: 'Preview', icon: FaEye, description: 'Review & submit' }
  ];

  return (
    <AuthenticatedLayout>
      <Head title={`Register Patient - Step ${currentStep} of 8`} />

      <div className="w-full min-h-screen">
        {/* Header Section */}
        <div className="mb-8 text-center w-full relative">
          <button
            onClick={() => router.get(route('patients.index'))}
            className="absolute left-4 top-0 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Register New Patient
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Step {currentStep} of 8: {steps[currentStep - 1].description}
          </p>
          <div className="mt-2 flex justify-center w-full">
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8 w-full px-4">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.number} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                {/* Step Circle + Label */}
                <div className="flex flex-col items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => goToStep(step.number)}
                    disabled={step.number > currentStep && !completedSteps[step.number]}
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300
                      ${step.number === currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-200 dark:ring-blue-900 shadow-lg'
                        : completedSteps[step.number]
                          ? 'bg-green-500 text-white cursor-pointer hover:scale-105 hover:shadow-md'
                          : step.number < currentStep
                            ? 'bg-green-500 text-white cursor-pointer hover:scale-105 hover:shadow-md'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {completedSteps[step.number] || step.number < currentStep ? (
                      <FaCheck className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </button>

                  <span className={`
                    mt-2 text-xs font-medium text-center whitespace-nowrap transition-colors duration-200
                    ${step.number === currentStep
                      ? 'text-blue-600 dark:text-blue-400'
                      : completedSteps[step.number] || step.number < currentStep
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {step.title}
                  </span>
                </div>

                {/* Connector Line - only show if not last step */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3">
                    <div className={`
                      h-1 rounded-full transition-all duration-300
                      ${completedSteps[step.number] || step.number < currentStep
                        ? 'bg-gradient-to-r from-green-500 to-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                      }
                    `} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="w-full">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <PatientBasicInfo
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {/* Step 2: Emergency Contact */}
          {currentStep === 2 && (
            <PatientEmergencyContact
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <PatientAddress
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {/* Step 4: Referral */}
          {currentStep === 4 && (
            <PatientReferral
              data={data}
              setData={setData}
              errors={errors}
              referrers={referrers}
            />
          )}

          {/* Step 5: Allergies */}
          {currentStep === 5 && (
            <PatientAllergies
              data={data}
              setData={setData}
              availableAllergies={availableAllergies}
            />
          )}

          {/* Step 6: Medical Conditions */}
          {currentStep === 6 && (
            <PatientConditions
              data={data}
              setData={setData}
              availableConditions={availableConditions}
            />
          )}

          {/* Step 7: Medications */}
          {currentStep === 7 && (
            <PatientMedications
              data={data}
              setData={setData}
            />
          )}

          {/* Step 8: Preview & Submit */}
          {currentStep === 8 && (
            <PatientReview
              data={data}
              onEdit={editStep}
              isSubmitting={processing}
            />
          )}

          {/* Navigation Buttons - Hidden on preview step since submit is inside review */}
          {currentStep !== 8 && (
            <div className="mt-8 flex justify-between w-full pb-5">
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
        </form>
      </div>
    </AuthenticatedLayout>
  );
}