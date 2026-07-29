import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import DataTable from '../components/tables/DataTable';
import FormTextarea from '../components/forms/FormTextarea';
import Button from '../components/ui/Button';
import { FiPlus, FiTrash2, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

export default function Page7Tracker() {
  const { activeBooklet, updateBookletPage } = useBooklet();

  if (!activeBooklet) return null;

  const pageData = activeBooklet.page7 || {
    rows: [],
    monthlyNotes: '',
    supportNotes: ''
  };

  const handleRowChange = (id, field, value) => {
    const updatedRows = pageData.rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    updateBookletPage('page7', { rows: updatedRows });
  };

  const handleNumericRowChange = (id, field, value) => {
    const num = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(num)) {
      handleRowChange(id, field, num);
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: `track-${uuidv4()}`,
      date: new Date().toISOString().split('T')[0],
      host: '',
      location: '',
      coordinator: '',
      attendance: 0,
      outcome: '',
      remarks: '',
      status: 'Pending'
    };
    updateBookletPage('page7', { rows: [...pageData.rows, newRow] });
  };

  const handleDeleteRow = (id) => {
    const updatedRows = pageData.rows.filter(row => row.id !== id);
    updateBookletPage('page7', { rows: updatedRows });
  };

  const handleTextareaChange = (field, value) => {
    updateBookletPage('page7', { [field]: value });
  };

  const handleClear = () => {
    if (confirm("Wipe tracker database?")) {
      updateBookletPage('page7', {
        rows: [
          { id: `track-${uuidv4()}`, date: new Date().toISOString().split('T')[0], host: "", location: "", coordinator: "", attendance: 0, outcome: "", remarks: "", status: "Pending" }
        ],
        monthlyNotes: '',
        supportNotes: ''
      });
    }
  };

  // Reusable columns definition for DataTable
  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
      cell: (row) => (
        <input
          type="date"
          value={row.date || ''}
          onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
          className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
        />
      )
    },
    {
      header: 'Host Organization',
      accessor: 'host',
      sortable: true,
      cell: (row) => (
        <input
          type="text"
          value={row.host || ''}
          onChange={(e) => handleRowChange(row.id, 'host', e.target.value)}
          placeholder="e.g. Corp Alpha"
          className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none font-bold text-[#772432] dark:text-[#f2a900]"
        />
      )
    },
    {
      header: 'Location / Platform',
      accessor: 'location',
      sortable: true,
      cell: (row) => (
        <input
          type="text"
          value={row.location || ''}
          onChange={(e) => handleRowChange(row.id, 'location', e.target.value)}
          placeholder="Zoom/Office"
          className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
        />
      )
    },
    {
      header: 'Coordinator',
      accessor: 'coordinator',
      sortable: true,
      cell: (row) => (
        <input
          type="text"
          value={row.coordinator || ''}
          onChange={(e) => handleRowChange(row.id, 'coordinator', e.target.value)}
          placeholder="Name"
          className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
        />
      )
    },
    {
      header: 'Attendance',
      accessor: 'attendance',
      sortable: true,
      cell: (row) => (
        <input
          type="number"
          value={row.attendance || 0}
          onChange={(e) => handleNumericRowChange(row.id, 'attendance', e.target.value)}
          className="w-16 bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-right font-mono text-slate-800 dark:text-slate-200"
        />
      )
    },
    {
      header: 'Outcome',
      accessor: 'outcome',
      sortable: true,
      cell: (row) => (
        <input
          type="text"
          value={row.outcome || ''}
          onChange={(e) => handleRowChange(row.id, 'outcome', e.target.value)}
          placeholder="Outcome remarks"
          className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
        />
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <select
          value={row.status || 'Pending'}
          onChange={(e) => handleRowChange(row.id, 'status', e.target.value)}
          className="bg-transparent border-0 border-b border-transparent focus:outline-none focus:border-[#772432] cursor-pointer text-[#772432] dark:text-[#f2a900] font-bold"
        >
          <option value="Pending" className="dark:bg-slate-950">Pending</option>
          <option value="In Progress" className="dark:bg-slate-950">In Progress</option>
          <option value="Completed" className="dark:bg-slate-950">Completed</option>
        </select>
      )
    },
    {
      header: 'Action',
      accessor: 'id',
      sortable: false,
      cellClassName: 'text-center w-10',
      cell: (row) => (
        <button
          onClick={() => handleDeleteRow(row.id)}
          title="Delete log row"
          className="p-1 text-slate-400 hover:text-red-600 hover:bg-[#faf5ef] dark:hover:bg-slate-900 rounded-lg transition-colors no-print cursor-pointer"
        >
          <FiTrash2 size={13} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Booklet Tracker Sheet */}
      <div className="booklet-page">
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-[#e8ddd0] dark:border-slate-800 pb-3 flex justify-between items-center no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-[#772432] dark:text-white">
                  Meeting Tracker Sheet
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Maintain a central outreach history ledger and log escalation notes.
                </p>
              </div>
              <button 
                onClick={handleClear}
                className="px-3 py-1 bg-[#faf5ef] dark:bg-slate-900 text-[#772432] dark:text-rose-200 hover:bg-[#772432] hover:text-white border border-[#e8ddd0] dark:border-slate-800 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
              >
                Clear Page
              </button>
            </div>

            {/* Print Header */}
            <div className="hidden print:block pb-2 border-b-2 border-[#772432]">
              <h2 className="text-xl font-bold text-[#772432]">Meeting Tracker Sheet</h2>
              <p className="text-xs text-slate-650">District 228 Centralized Corporate Leads Tracker</p>
            </div>

            {/* Reusable Data Table Wrapper */}
            <DataTable
              columns={columns}
              data={pageData.rows}
              exportFileName="district_228_meeting_tracker"
              searchPlaceholder="Filter leads, Hosts or outcomes..."
              pageSize={6}
              actions={
                <Button variant="primary" size="sm" onClick={handleAddRow} className="no-print">
                  <FiPlus size={14} className="mr-1.5" /> Add Log Entry
                </Button>
              }
            />

            {/* Bottom grids: Notes Escalations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <FormTextarea
                label="Monthly Review Notes"
                id="monthlyNotes"
                value={pageData.monthlyNotes || ''}
                onChange={(e) => handleTextareaChange('monthlyNotes', e.target.value)}
                placeholder="Log cumulative stats, conversion summaries, and monthly outreach metrics..."
                rows={4}
              />
              <FormTextarea
                label="Support / Escalation Notes"
                id="supportNotes"
                value={pageData.supportNotes || ''}
                onChange={(e) => handleTextareaChange('supportNotes', e.target.value)}
                placeholder="Log assistance requested from Area/Division directors, pricing approvals..."
                rows={4}
              />
            </div>

          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 7 Tracker
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
