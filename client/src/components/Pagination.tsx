import React from 'react';
import Button from './ui/Button';
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
                <Button variant="secondary" className={Styles.pageButton}>
                  1
                </Button>
              </a>
            </li>
            <span className={Styles.dots}>...</span>
          </>
        )}

        {pagesToRender.map((number) => (
          <li key={number} className={Styles.pageItem}>
            <a href={getPageUrl(number)} className={Styles.pageLink}>
              <Button
                variant={number === currentPage ? 'primary' : 'secondary'}
                className={Styles.pageButton}
              >
                {number}
              </Button>
            </a>
          </li>
        ))}

        {showEndDots && (
          <>
            <span className={Styles.dots}>...</span>
            <li className={Styles.pageItem}>
              <a href={getPageUrl(numberOfPages)} className={Styles.pageLink}>
                <Button variant="secondary" className={Styles.pageButton}>
                  {numberOfPages}
                </Button>
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
