import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { 
  FiUsers, FiPhone, FiMail, FiSearch, FiPlus, 
  FiUserCheck, FiFilter, FiTrash2 
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

export default function ContactsDirectory() {
  const [contacts, setContacts] = useState([
    { id: 'm1', name: 'Pramod K Murthy', role: 'District Director', email: 'pramod@d227.org', phone: '+91 98765 43210', division: 'District 227 HQ' },
    { id: 'm2', name: 'Prashant', role: 'Division A Director', email: 'prashant@d227.org', phone: '+91 98765 43211', division: 'Division A' },
    { id: 'm3', name: 'Ankita', role: 'Program Quality Director', email: 'ankita@d227.org', phone: '+91 98765 43212', division: 'District 227 HQ' },
    { id: 'm4', name: 'Rahul', role: 'Club Growth Director', email: 'rahul@d227.org', phone: '+91 98765 43213', division: 'District 227 HQ' },
    { id: 'm5', name: 'Hari', role: 'Area 12 Director', email: 'hari@d227.org', phone: '+91 98765 43214', division: 'Area 12' },
    { id: 'm6', name: 'Anish', role: 'District PR Manager', email: 'anish@d227.org', phone: '+91 98765 43215', division: 'PR Outreach' },
    { id: 'm7', name: 'Siddharth', role: 'Finance Manager', email: 'siddharth@d227.org', phone: '+91 98765 43216', division: 'Finance' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');

  const divisions = ['All', 'District 227 HQ', 'Division A', 'Area 12', 'PR Outreach', 'Finance'];

  const handleAddContact = () => {
    const name = prompt("Enter member name:");
    if (!name || name.trim() === "") return;

    const role = prompt("Enter Toastmasters role:", "District Officer") || "District Member";
    const phone = prompt("Enter phone number:", "+91 98765 00000") || "+91 98765 00000";
    const email = prompt("Enter email address:", `${name.toLowerCase().replace(/\s+/g, '')}@d227.org`) || "officer@d227.org";

    const newContact = {
      id: `c-${uuidv4()}`,
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      email: email.trim(),
      division: 'District Member'
    };

    setContacts([newContact, ...contacts]);
    alert(`✨ Contact "${name.trim()}" added to District 227 Directory!`);
  };

  const handleDeleteContact = (id) => {
    if (confirm("Are you sure you want to remove this contact?")) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.division.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivision = selectedDivision === 'All' || c.division === selectedDivision;
    return matchesSearch && matchesDivision;
  });

  return (
    <div className="space-y-6 font-sans pb-8">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#006094] bg-[#E6F0F6] border border-[#006094]/30 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
              Official Leadership Directory
            </span>
            <h1 className="text-2xl font-montserrat font-black text-[#006094] dark:text-white mt-2 flex items-center gap-2">
              <FiUsers className="text-[#781327]" /> District 227 Members Directory
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Contact information directory of all Toastmasters District 227 officers, division heads, and outreach members.
            </p>
          </div>

          <Button 
            variant="primary" 
            size="md" 
            onClick={handleAddContact}
            className="bg-[#781327] hover:bg-[#580d1b] border-0 shrink-0 cursor-pointer font-montserrat text-white shadow-md font-extrabold"
          >
            <FiPlus className="mr-1.5" size={16} /> Add Member Contact
          </Button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search member name, role, or division..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 text-xs font-bold rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006094]"
          />
        </div>

        {/* Division Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {divisions.map(div => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold font-montserrat transition-all shrink-0 cursor-pointer ${
                selectedDivision === div 
                  ? 'bg-[#006094] text-white shadow-xs' 
                  : 'bg-white dark:bg-[#121e2d] text-slate-600 dark:text-slate-300 border border-[#e8ddd0] dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContacts.length === 0 ? (
          <div className="col-span-3 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-10 text-center text-slate-400 font-semibold space-y-2">
            <FiUsers size={32} className="mx-auto text-slate-300" />
            <p>No member contacts found in directory matching your criteria.</p>
          </div>
        ) : (
          filteredContacts.map(member => (
            <div 
              key={member.id}
              className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 hover:border-[#006094] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#006094] text-white font-montserrat font-black flex items-center justify-center text-base shadow-sm shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-montserrat font-black text-sm text-[#006094] dark:text-white">
                        {member.name}
                      </h3>
                      <span className="text-xs font-extrabold text-[#781327] dark:text-rose-400 block font-montserrat mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteContact(member.id)}
                    className="text-slate-300 hover:text-red-500 p-1 cursor-pointer"
                    title="Remove Contact"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f3ebe1] dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span className="text-slate-400">Division:</span>
                    <span className="font-extrabold text-[#006094] dark:text-sky-300">{member.division}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{member.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-semibold truncate">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate">{member.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#f3ebe1] dark:border-slate-800 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="py-2 px-3 bg-[#006094] hover:bg-[#003a5c] text-white rounded-xl text-xs font-extrabold font-montserrat transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <FiPhone size={13} /> Call Member
                </a>

                <a
                  href={`mailto:${member.email}`}
                  className="py-2 px-3 bg-[#781327] hover:bg-[#580d1b] text-white rounded-xl text-xs font-extrabold font-montserrat transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <FiMail size={13} /> Send Email
                </a>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
