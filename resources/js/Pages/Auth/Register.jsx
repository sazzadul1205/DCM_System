// Inertia
import { Head, Link, useForm } from '@inertiajs/react';

// Icons
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

// Components
import FormField from '@/Components/FormField';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {

  // Register Form
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Register Form Submit
  const submit = (e) => {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Register" />

      <div className="w-full">
        {/* Stylish DCM-System Logo */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            DCM-System
          </h1>
          <div className="mt-2 flex justify-center">
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400" />
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Create your account to get started
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Name Field */}
          <FormField
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            error={errors.name}
            icon={FaUser}
            placeholder="Enter your full name"
            autoComplete="name"
            autoFocus
            required
          />

          {/* Email Field */}
          <FormField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
            icon={FaEnvelope}
            placeholder="Enter your email"
            autoComplete="username"
            required
          />

          {/* Password Field */}
          <FormField
            id="password"
            name="password"
            type="password"
            label="Password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            error={errors.password}
            icon={FaLock}
            placeholder="Enter your password"
            autoComplete="new-password"
            required
          />

          {/* Confirm Password Field */}
          <FormField
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            label="Confirm Password"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            error={errors.password_confirmation}
            icon={FaLock}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />

          {/* Password Requirements Hint */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href={route('login')}
              className="text-sm text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
            >
              Already registered?
            </Link>

            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-20 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
            >
              {processing ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2 h-4 w-4" />
                  Register
                </>
              )}
            </button>
          </div>
        </form>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            By registering, you agree to our{' '}
            <Link
              // href={route('terms')}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              // href={route('privacy')}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  );
}