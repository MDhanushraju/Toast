import React, { useState } from 'react';
import { FiArrowUp, FiArrowDown, FiDownload, FiSearch } from 'react-icons/fi';
import Button from '../ui/Button';

export default function DataTable({ 
  columns = [], 
  data = [], 
  searchPlaceholder = 'Search records...',
  exportFileName = 'district_data',
  enablePagination = true,
  pageSize = 6 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Search filter
  const filteredRows = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalRows = sortedRows.length;
  const totalPages = Math.ceil(totalRows / pageSize) || 1;
  const paginatedRows = enablePagination 
    ? sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedRows;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = data.map(r => 
      columns.map(c => {
        const val = r[c.accessor];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Search & Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-1.5 pl-9 text-xs rounded-xl bg-white dark:bg-[#0c1421] border border-[#e8ddd0] dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#006094]"
          />
          <FiSearch size={14} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="xs"
            onClick={handleExportCSV}
            disabled={data.length === 0}
            className="text-[11px] font-montserrat"
          >
            <FiDownload size={13} className="mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto border border-[#e8ddd0] dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0c1421] shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#006094] text-white border-b border-[#003a5c] select-none font-montserrat">
              {columns.map(col => (
                <th
                  key={col.accessor}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={`p-3 font-extrabold ${col.sortable !== false ? 'cursor-pointer hover:bg-[#003a5c]' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && sortField === col.accessor && (
                      sortAsc ? <FiArrowUp size={12} className="text-white" /> : <FiArrowDown size={12} className="text-white" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-slate-500 font-medium bg-[#faf5ef]/50 dark:bg-[#0c1421]">
                  No records matching your search queries found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-b border-[#e8ddd0]/60 dark:border-slate-800 hover:bg-[#faf5ef] dark:hover:bg-slate-900/50 transition-colors last:border-0"
                >
                  {columns.map(col => (
                    <td key={col.accessor} className={`p-3 text-slate-800 dark:text-slate-200 ${col.cellClassName || ''}`}>
                      {col.cell ? col.cell(row) : (row[col.accessor] !== undefined ? String(row[col.accessor]) : '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 no-print text-[11px] text-slate-500">
          <div>
            Showing <strong className="text-[#006094] dark:text-white">
              {Math.min(totalRows, (currentPage - 1) * pageSize + 1)}-{Math.min(totalRows, currentPage * pageSize)}
            </strong> of <strong className="text-[#006094] dark:text-white">{totalRows}</strong> items
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-[#e8ddd0] dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-bold text-slate-700 dark:text-slate-300">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-[#e8ddd0] dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
