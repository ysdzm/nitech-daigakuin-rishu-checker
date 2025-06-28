'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


type ClassSchedule = {
  id: number;
  講義名: string;
  クォーター: string;
  曜日: string;
  時間: string;
  科目区分: string;
  ファイル名: string;
};

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: '講義名', headerName: '講義名', width: 300 },
  { field: 'クォーター', headerName: 'クォーター', width: 130 },
  { field: '曜日', headerName: '曜日', width: 90 },
  { field: '時間', headerName: '時間', width: 90 },
  { field: '科目区分', headerName: '科目区分', width: 120 },
  {
    field: 'ファイル名',
    headerName: 'ファイル名',
    width: 100,
    renderCell: (params: any) => (
      <a
        href={`https://syllabus.ict.nitech.ac.jp/view.php?id=${params.value}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {params.value}
      </a>
    ),
  },
];

export default function MyTable() {
  const [data, setData] = useState<ClassSchedule[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        process.env.NODE_ENV === 'development'
          ? '/all_timetable_data.json'
          : 'https://ysdzm.github.io/nitech-daigakuin-rishu-checker/all_timetable_data.json';

      const response = await fetch(url);
      const jsonData: Omit<ClassSchedule, 'id'>[] = await response.json();

      const dataWithId: ClassSchedule[] = jsonData.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      setData(dataWithId);
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return <p>Loading...</p>; // or null
  }

  console.log(selectedIds);
  const filteredData = data.filter((row) => selectedIds.includes(row.id));
  console.log(filteredData);

  return (
    <Box sx={{ height: 1000, width: '100%', maxWidth: 1000, margin: 'auto', mt: 4 }}>
      <DataGrid
        rows={data}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(selection) => {
          const selected = Array.from(selection.ids).map((id) => Number(id));
          setSelectedIds(selected);
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 100, page: 0 },
          },
        }}
        pageSizeOptions={[100]}
        slots={{ toolbar: GridToolbar }}
      />
      {/* 下に選択された行だけの表 */}
      {filteredData.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>講義名</TableCell>
                <TableCell>クォーター</TableCell>
                <TableCell>曜日</TableCell>
                <TableCell>時間</TableCell>
                <TableCell>科目区分</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.講義名}</TableCell>
                  <TableCell>{row.クォーター}</TableCell>
                  <TableCell>{row.曜日}</TableCell>
                  <TableCell>{row.時間}</TableCell>
                  <TableCell>{row.科目区分}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
