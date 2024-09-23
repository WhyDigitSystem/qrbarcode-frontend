import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import React, { useCallback, useMemo, useState } from 'react';

import CustomDateComponent from './CustomDateComponent.jsx';
import './TableCss.css';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const SampleTable = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: 'athlete' },
    { field: 'age' },
    {
      field: 'country',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['USA', 'Canada', 'UK', 'Australia', 'Japan'] // Replace with your dynamic list or fetch from API
      }
    },
    { field: 'year' },
    {
      field: 'date',
      minWidth: 190
    }
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      floatingFilter: true
    };
  }, []);
  const components = useMemo(() => ({ agDateInput: CustomDateComponent }), []);

  const onGridReady = useCallback(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(
          data.map((row) => {
            const dateParts = row.date.split('/');
            const date = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
            return {
              ...row,
              date
            };
          })
        );
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={'ag-theme-quartz'}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          components={components}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default SampleTable;
