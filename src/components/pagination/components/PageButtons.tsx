import cs from 'classnames';
import { ReactNode } from 'react';
import { PAGINATION_SIZE_CLASSES, type PaginationSize } from '../pagination-styles';

interface IProps {
  currentPage: number;
  totalResults: number;
  perPage: number;
  onClick: (page: number) => void;
  size: PaginationSize;
}

function PageButtons(props: IProps) {
  const { currentPage, totalResults, perPage, onClick, size } = props;
  const pages = Math.max(1, Math.ceil(totalResults / perPage));
  const sizeClasses = PAGINATION_SIZE_CLASSES[size];
  let pagesAfter = (pages - currentPage) > 2 ? 2 : (pages - currentPage);
  let pagesBefore = currentPage > 2 ? 2 : currentPage === 2 ? 1 : 0;
  let buttonsBefore: ReactNode[] = [];
  let buttonsAfter: ReactNode[] = [];

  for (let i = 1; i <= pagesBefore; i++) {
    const page = currentPage - i;
    buttonsBefore = [
      <button
        key={`page-${page}`}
        type='button'
        aria-label={`Página ${page}`}
        className={cs(sizeClasses.itemHeight, 'flex', sizeClasses.pageWidth, 'items-center justify-center rounded border border-border-default',
          'cursor-pointer bg-surface-card', sizeClasses.text, 'text-content-primary hover:bg-surface-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring')}
        onClick={() => onClick(page)}>
        {page}
      </button>,
      ...buttonsBefore
    ];
  }

  for (let i = 1; i <= pagesAfter; i++) {
    const page = currentPage + i;
    buttonsAfter.push(
      <button
        key={`page-${page}`}
        type='button'
        aria-label={`Página ${page}`}
        className={cs(sizeClasses.itemHeight, 'flex', sizeClasses.pageWidth, 'items-center justify-center rounded border border-border-default',
          'cursor-pointer bg-surface-card', sizeClasses.text, 'text-content-primary hover:bg-surface-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring')}
        onClick={() => onClick(page)}>
        {page}
      </button>
    );
  }

  return [
    ...buttonsBefore,
    <button
      key={`page-${currentPage}`}
      type='button'
        aria-label={`Página ${currentPage}, atual`}
      aria-current='page'
      disabled
      className={cs(sizeClasses.itemHeight, 'flex', sizeClasses.pageWidth, 'items-center justify-center rounded border border-selection-border',
        'cursor-default bg-selection-background', sizeClasses.text, 'text-selection-content')}>
      {currentPage}
    </button>,
    ...buttonsAfter
  ];
}

export default PageButtons;

