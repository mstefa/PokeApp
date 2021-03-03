  
import React from 'react';
import Styles from './Pagination.module.css';


const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage}) => {
  const pageNumbers = [];
  let numberOfPages= Math.ceil(totalPosts / postsPerPage);
  currentPage ?  console.log(currentPage) : currentPage =1;

  if(numberOfPages <= 15){
    for (let i = 1; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <nav className={Styles.container}>
        <ul className={Styles.pagination}>
          {pageNumbers.map(number => (
            <li key={number} className={Styles.pageItem}>
              <span onClick={() => paginate(number)} className={Styles.pageLink}>  {/* href='!#' link to a section */}
                {number === currentPage? <strong>{number}</strong> : number }
              </span>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  

  if(currentPage <= 5){
    for (let i = 1; i <= 7; i++) {
      pageNumbers.push(i);
    }
    return (
      <nav className={Styles.container}>
        <ul className={Styles.pagination}>
          {pageNumbers.map(number => (
            <li key={number} className={Styles.pageItem}>
              <span onClick={() => paginate(number)} className={Styles.pageLink}>  
                {number === currentPage? <strong>{number}</strong> :  number }
              </span>
            </li>
          ))}
          <span>{'   '}. {' '}.{' '}. {'   '}</span>
          <li key={numberOfPages} className={Styles.pageItem}>
              <span onClick={() => paginate(numberOfPages)} className={Styles.pageLink}>  
                {numberOfPages}
              </span>
            </li>
        </ul>
      </nav>
    );
  };
  
  if(currentPage >= numberOfPages - 5 ){
    for (let i = numberOfPages - 5; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <nav className={Styles.container}>
        <ul className={Styles.pagination}>
        <li key='1' className={Styles.pageItem}>
          <span onClick={() => paginate(1)} className={Styles.pageLink}>  
            1
          </span>
        </li>
        <span>{'   '}. {' '}.{' '}. {'   '}</span>
          {pageNumbers.map(number => (
            <li key={number} className={Styles.pageItem}>
              <span onClick={() => paginate(number)} className={Styles.pageLink}>  
                {number === currentPage? <strong>{number}</strong> :  number }
              </span>
            </li>
          ))}
        </ul>
      </nav>
    );
  };


  for (let i = currentPage - 2; i <=currentPage +2; i++) {
    pageNumbers.push(i);
  }
  return (
    <nav className={Styles.container}>
      <ul className={Styles.pagination}>
      <li key='1' className={Styles.pageItem}>
        <span onClick={() => paginate(1)} className={Styles.pageLink}>  
          1
        </span>
      </li>
      <span>{'   '}. {' '}.{' '}. {'   '}</span>
        {pageNumbers.map(number => (
          <li key={number} className={Styles.pageItem}>
            <span onClick={() => paginate(number)} className={Styles.pageLink}>  
              {number === currentPage? <strong>{number}</strong> :  number }
            </span>
          </li>
        ))}
        <span>{'   '}. {' '}.{' '}. {'   '}</span>
        <li key={numberOfPages} className={Styles.pageItem}>
            <span onClick={() => paginate(numberOfPages)} className={Styles.pageLink}>  
              {numberOfPages}
            </span>
          </li>
      </ul>
    </nav>
  );
}

export default Pagination;