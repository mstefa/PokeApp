import React from 'react';
import Styles from './Pagination.module.css';

interface PaginationProps {
  total: number;
  currentPage: number;
  limit: number;
  currentSearch: string;
}

export default function Pagination({ total, currentPage, limit, currentSearch }: PaginationProps) {
  const numberOfPages = Math.ceil(total / limit);

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(currentSearch);
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  if (numberOfPages <= 1) return null;

  const showStartDots = currentPage > 5;
  const showEndDots = currentPage < numberOfPages - 5;
  const pagesToRender: number[] = [];

  if (numberOfPages <= 15) {
    for (let i = 1; i <= numberOfPages; i++) {
      pagesToRender.push(i);
    }
  } else {
    if (currentPage <= 5) {
      for (let i = 1; i <= 7; i++) {
        pagesToRender.push(i);
      }
    } else if (currentPage >= numberOfPages - 5) {
      for (let i = numberOfPages - 5; i <= numberOfPages; i++) {
        pagesToRender.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pagesToRender.push(i);
      }
    }
  }

  return (
    <nav className={Styles.container}>
      <ul className={Styles.pagination}>
        {showStartDots && (
          <>
            <li className={Styles.pageItem}>
              <a href={getPageUrl(1)} className={Styles.pageLink}>
                1
              </a>
            </li>
            <span style={{ padding: '0.5rem', display: 'block', color: 'var(--maincolor)' }}>...</span>
          </>
        )}

        {pagesToRender.map((number) => (
          <li
            key={number}
            className={`${Styles.pageItem} ${number === currentPage ? Styles.active : ''}`}
          >
            <a href={getPageUrl(number)} className={Styles.pageLink}>
              {number === currentPage ? <strong>{number}</strong> : number}
            </a>
          </li>
        ))}

        {showEndDots && (
          <>
            <span style={{ padding: '0.5rem', display: 'block', color: 'var(--maincolor)' }}>...</span>
            <li className={Styles.pageItem}>
              <a href={getPageUrl(numberOfPages)} className={Styles.pageLink}>
                {numberOfPages}
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
