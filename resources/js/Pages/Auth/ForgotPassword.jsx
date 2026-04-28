// // Inertia
// import { Head, Link, useForm } from '@inertiajs/react';

// // Icons
// import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

// // Components
// import FormField from '@/Components/FormField';
// import GuestLayout from '@/Layouts/GuestLayout';

// export default function ForgotPassword({ status }) {

//   // Forgot Password Form
//   const { data, setData, post, processing, errors } = useForm({
//     email: '',
//   });

//   // Forgot Password Form Submit
//   const submit = (e) => {
//     e.preventDefault();

//     post(route('password.email'));
//   };

//   return (
//     <GuestLayout>
//       <Head title="Forgot Password" />

//       <div className="w-full">
//         {/* Stylish DCM-System Logo */}
//         <div className="mb-8 text-center">
//           <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
//             DCM-System
//           </h1>
//           <div className="mt-2 flex justify-center">
//             <div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400" />
//           </div>
//           <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
//             Reset your password
//           </p>
//         </div>

//         {/* Info Message */}
//         <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
//           <p className="text-sm text-gray-700 dark:text-gray-300">
//             Forgot your password? No problem. Just enter your email address and we'll send you a password reset link that will allow you to choose a new one.
//           </p>
//         </div>

//         {/* Status Message */}
//         {status && (
//           <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
//             <div className="flex items-center">
//               <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               {status}
//             </div>
//           </div>
//         )}

//         {/* Forgot Password Form */}
//         <form onSubmit={submit} className="space-y-5">
//           {/* Email Field */}
//           <FormField
//             id="email"
//             name="email"
//             type="email"
//             label="Email Address"
//             value={data.email}
//             onChange={(e) => setData('email', e.target.value)}
//             error={errors.email}
//             icon={FaEnvelope}
//             placeholder="Enter your email address"
//             autoComplete="email"
//             autoFocus
//             required
//           />

//           {/* Actions */}
//           <div className="flex flex-col space-y-3 pt-2">
//             <button
//               type="submit"
//               disabled={processing}
//               className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
//             >
//               {processing ? (
//                 <>
//                   <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Sending link...
//                 </>
//               ) : (
//                 <>
//                   <FaPaperPlane className="mr-2 h-4 w-4" />
//                   Email Password Reset Link
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Help Text */}
//         <div className="mt-6 text-center">
//           <p className="text-xs text-gray-500 dark:text-gray-500">
//             If you're having trouble, please{' '}
//             <Link
//               // href={route('contact')}
//               className="text-blue-600 hover:underline dark:text-blue-400"
//             >
//               contact support
//             </Link>
//           </p>
//         </div>
//       </div>
//     </GuestLayout>
//   );
// }