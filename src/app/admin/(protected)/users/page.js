'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/auth/useAuth';
import { getAuthenticatedApi } from '@/utils/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiSearch, FiFilter, FiUserX, FiUserCheck, FiMail, FiUser, FiEdit2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useDebounce } from 'use-debounce';

// User Row Component
const UserRow = ({ user, index }) => (
  <motion.tr 
    className="hover:bg-gray-50 border-b border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <td className="px-4 py-3 sm:px-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-medium text-indigo-800">
          {user.first_name?.charAt(0) || user.username.charAt(0)}
        </div>
        <div className="ml-4">
          <div className="font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </div>
      </div>
    </td>
    <td className="px-4 py-3 sm:px-6 text-sm">
      <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-800 flex items-center">
        <FiMail className="mr-1" />
        {user.email}
      </a>
    </td>
    <td className="px-4 py-3 sm:px-6 text-sm text-gray-500 hidden md:table-cell">
      {format(new Date(user.date_joined), 'MMM d, yyyy')}
    </td>
    <td className="px-4 py-3 sm:px-6">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        user.is_active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {user.is_active ? 'Active' : 'Inactive'}
      </span>
    </td>
    <td className="px-4 py-3 sm:px-6 text-right">
      <a 
        href={`${process.env.NEXT_PUBLIC_DJANGO_ADMIN_URL || 'http://127.0.0.1:8000/admin'}/auth/user/${user.id}/change/`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm"
      >
        <FiEdit2 className="mr-1" /> Manage
      </a>
    </td>
  </motion.tr>
);

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 animate-pulse">
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-full w-10 h-10"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="space-x-4 flex">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Status Filter Dropdown
const StatusFilter = ({ statusFilter, setStatusFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    { value: 'all', label: 'All Statuses', icon: <FiFilter className="mr-2" /> },
    { value: 'active', label: 'Active Users', icon: <FiUserCheck className="mr-2 text-green-600" /> },
    { value: 'inactive', label: 'Inactive Users', icon: <FiUserX className="mr-2 text-red-600" /> }
  ];
  
  const selectedOption = options.find(opt => opt.value === statusFilter) || options[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <div className="flex items-center">
          {selectedOption.icon}
          {selectedOption.label}
        </div>
        {isOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    statusFilter === option.value
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdminUsersPage() {
  const { authTokens, setAuthTokens, logoutUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    if (!authTokens) return;
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (statusFilter === 'active') params.append('is_active', 'true');
    if (statusFilter === 'inactive') params.append('is_active', 'false');

    try {
      const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
      const data = await api(`/admin/users/all/?${params.toString()}`);
      setUsers(data);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authTokens, setAuthTokens, logoutUser, debouncedSearch, statusFilter]);

  const fetchUserStats = useCallback(async () => {
    if(!authTokens) return;
    try {
        const api = getAuthenticatedApi({ authTokens, setAuthTokens, logoutUser });
        // Fetch all users without filters just to get stats
        const allUsers = await api('/admin/users/all/');
        setTotalUsers(allUsers.length);
        setActiveUsers(allUsers.filter(u => u.is_active).length);
    } catch(err) {
        console.error("Failed to fetch user stats", err);
    }
  }, [authTokens, setAuthTokens, logoutUser]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Stats for the header
  const userStats = useMemo(() => {
    const active = activeUsers;
    const total = totalUsers;
    return {
      total,
      active,
      inactive: total - active,
      activePercentage: total ? Math.round((active / total) * 100) : 0
    };
  }, [totalUsers, activeUsers]);

  return (
    <div className="pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">
            {userStats.total} users · {userStats.activePercentage}% active
          </p>
        </div>
        
        <div className="flex items-center">
          <Link 
            href={`${process.env.NEXT_PUBLIC_DJANGO_ADMIN_URL || 'http://127.0.0.1:8000/admin'}/auth/user/add/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FiUser className="mr-2" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg">
              <FiUser className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-xl font-bold text-gray-900">{userStats.total}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-800 p-2 rounded-lg">
              <FiUserCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <h3 className="text-xl font-bold text-gray-900">{userStats.active}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-red-100 text-red-800 p-2 rounded-lg">
              <FiUserX className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inactive Users</p>
              <h3 className="text-xl font-bold text-gray-900">{userStats.inactive}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email or username..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <StatusFilter 
              statusFilter={statusFilter} 
              setStatusFilter={setStatusFilter} 
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {users.length > 0 ? (
              users.map((user, index) => (
                <motion.div 
                  key={user.id}
                  className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-medium text-indigo-800">
                        {user.first_name?.charAt(0) || user.username.charAt(0)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">@{user.username}</div>
                        <a 
                          href={`mailto:${user.email}`} 
                          className="text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                        >
                          <FiMail className="mr-1" />
                          {user.email}
                        </a>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            Joined {format(new Date(user.date_joined), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-end">
                    <a 
                      href={`${process.env.NEXT_PUBLIC_DJANGO_ADMIN_URL || 'http://127.0.0.1:8000/admin'}/auth/user/${user.id}/change/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                    >
                      <FiEdit2 className="mr-1" /> Manage
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiUserX className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">User</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Contact</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 hidden md:table-cell">Joined</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Status</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <UserRow key={user.id} user={user} index={index} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiUserX className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                          <p className="text-gray-500 max-w-md">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}