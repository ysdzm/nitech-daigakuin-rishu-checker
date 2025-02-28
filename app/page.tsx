'use client';

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Checkbox
} from "@mui/material";
import { useState, useEffect } from 'react';

// テーブルデータの型を定義
type ClassSchedule = {
  id: number;
  クォーター: string;
  曜日: string;
  時間: string;
  時間割番号: string;
  科目区分: string;
  講義名: string;
  ファイル名: string;
};

// createColumnHelper を利用してカラム定義を作成
const columnHelper = createColumnHelper<ClassSchedule>();

const testTableColumnDefs = [
  columnHelper.accessor((row) => row.クォーター, {
    id: 'クォーター',
    header: 'クォーター',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor((row) => row.曜日, {
    id: '曜日',
    header: '曜日',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor((row) => row.時間, {
    id: '時間',
    header: '時間',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor((row) => row.科目区分, {
    id: '科目区分',
    header: '科目区分',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor((row) => row.講義名, {
    id: '講義名',
    header: '講義名',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor((row) => row.ファイル名, {
    id: 'ファイル名',
    header: 'ファイル名',
    sortingFn: 'alphanumeric',
  }),
];

export default function Page() {
  const [data, setData] = useState<ClassSchedule[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof ClassSchedule>('クォーター');
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    // 仮のJSONデータを読み込む
    const fetchData = async () => {
      const url = process.env.NODE_ENV === 'development'
        ? '/all_timetable_data.json'
        : 'https://ysdzm.github.io/nitech-daigakuin-rishu-checker/all_timetable_data.json';

      const response = await fetch(url);
      const jsonData: ClassSchedule[] = await response.json();
      // IDを付与
      const dataWithId = jsonData.map((item, index) => ({ ...item, id: index + 1 }));
      setData(dataWithId);
    };

    fetchData();
  }, []);

  // ソート処理
  const handleSort = (property: keyof ClassSchedule) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    const sortedRows = [...data].sort((a, b) => {
      return isAsc
        ? a[property] > b[property] ? 1 : -1
        : a[property] < b[property] ? 1 : -1;
    });
    setData(sortedRows);
  };

  // チェックボックス処理
  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // useReactTable 呼び出し
  const table = useReactTable<ClassSchedule>({
    columns: testTableColumnDefs,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>選択</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'クォーター'}
                direction={orderBy === 'クォーター' ? order : 'asc'}
                onClick={() => handleSort('クォーター')}
              >
                クォーター
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === '曜日'}
                direction={orderBy === '曜日' ? order : 'asc'}
                onClick={() => handleSort('曜日')}
              >
                曜日
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === '時間'}
                direction={orderBy === '時間' ? order : 'asc'}
                onClick={() => handleSort('時間')}
              >
                時間
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === '科目区分'}
                direction={orderBy === '科目区分' ? order : 'asc'}
                onClick={() => handleSort('科目区分')}
              >
                科目区分
              </TableSortLabel>
            </TableCell>
            <TableCell>
              講義名
            </TableCell>
            <TableCell>
              ファイル名
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(row.id)}
                  onChange={() => handleSelect(row.id)}
                />
              </TableCell>
              <TableCell>{row.クォーター}</TableCell>
              <TableCell>{row.曜日}</TableCell>
              <TableCell>{row.時間}</TableCell>
              <TableCell>{row.科目区分}</TableCell>
              <TableCell>{row.講義名}</TableCell>
              <TableCell>{row.ファイル名}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
