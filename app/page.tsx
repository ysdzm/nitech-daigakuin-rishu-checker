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
      // a[property] または b[property] が存在しない場合、undefined や null を下に
      if (a[property] == null && b[property] != null) return 1; // a が null で b が有効な場合 b を優先
      if (a[property] != null && b[property] == null) return -1; // a が有効で b が null の場合 a を優先
      if (a[property] == null && b[property] == null) return 0; // 両方 null の場合は変わらない
      
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

  // チェックボックスで選択されたデータのみ表示
  const filteredData = data.filter((row) => selected.includes(row.id));

  // useReactTable 呼び出し
  const table = useReactTable<ClassSchedule>({
    columns: testTableColumnDefs,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {/* フィルタリングされていない元のデータのテーブル */}
      <h1 style={{ textAlign: "center", marginTop: "36px" }}>すべての項目を表示</h1>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 4, maxHeight: 800, overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>選択</TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === 'クォーター'}
                  direction={orderBy === 'クォーター' ? order : 'asc'}
                  onClick={() => handleSort('クォーター')}
                >
                  クォーター
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === '曜日'}
                  direction={orderBy === '曜日' ? order : 'asc'}
                  onClick={() => handleSort('曜日')}
                >
                  曜日
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === '時間'}
                  direction={orderBy === '時間' ? order : 'asc'}
                  onClick={() => handleSort('時間')}
                >
                  時間
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === '科目区分'}
                  direction={orderBy === '科目区分' ? order : 'asc'}
                  onClick={() => handleSort('科目区分')}
                >
                  科目区分
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                講義名
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                ファイル名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} sx={{ height: 40 }}>
                <TableCell sx={{ padding: '4px 8px' }}>
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
                <TableCell>
                  <a
                    href={`https://syllabus.ict.nitech.ac.jp/view.php?id=${row.ファイル名}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {row.ファイル名}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* チェックされた項目のみ表示するテーブル */}
      <h1 style={{ textAlign: "center", marginTop: "36px" }}>選択した項目のみ表示</h1>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 4 ,maxHeight: 400, overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>選択</TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === 'クォーター'}
                  direction={orderBy === 'クォーター' ? order : 'asc'}
                  onClick={() => handleSort('クォーター')}
                >
                  クォーター
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === '曜日'}
                  direction={orderBy === '曜日' ? order : 'asc'}
                  onClick={() => handleSort('曜日')}
                >
                  曜日
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === '時間'}
                  direction={orderBy === '時間' ? order : 'asc'}
                  onClick={() => handleSort('時間')}
                >
                  時間
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <TableSortLabel
                  active={orderBy === '科目区分'}
                  direction={orderBy === '科目区分' ? order : 'asc'}
                  onClick={() => handleSort('科目区分')}
                >
                  科目区分
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                講義名
              </TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                ファイル名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} sx={{ height: 40 }}>
                <TableCell sx={{ padding: '4px 8px' }}>
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
                <TableCell>
                  <a
                    href={`https://syllabus.ict.nitech.ac.jp/view.php?id=${row.ファイル名}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {row.ファイル名}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
