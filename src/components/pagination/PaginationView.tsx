import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import cs from 'classnames';
import PageButtons from './components/PageButtons';
import {
  PAGINATION_SIZE_CLASSES,
  type PaginationSize,
  type PaginationVariant,
} from './pagination-styles';

export type { PaginationSize, PaginationVariant } from './pagination-styles';

export interface PaginationProps {
  currentPage: number;
  totalResults: number;
  perPage: number;
  onClick: (page: number) => void;
  size?: PaginationSize;
  variant?: PaginationVariant;
}

function PaginationView(props: PaginationProps) {
  const {
    currentPage,
    totalResults,
    perPage,
    onClick,
    size = "normal",
    variant = "default",
  } = props;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const sizeClasses = PAGINATION_SIZE_CLASSES[size];
  const controlWidth = variant === "arrows" ? sizeClasses.pageWidth : "";

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
      <div className={cs('flex items-stretch', sizeClasses.gap)}>
        {currentPage > 1 && (
          <button
            type="button"
            aria-label="Ir para a página anterior"
            className={cs(sizeClasses.itemHeight, controlWidth, sizeClasses.controlPadding, 'rounded-sm border border-border-default',
              'flex items-center justify-center gap-1 whitespace-nowrap text-content-primary', sizeClasses.text,
              'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring')}
            onClick={() => onClick(currentPage - 1)}>
            <MdChevronLeft size={size === "small" ? 9 : 10} aria-hidden="true" focusable="false" />
            {variant === "default" && "Anterior"}
          </button>
        )}
        <PageButtons
          currentPage={currentPage}
          totalResults={totalResults}
          perPage={perPage}
          onClick={onClick}
          size={size}
        />
        {currentPage < totalPages && (
          <button
            type="button"
            aria-label="Ir para a próxima página"
            className={cs(sizeClasses.itemHeight, controlWidth, sizeClasses.controlPadding, 'rounded-sm border border-border-default',
              'flex items-center justify-center gap-1 whitespace-nowrap text-content-primary', sizeClasses.text,
              'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring')}
            onClick={() => onClick(currentPage + 1)}>
            {variant === "default" && "Próxima"}
            <MdChevronRight size={size === "small" ? 9 : 10} aria-hidden="true" focusable="false" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default PaginationView;

