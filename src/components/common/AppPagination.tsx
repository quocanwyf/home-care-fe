import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function AppPagination({ table }: { table: any }) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <Pagination>
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          />
        </PaginationItem>

        {Array.from({ length: pageCount }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === index}
              onClick={() => table.setPageIndex(index)}
              className={
                currentPage === index
                  ? 'bg-primary rounded-lg px-3 py-1.5 text-sm text-white'
                  : 'rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200'
              }
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => table.nextPage()}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
