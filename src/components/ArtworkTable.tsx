import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import RowSelectionOverlay from "./RowSelectionOverlay";
import type { Artwork } from "../types/artworks";

export default function ArtworkTable() {
  const [data, setData] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deselectedIds, setDeselectedIds] = useState<Set<number>>(new Set());
  const [pendingSelectionCount, setPendingSelectionCount] = useState<number>(0);

  const rowsPerPage = 12;
  const content = page*12

  async function fetchArtworks(page: number) {
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${page}`
    );
    return response.json();
  }

  useEffect(() => {
    fetchArtworks(page).then((res) => {
      setData(res.data);
      setTotalRecords(res.pagination.total);
    });
  }, [page]);

  useEffect(() => {
    if (pendingSelectionCount > 0 && data.length > 0) {
      setSelectedIds((prevSelected) => {
        const updatedSelected = new Set(prevSelected);
        let remaining = pendingSelectionCount;

        setDeselectedIds((prevDeselected) => {
          const updatedDeselected = new Set(prevDeselected);

          for (const row of data) {
            if (remaining <= 0) break;
            if (!updatedSelected.has(row.id) && !updatedDeselected.has(row.id)) {
              updatedSelected.add(row.id);
              updatedDeselected.delete(row.id);
              remaining--;
            }
          }

          setPendingSelectionCount(remaining);
          return updatedDeselected;
        });

        return updatedSelected;
      });
    }
  }, [data, pendingSelectionCount]);

  const selectedRows = data.filter(
    (row) => selectedIds.has(row.id) && !deselectedIds.has(row.id)
  );

  const handleSelectionChange = (rows: Artwork[]) => {
    const updatedSelected = new Set(selectedIds);
    const updatedDeselected = new Set(deselectedIds);

    data.forEach((row) => {
      const isSelected = rows.some((r) => r.id === row.id);

      if (isSelected) {
        updatedSelected.add(row.id);
        updatedDeselected.delete(row.id);
      } else {
        updatedSelected.delete(row.id);
        updatedDeselected.add(row.id);
      }
    });

    setSelectedIds(updatedSelected);
    setDeselectedIds(updatedDeselected);
  };

  const handleCustomSelect = (count: number) => {
    const updatedSelected = new Set(selectedIds);
    const updatedDeselected = new Set(deselectedIds);
    const availableRows = data.filter(
      (row) => !updatedSelected.has(row.id) && !updatedDeselected.has(row.id)
    );

    const rowsToSelect = Math.min(count, availableRows.length);
    availableRows.slice(0, rowsToSelect).forEach((row) => {
      updatedSelected.add(row.id);
      updatedDeselected.delete(row.id);
    });

    setSelectedIds(updatedSelected);
    setDeselectedIds(updatedDeselected);
    setPendingSelectionCount(count - rowsToSelect);
  };

   return (
    <div
      className="glass-card p-6 m-6 rounded-xl shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            className="text-3xl font-bold text-gray-900"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
          >
            🎨 Art Institute Gallery
          </h2>
          <p className="text-gray-600 mt-1">
            Explore curated artworks with persistent selection
          </p>
        </div>

        <div className="flex items-center  ">
      {selectedIds.size > 0 && (
            <span
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{
                background:
                  "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              ✅ {selectedIds.size} Selected
            </span>
          )}

          <RowSelectionOverlay onSelect={handleCustomSelect} />
    
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        value={data}
        dataKey="id"
        selection={selectedRows}
        selectionMode="checkbox"
        onSelectionChange={(e) => handleSelectionChange(e.value)}
        paginator
        lazy
        rows={rowsPerPage}
        totalRecords={totalRecords}
        first={(page - 1) * rowsPerPage}
      onPage={(e) => {
        if (e.page !== undefined) {
              setPage(e.page + 1);
  }
             }}

        stripedRows
        rowHover
        showGridlines
        scrollable
        scrollHeight="65vh"
        size="small"
        emptyMessage="🎭 No artworks found"
        className="p-datatable-sm p-datatable-gridlines"
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column
          field="title"
          header="Artwork"
          frozen
          style={{ minWidth: "18rem", fontWeight: 600 }}
        />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start" />
        <Column field="date_end" header="End" />
      </DataTable>


          <h1 className="text-gray-900 font-semibold text-sm md:text-sm lg:text-lg ">
  Showing <span className="text-indigo-600">{content - 12 + 1}</span> to 
  <span className="text-indigo-600"> {content}</span> of 
  <span className="text-indigo-600"> {totalRecords}</span> records
</h1>

    </div>
     )
}