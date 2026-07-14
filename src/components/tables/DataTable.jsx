import React, { useState, useMemo } from 'react';
import { 
  FiChevronLeft, FiChevronRight, FiSearch, FiSliders, 
  FiArrowUp, FiArrowDown, FiDownload 
} from 'react-icons/fi';
import Button from '../ui/Button';

export default function DataTable({
  columns,
  data,
  searchPlaceholder = "Search rows...",
  enableSearch = true,
  enablePagination = true,
  defaultSortField = '',
  defaultSortAsc = true,
  pageSize = 5,
  actions,
  exportFileName = 'table_export'
}) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortAsc, setSortAsc] = useState(defaultSortAsc);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // Process rows
  const processedRows = useMemo(() => {
    let result = [...data];

    // Search filter
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(row => {
        return columns.some(col => {
          const val = row[col.accessor];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        // Handle numbers
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }

        // Handle strings
        valA = valA ? String(valA).toLowerCase() : '';
        valB = valB ? String(valB).toLowerCase() : '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortField, sortAsc, columns]);

  // Pagination details
  const totalRows = processedRows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  
  const paginatedRows = useMemo(() => {
    if (!enablePagination) return processedRows;
    const startIndex = (currentPage - 1) * pageSize;
    return processedRows.slice(startIndex, startIndex + pageSize);
  }, [processedRows, currentPage, pageSize, enablePagination]);

  // CSV Export utility
  const exportToCSV = () => {
    const csvHeaders = columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join(',');
    const csvRows = data.map(row => {
      return columns.map(col => {
        let val = row[col.accessor];
        if (val === undefined || val === null) val = '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-3">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        {enableSearch && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 pl-9 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
            <FiSearch size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
        )}

        <div className="flex items-center gap-2 self-end">
          {actions && <div className="flex items-center gap-2">{actions}</div>}
          <Button variant="secondary" size="sm" onClick={exportToCSV} title="Export CSV Data">
            <FiDownload size={14} className="mr-1.5" /> CSV
          </Button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-850 rounded-2xl bg-white dark:bg-slate-950/20 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 select-none">
              {columns.map(col => (
                <th
                  key={col.accessor}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={`p-3 font-bold text-slate-750 dark:text-slate-350 ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && sortField === col.accessor && (
                      sortAsc ? <FiArrowUp size={12} className="text-brand-blue" /> : <FiArrowDown size={12} className="text-brand-blue" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-950/20">
                  No records matching your search queries found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors last:border-0"
                >
                  {columns.map(col => (
                    <td key={col.accessor} className={`p-3 text-slate-700 dark:text-slate-300 ${col.cellClassName || ''}`}>
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
        <div className="flex items-center justify-between pt-2 no-print text-[11px] text-slate-400">
          <div>
            Showing <strong className="text-slate-700 dark:text-slate-350">
              {Math.min(totalRows, (currentPage - 1) * pageSize + 1)}-{Math.min(totalRows, currentPage * pageSize)}
            </strong> of <strong className="text-slate-700 dark:text-slate-350">{totalRows}</strong> items
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FiChevronLeft size={14} />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
