// Inertia
import { Head, Link, useForm } from '@inertiajs/react';

// Icons
import { FaEnvelope, FaLock, FaSignInAlt, } from 'react-icons/fa';

// Components 
import FormField from '@/Components/FormField';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }) {

  // Login Form - Use 'login' instead of 'email'
  const { data, setData, post, processing, errors, reset } = useForm({
    login: '',  // Changed from 'email' to 'login'
    password: '',
    remember: false,
  });

  // Login Form Submit
  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

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
            Welcome back! Please login to your account.
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
            {status}
          </div>
        )}

        {/* Error Messages */}
        {errors.login && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {errors.login}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Email/Phone Field */}
          <FormField
            id="login"
            name="login"
            type="text"
            label="Email or Phone Number"
            value={data.login}
            onChange={(e) => setData('login', e.target.value)}
            error={errors.login}
            icon={FaEnvelope}
            placeholder="Enter your email or phone number"
            autoComplete="username"
            autoFocus
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
            autoComplete="current-password"
            required
          />

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="remember"
                checked={data.remember}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500"
                onChange={(e) => setData('remember', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {canResetPassword ? (
              <Link
                href={route('password.request')}
                className="text-sm text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            ) : (
              <div />
            )}

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
                  Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2 h-4 w-4" />
                  Log in
                </>
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href={route('register')}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  );
}