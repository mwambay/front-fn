import { motion } from 'framer-motion';
import { useState } from 'react';

interface Column {
  key: string;
  header: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  pagination?: boolean;
  itemsPerPage?: number;
}

function DataTable({ 
  columns, 
  data, 
  pagination = true, 
  itemsPerPage = 10 
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = pagination ? Math.ceil(data.length / itemsPerPage) : 1;
  const paginatedData = pagination 
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
    : data;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-x-auto">
      <motion.table 
        variants={tableVariants}
        initial="hidden"
        animate="show"
        className="min-w-full divide-y divide-secondary-200"
      >
        <thead className="bg-secondary-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody 
          variants={tableVariants}
          className="bg-white divide-y divide-secondary-200"
        >
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <motion.tr 
                key={index}
                variants={rowVariants}
                className="hover:bg-secondary-50 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render 
                      ? column.render(item[column.key], item) 
                      : item[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-secondary-500"
              >
                No data available
              </td>
            </tr>
          )}
        </motion.tbody>
      </motion.table>

      {pagination && totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between px-4 py-3 bg-white border-t border-secondary-200 sm:px-6"
        >
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-secondary-700">
                Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, data.length)}
                </span>{' '}
                of <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-soft" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
                    currentPage === 1 
                      ? 'text-secondary-300 cursor-not-allowed' 
                      : 'text-secondary-500 hover:bg-secondary-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  &laquo;
                </button>
                
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === page + 1
                        ? 'bg-primary-50 text-primary-600 font-semibold'
                        : 'text-secondary-500 hover:bg-secondary-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'text-secondary-300 cursor-not-allowed' 
                      : 'text-secondary-500 hover:bg-secondary-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default DataTable;