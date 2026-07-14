import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './ui/Button';

const PAGES = [
  '/booklet/cover',
  '/booklet/quick-reference',
  '/booklet/before-meeting',
  '/booklet/arrangements',
  '/booklet/during-meeting',
  '/booklet/outcome',
  '/booklet/tracker',
  '/booklet/data-sheet'
];

export default function PageNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = PAGES.indexOf(location.pathname);

  if (currentIndex === -1) return null;

  const prevPage = PAGES[currentIndex - 1];
  const nextPage = PAGES[currentIndex + 1];

  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 no-print">
      <div>
        {prevPage ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(prevPage)}
            className="hover:-translate-x-0.5"
          >
            <FiChevronLeft size={16} className="mr-1" /> Previous Page
          </Button>
        ) : (
          <div />
        )}
      </div>

      <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
        Page {currentIndex + 1} of 8
      </div>

      <div>
        {nextPage ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(nextPage)}
            className="hover:translate-x-0.5"
          >
            Next Page <FiChevronRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-550 border-0"
          >
            Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
