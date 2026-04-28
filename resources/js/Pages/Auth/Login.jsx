// Inertia
import { Head, Link, useForm } from '@inertiajs/react';

// Icons
import { FaEnvelope, FaLock, FaSignInAlt, FaUserCircle, FaUsers } from 'react-icons/fa';

// Components 
import FormField from '@/Components/FormField';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword, testUsers = [] }) {

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

  // Fill form with user credentials (does NOT auto-submit)
  const fillUserCredentials = (user) => {
    setData('login', user.login);
    setData('password', user.password);
  };

  // Default test users if none provided from backend
  const defaultTestUsers = [
    {
      name: 'Super Admin',
      login: 'superadmin@example.com',
      password: 'SuperAdmin@123',
      role: 'Super Admin',
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Admin User',
      login: 'admin@example.com',
      password: 'Admin@123',
      role: 'Admin',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'Manager User',
      login: 'manager@example.com',
      password: 'Manager@123',
      role: 'Manager',
      color: 'from-green-500 to-teal-500'
    },
  ];

  const users = testUsers.length > 0 ? testUsers : defaultTestUsers;

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

          {/* Quick Test Login Cards - Inside form below password */}
          <div className="pt-2">
            <div className="mb-3 flex items-center gap-2">
              <FaUsers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Quick Test Login
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 ">
              {users.map((user, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillUserCredentials(user)}
                  className={`group relative overflow-hidden rounded-lg bg-gradient-to-r ${user.color} p-0.5 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                >
                  <div className="relative flex items-center gap-3 rounded-lg bg-white p-3 transition-all duration-300 dark:bg-gray-900">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${user.color}`}>
                      <FaUserCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                      Fill →
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              ⚡ Click a card to fill credentials, then click Login
            </p>
          </div>

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