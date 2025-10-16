import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Remove user data from localStorage
      localStorage.removeItem("currentUser");
      // Redirect to the login page
      navigate("/login");
    };

  return (
    <div className="bg-white sticky top-0 z-50">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-20 justify-end ">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only ">Close menu</span>
                    <RxCross2 />
                  </button>
                </div>
                <div className="flex flex-col  border-t border-gray-200 px-4 py-0">
                  <Link to={'/'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2" >Home</Link>
                  <Link to={'/users'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Users</Link>
                  <Link to={'/venues'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Venues</Link>
                  <Link to={'/services'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Brands</Link>
                  <Link to={'/offers'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Offers</Link>
                  <Link to={'/accounts'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Accounts</Link>
                  <Link to={'/cities'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Cities</Link>
                 <Link to={'/group_account'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Group Account</Link>
                 <Link to={'/vender-acc'} className="text-sm font-medium text-gray-900 hover:bg-gray-700 py-1 px-3  hover:text-white rounded mt-2">Venders</Link>
                   <button 
  onClick={handleLogout}  
  className="text-sm font-medium text-gray-900 bg-gray-200 py-2 px-4 hover:bg-gray-700 hover:text-white rounded mt-2 lg:hidden"
>
  Logout
</button>
                   </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop */}
      <header className="relative bg-white">
        <nav aria-label="Top" className="bg-gray-800 px-4 sm:px-6 lg:px-8 shadow-xl">
          <div className="">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to={'/'} className='flex'>
                  <h1 className='text-2xl font-bold text-white px-2 py-1 rounded'>Hala B Saudi</h1>
                </Link>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Link to={'/'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Home</Link>
                  <Link to={'/users'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Users</Link>
                  <Link to={'/venues'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Venues</Link>
                  <Link to={'/services'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Brands</Link>
                  <Link to={'/offers'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Offers</Link>
                  <Link to={'/accounts'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Accounts</Link>
                  <Link to={'/cities'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Cities</Link>
                  <Link to={'/group_account'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Group Account</Link>
                  <Link to={'/vender-acc'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Venders</Link>
           
                
                  {/* <Link to={'/translation'} className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline">Translation</Link> */}
                  <button onClick={handleLogout}   className="text-sm font-medium text-gray-100 hover:text-blue-500 hover:underline" >
                    Logout
                   </button> 
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};
