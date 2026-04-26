// React
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Icons
import {
  FaMoon,
  FaSun,
  FaUser,
  FaSignOutAlt,
  FaUserCog,
  FaChevronDown,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaUserCheck,
  FaIdCard,
  FaUserShield,
  FaAllergies,
  FaNotesMedical,
  FaUserInjured,
  FaUserPlus,
  FaUserEdit,
  FaArchive
} from 'react-icons/fa';

export default function AuthenticatedLayout({ children }) {
  const user = usePage().props.auth.user;
  const isProfileCompleted = user?.profile_completed || false;
  const userPermissions = user?.role?.permissions || [];
  const currentRoute = route().current();

  // ==== States ====
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') { return false; }
    const savedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  // ==== Functions ====
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((current) => !current);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route('logout'));
  };

  // Check if user has permission for a menu item
  const hasPermission = (permissionKey) => {
    if (!permissionKey) return true;
    if (!userPermissions.length) return false;
    return userPermissions.includes(permissionKey);
  };

  // Navigation items with permissions
  const allNavigationItems = [
    {
      name: 'Dashboard',
      icon: FaTachometerAlt,
      href: route('dashboard'),
      permission_key: "dashboard.view",
      current: currentRoute === 'dashboard',
    }
  ];

  // Conditionally add profile related menu items based on profile completion status
  if (!isProfileCompleted) {
    // User hasn't completed profile - show Complete Profile
    allNavigationItems.push({
      name: 'Complete Profile',
      icon: FaUserCog,
      href: route('profile.complete'),
      permission_key: null,
      current: currentRoute === 'profile.complete',
    });
  } else {
    // Always show My Profile
    allNavigationItems.push(
      {
        name: 'My Profile',
        icon: FaIdCard,
        href: route('profile.show'),
        permission_key: "profile.view",
        current: currentRoute === 'profile.show',
      },
      {
        name: 'Manage Roles',
        icon: FaUserShield,
        href: route('roles.index'),
        permission_key: "roles.index",
        current: currentRoute === 'roles.index',
      },
      {
        name: 'Manage Allergies Options',
        icon: FaAllergies,
        href: route('allergies.index'),
        permission_key: "allergies.index",
        current: currentRoute === 'allergies.index',
      },
      {
        name: 'Manage Medical Conditions Options',
        icon: FaNotesMedical,
        href: route('medical-conditions.index'),
        permission_key: "medical-conditions.index",
        current: currentRoute === 'medical-conditions.index',
      },
      {
        name: 'Patient List',
        icon: FaUserInjured,
        href: route('patients.index'),
        permission_key: "patients.index",
        current: currentRoute === 'patients.index',
      },
      {
        name: 'Register New Patient',
        icon: FaUserPlus,
        href: route('patients.create'),
        permission_key: "patients.create",
        current: currentRoute === 'patients.create',
      },
      {
        name: 'Archived Patients', 
        icon: FaArchive,
        href: route('patients.archived'),
        permission_key: "patients.archived",
        current: currentRoute === 'patients.archived',
      },
    );

    // Edit Profile - Only show when on the Edit Profile page, and it won't be clickable
    if (currentRoute === 'profile.edit') {
      allNavigationItems.push({
        name: 'Edit Profile',
        icon: FaUserCheck,
        href: '#',
        permission_key: "profile.edit",
        current: true,
      });
    }

    // Edit Patient - Only show when on the Edit Profile page, and it won't be clickable
    if (currentRoute === 'patients.edit') {
      allNavigationItems.push({
        name: 'Edit Patient',
        icon: FaUserEdit,
        href: '#',
        permission_key: "patients.edit",
        current: true,
      });
    }
  }

  // Filter navigation items based on user permissions
  const navigation = allNavigationItems.filter(item => hasPermission(item.permission_key));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 right-0 left-0 z-30 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            {/* Left Section - Menu Toggle & Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {isSidebarOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>

              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DCM-System
              </Link>
            </div>

            {/* Right Section - Dark Mode Toggle & User Menu */}
            <div className="flex items-center space-x-4">
              {/* Profile Completion Warning - Only show if not completed */}
              {!isProfileCompleted && (
                <div className="hidden md:block">
                  <div className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                    ⚠️ Profile incomplete
                  </div>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
              </button>

              {/* User Dropdown Menu */}
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <FaChevronDown className={`h-3 w-3 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 md:hidden">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>

                      {/* Conditional profile links in dropdown */}
                      {!isProfileCompleted ? (
                        <Link
                          href={route('profile.complete')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20 transition-colors duration-150"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUserCog className="h-4 w-4" />
                          <span>Complete Profile</span>
                        </Link>
                      ) : (
                        <>
                          <Link
                            href={route('profile.show')}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaIdCard className="h-4 w-4" />
                            <span>View Profile</span>
                          </Link>
                          <Link
                            href={route('profile.edit')}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaUserCog className="h-4 w-4" />
                            <span>Edit Profile</span>
                          </Link>
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-150"
                      >
                        <FaSignOutAlt className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 z-20 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="flex h-full flex-col">
          {/* Profile Completion Banner in Sidebar */}
          {!isProfileCompleted && (
            <div className="m-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <div className="flex items-center gap-2">
                <FaUserCog className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  Please complete your profile
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = item.current;
              // For Edit Profile, make it non-clickable by using div instead of Link
              if (item.name === 'Edit Profile' && item.href === '#') {
                return (
                  <div
                    key={item.name}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium cursor-default ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white opacity-75'
                      : 'text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                );
              }

              // Regular clickable links
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>DCM-System v1.0</p>
              <p className="mt-1">© 2024 All rights reserved</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Page Content */}
        <div className="pt-20 px-5">
          {children}
        </div>
      </main>
    </div>
  );
}