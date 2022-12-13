import React, { useState, useEffect, useMemo } from "react";
import { useTable, usePagination } from "react-table";

function AllCoinsTable() {
  const [allCoins, setAllCoins] = useState([]);
  const currency = "usd";
  const per_page = 1000;
  const [isLoading, setIsLoading] = useState(false);

  const fetchCoins = () => {
    setIsLoading(true);
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&per_page=${per_page}`)
      .then (res => res.json())
      .then(data => {
        setIsLoading(false)
        setAllCoins(data)
      })
      .catch(error => console.log(error.message));
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const columnsI = [];
  
  function createColumns() {
    const columnKeys = allCoins.flatMap(Object.keys);
    const uniqColumnKeys = Array.from(new Set(columnKeys));

    for (let i = 0; i < uniqColumnKeys.length; i++) {
      const headings = {};

      if ( uniqColumnKeys[i].includes("id") || uniqColumnKeys[i].includes("rank") || uniqColumnKeys[i].includes("roi")) { 
        continue; 
      }

      let value = uniqColumnKeys[i].replaceAll("_", " ");
    
      headings["Header"] = value.toLowerCase()
        .split(' ')
        .map((el) => el.charAt(0).toUpperCase() + el.substring(1))
        .join(' ');
      
      headings["accessor"] = uniqColumnKeys[i];
      
      if (uniqColumnKeys[i].includes("symbol")) {
        headings["Cell"] = ({ cell: { value } }) => value.toUpperCase();
      };

      if (uniqColumnKeys[i].includes("image")) {
        headings["Cell"] = ({ cell: { value } }) => (
          <img
            className="h-8 sm:h-6 w-8 sm:h-6 rounded-full"
            alt=""
            src={value}
          />
        )  
      };

      if (uniqColumnKeys[i].includes("date")) {
        headings["Cell"] = ({ cell: { value } }) => {
          const date = new Date(value);
          return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            timeZoneName:'short',
          }).format(date);
        }
      };
      
      if ( uniqColumnKeys[i].includes("percentage")) {
        headings["Cell"] = ({ cell: { value } }) => {
          return new Intl.NumberFormat('en-US', { 
            maximumSignificantDigits: 21, 
            roundingPriority: 'lessPrecision',
            style: 'percent', 
          }).format(value);
        }
      };
                                                                                                                                                                                                                      
      if ( uniqColumnKeys[i] === "current_price" || uniqColumnKeys[i] === "price_change_24h"|| uniqColumnKeys[i] === "market_cap" || uniqColumnKeys[i] === "market_cap_change_24h" || uniqColumnKeys[i] === "low_24h" || uniqColumnKeys[i] === "high_24h" || uniqColumnKeys[i] === "fully_diluted_valuation" || uniqColumnKeys[i] === "atl" || uniqColumnKeys[i] === "ath" ) {
        headings["Cell"] = ({ cell: { value } }) => new Intl.NumberFormat('en-US', { 
          maximumSignificantDigits: 21, 
          style: 'currency', 
          currency: 'USD',
          currencySign: 'accounting',
        }).format(value);
      };
     
      if ( uniqColumnKeys[i] === "total_volume" || uniqColumnKeys[i] === "total_supply"|| uniqColumnKeys[i] === "max_supply" || uniqColumnKeys[i] === "circulating_supply" ) {
        headings["Cell"] = ({ cell: { value } }) => new Intl.NumberFormat('en-US').format(value);
      };

      columnsI.push(headings);
    }
  };

  createColumns();

  // eslint-disable-next-line  
  const columns = useMemo(() => columnsI, [allCoins]);  
  
  const tableInstance = useTable({
    columns: columns,
    data: allCoins
  }, usePagination);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    prepareRow
  } = tableInstance;

  const { pageIndex } = state;

  const ProgressBar = ({ progressPercentage }) => {
    return (
      <div className='h-1 w-full bg-gray-300'>
        <div
          style={{ width: `${progressPercentage}%`}}
          className={`h-full ${
              progressPercentage < 70 ? 'bg-red-600' : 'bg-green-600'}`}>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-2 flex flex-col">
        {isLoading && <ProgressBar />}
        <div className="py-2 align-middle inline-block min-w-full xs:px-4 sm:px-6 lg:px-8">
          <div className="shadow overflow-auto t-2 sm:rounded-lg"></div>
            <table 
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50 border-2 border-gray-200 hover:bg-blue-100">
                {
                  headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        headerGroup.headers.map( column => (
                          <th
                            scope="col"
                            className="group px-6 py-2 text-center text-sm sm: text-xs font-semibold font-medium text-gray-600 tracking-wider" 
                            {...column.getHeaderProps()}>{column.render('Header')}
                          </th>
                        ))
                      }
                    </tr>
                  ))
                }
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {page.map((row) => {
                  prepareRow(row)
                  return (
                    <tr 
                      className="odd:bg-white-100 even:bg-gray-50 border hover:bg-blue-100"
                      {...row.getRowProps()}
                    >
                      {
                        row.cells.map( cell => {
                          return <td 
                                  className="px-6 py-2 whitespace-nowrap text-center text-sm sm: text-xs font-sm text-gray-700"
                                    {...cell.getCellProps()}>{cell.render('Cell')}
                                  </td>
                        })
                      }
                    </tr>
                  )
                })}
              </tbody>
          </table>
          <div className="flex flex-col items-center max-w-md mx-auto bg-white overflow-hidden md:max-w-2xl mt-4 mb-4">
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Page{' '}
              <span class="font-semibold text-gray-900 dark:text-white">
                {pageIndex + 1} of {pageOptions.length}
              </span>{' '}
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
              <button 
                className="px-4 py-2 text-sm xs: text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" 
                onClick={() => previousPage()} 
                disabled={!canPreviousPage}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 text-sm xs: text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" 
                onClick={() => nextPage()} 
                disabled={!canNextPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </> 
  );
};

export default AllCoinsTable;