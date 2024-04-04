import dayjs from "dayjs"
import 'dayjs/locale/pt-br'
import relativeTime from "dayjs/plugin/relativeTime"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react"
import { IconButton } from "./icon-button"
import { Table } from "./table/table"
import { TableHeader } from "./table/table-header"
import { TableCell } from "./table/table-cell"
import { TableRow } from "./table/table-row"
import { ChangeEvent, useEffect, useState } from "react"

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  checkedInAt: string | null,
}

export function AttendeeList() {

  const [searchInputValue, setSearchInputValue] = useState(() => {
    const url = new URL(window.location.toString());
    
    if (url.searchParams.has("search")) {
      return url.searchParams.get("search") ?? "";
    }

    return "";
  });
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());
    
    if (url.searchParams.has("page")) {
      return Number(url.searchParams.get("page"));
    }

    return 1;
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const url = new URL('http://localhost:8080/events/attendees/fa629440-f5bf-4c3e-9a38-fb705fa7869e');

    url.searchParams.set('pageIndex', String(page - 1));

    if (searchInputValue.length > 0) {
      url.searchParams.set('query', searchInputValue);
    }

    fetch(url)
    .then(response => response.json())
    .then(data => {
      setAttendees(data.attendees);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    })
  }, [page, searchInputValue]);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());

    url.searchParams.set('page', String(page));

    window.history.pushState({}, "", url);

    setPage(page);
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());

    url.searchParams.set('search', search);

    window.history.pushState({}, "", url);

    setSearchInputValue(search);
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value);
    setPage(1);
  }
  
  function goToPreviousPage() {
    setCurrentPage(page - 1);
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(totalPages);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input 
            onChange={onSearchInputChanged}
            value={searchInputValue}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Buscar participante..."
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10" />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id}>
                <TableCell>
                  <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10" />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt 
                    ? dayjs().to(attendee.checkedInAt) 
                    : <span className="text-zinc-400">Não fez check-in</span>}
                  </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {totalItems} items
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>Página {page} de {totalPages}</span>

                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={isFirstPage}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={isFirstPage}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToNextPage} disabled={isLastPage}>
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={isLastPage}>
                    <ChevronsRight className="size-4" />
                  </IconButton>
              </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
} 