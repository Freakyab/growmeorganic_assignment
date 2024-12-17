import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";

function App() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await fetch(
      "https://api.artic.edu/api/v1/artworks?page=" + currentIndex
    );
    const data = await response.json();
    return data.data;
  };

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
    });
  }, [currentIndex]);

  // Format the artist information for display
  const artistTemplate = (rowData: {
    artist_display:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | null
      | undefined;
  }) => (
    <div>
      <p>{rowData.artist_display}</p>
    </div>
  );

  // Format the title as a clickable link
  const titleTemplate = (rowData: {
    api_link: string | undefined;
    title:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | null
      | undefined;
  }) => (
    <a href={rowData.api_link} target="_blank" rel="noopener noreferrer">
      {rowData.title}
    </a>
  );

  // Display the image
  const imageBodyTemplate = (rowData: {
    image_id: string | undefined;
    title: string | undefined;
  }) => {
    return (
      <img
        src={`https://www.artic.edu/iiif/2/${rowData.image_id}/full/843,/0/default.jpg`}
        alt={rowData.title}
        className=" w-64 rounded-md"
      />
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl">Artworks Table</h1>
      <DataTable
        value={products}
        tableStyle={{ minWidth: "50rem", backgroundColor: "smokewhite" }}
        paginator
        rows={20}
        rowsPerPageOptions={[5, 10, 20]}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        selectionMode="checkbox"
        responsiveLayout="scroll">
        <Column
          selectionMode="multiple"
          className="bg-slate-200/70"
          style={{ width: "3em" }}></Column>
        {/* Define columns */}
        <Column field="id" header="Id" />
        <Column field="api_model" header="Model" />
        <Column header="Image" body={imageBodyTemplate}></Column>
        <Column
          field="title"
          header="Title"
          body={titleTemplate}
          filter
          filterPlaceholder="Search"
        />
        <Column field="artist_display" header="Artist" body={artistTemplate} />
        <Column field="date_display" header="Year" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artwork_type_title" header="Type" />
        <Column field="medium_display" header="Medium" />
        <Column field="category_titles" header="Categories" />
      </DataTable>

      {/* Pagination controls */}
      <div className="flex justify-center gap-4 items-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 1))}
          disabled={currentIndex === 1}>
          Previous
        </button>
        <span className="text-sm">Page {currentIndex}</span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setCurrentIndex((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
