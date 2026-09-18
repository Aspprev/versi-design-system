import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import cs from 'classnames';
import PageButtons from './components/PageButtons';

export interface PaginationProps {
  currentPage: number;
  totalResults: number;
  perPage: number;
  onClick: (page: number) => void;
}

function PaginationView(props: PaginationProps) {
  const { currentPage, totalResults, perPage, onClick } = props;

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap justify-between mt-auto mb-5"
    >
      <span className="text-sm text-content-primary">
        Visualizando de {(currentPage * perPage) - (perPage - 1)}{' '}
        até {totalResults > (currentPage * perPage) ? currentPage * perPage : totalResults}{' '}
        de {totalResults} resultados
      </span>
      <div className="flex items-stretch gap-1.5">
        {currentPage > 1 && (
          <button
            type="button"
            className={cs('h-7 w-24 rounded-sm border border-border-default',
              'flex items-center justify-center gap-1 text-content-primary text-sm',
              'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring')}
            onClick={() => onClick(currentPage - 1)}>
            <MdChevronLeft size={10} aria-hidden="true" focusable="false" />
            Anterior
          </button>
        )}
        <PageButtons
          currentPage={currentPage}
          totalResults={totalResults}
          perPage={perPage}
          onClick={onClick}
        />
        {currentPage < Math.ceil((totalResults / 10)) && (
          <button
            type="button"
            className={cs('h-7 w-24 rounded-sm border border-border-default',
              'flex items-center justify-center gap-1 text-content-primary text-sm',
              'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring')}
            onClick={() => onClick(currentPage + 1)}>
            Próxima
            <MdChevronRight size={10} aria-hidden="true" focusable="false" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default PaginationView;

