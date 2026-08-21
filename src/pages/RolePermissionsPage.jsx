import React from 'react';
import { useBooklet } from '../context/BookletContext';
import { 
  FiShield, FiKey, FiCheckCircle, FiXCircle, FiLock, 
  FiUserCheck, FiUsers, FiSliders
} from 'react-icons/fi';

export default function RolePermissionsPage() {
  const { currentUser } = useBooklet();

  const permissions = [
    { name: 'Create New Demo Meetings', admin: true, vpe: true, secretary: false, guest: false },
    { name: 'Edit Segment 1 (Before Meeting Setup)', admin: true, vpe: true, secretary: true, guest: false },
    { name: 'Operate Segment 2 (Live Meeting Timers)', admin: true, vpe: true, secretary: true, guest: false },
    { name: 'Access Segment 3 (Executive Report)', admin: true, vpe: true, secretary: true, guest: true },
    { name: 'Export & Import Booklet Backup JSON', admin: true, vpe: false, secretary: false, guest: false },
    { name: 'App Settings & Dark Mode Configuration', admin: true, vpe: true, secretary: true, guest: true },
    { name: 'User Role & Permissions Management', admin: true, vpe: false, secretary: false, guest: false },
    { name: 'Security & 2FA Configuration', admin: true, vpe: false, secretary: false, guest: false },
  ];

  return (
    <div className="w-full space-y-8 font-sans pb-12">
      
      {/* Header Banner - Super Large & High Impact */}
      <div className="bg-[#781327] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-white text-[#781327] flex items-center justify-center shrink-0 shadow-xl">
            <FiKey size={42} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-wider bg-white/20 text-white px-4 py-1.5 rounded-full font-montserrat">
                ADMIN ACCESS CONSOLE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black leading-tight text-white mt-2">
              District Role & Access Rights Management
            </h1>
            <p className="text-lg sm:text-xl text-rose-100 font-bold mt-2">
              View system privilege levels, role permissions, and access controls across District 227 modules.
            </p>
          </div>
        </div>
      </div>

      {/* User Current Role Summary Card */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-[#781327]/30 dark:border-rose-900 rounded-3xl p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1C4E6F] text-white font-black flex items-center justify-center text-3xl shrink-0 shadow-md">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="text-sm font-black text-[#781327] uppercase tracking-wider font-montserrat">Current Logged-in User</div>
            <h3 className="text-2xl sm:text-3xl font-montserrat font-black text-slate-900 dark:text-white mt-0.5">
              {currentUser?.name || 'System Administrator'}
            </h3>
            <div className="text-base text-slate-600 font-bold mt-1">
              Assigned Role: <span className="text-[#006094] dark:text-sky-300 font-black">{currentUser?.role || 'District Main Administrator'}</span>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-6 py-3 rounded-2xl text-base sm:text-lg font-black font-montserrat shadow-xs border border-emerald-300">
          <FiCheckCircle size={24} /> FULL UNRESTRICTED ACCESS
        </div>
      </div>

      {/* Permissions Matrix Table - Large Fonts */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
          <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-white flex items-center gap-3">
            <FiSliders size={32} className="text-[#006094]" /> District Privileges & Rights Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#e8ddd0] dark:border-slate-800 text-sm sm:text-base uppercase font-montserrat font-black text-slate-600 dark:text-slate-400">
                <th className="py-4 px-6">System Operation</th>
                <th className="py-4 px-6 text-center">Main Admin</th>
                <th className="py-4 px-6 text-center">VPE Officer</th>
                <th className="py-4 px-6 text-center">Secretary</th>
                <th className="py-4 px-6 text-center">Guest / Member</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#f3ebe1] dark:divide-slate-800 font-black">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#E6F0F6]/40 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-5 px-6 font-montserrat text-slate-900 dark:text-white text-lg sm:text-xl font-black">
                    {p.name}
                  </td>
                  <td className="py-5 px-6 text-center">
                    {p.admin ? (
                      <FiCheckCircle size={26} className="text-emerald-500 mx-auto" />
                    ) : (
                      <FiXCircle size={26} className="text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-5 px-6 text-center">
                    {p.vpe ? (
                      <FiCheckCircle size={26} className="text-emerald-500 mx-auto" />
                    ) : (
                      <FiXCircle size={26} className="text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-5 px-6 text-center">
                    {p.secretary ? (
                      <FiCheckCircle size={26} className="text-emerald-500 mx-auto" />
                    ) : (
                      <FiXCircle size={26} className="text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-5 px-6 text-center">
                    {p.guest ? (
                      <FiCheckCircle size={26} className="text-emerald-500 mx-auto" />
                    ) : (
                      <FiXCircle size={26} className="text-rose-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
