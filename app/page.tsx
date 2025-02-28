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
import {
  useState,
  useEffect
} from 'react';

// テーブルデータの型を定義
type TestTable = {
  id: number;
  hoge: string;
  fuga: number;
  isActive: boolean;
}

// createColumnHelper を利用してカラム定義を作成
const columnHelper = createColumnHelper<TestTable>();

const testTableColumnDefs = [
  columnHelper.accessor((row) => row.isActive, {
    id: 'isActive',
    header: 'Active',
    cell: info => (
      <input
        type="checkbox"
        checked={info.getValue()}
        onChange={() => {
          const currentRow = info.row.original;
          currentRow.isActive = !currentRow.isActive;
        }}
      />
    ),
  }),
  columnHelper.accessor((row) => row.hoge, {
    id: 'hoge',
    header: 'hoge',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor((row) => row.fuga, {
    id: 'fuga',
    header: 'fuga',
    sortingFn: 'basic',
  }),
];

export default function Page() {
  const [data, setData] = useState<TestTable[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof TestTable>('hoge');
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    // 仮のJSONデータを読み込む
    const fetchData = async () => {
      const url = process.env.NODE_ENV === 'development'
        ? '/data.json'
        : 'https://ysdzm.github.io/nitech-daigakuin-rishu-checker/data.json';

      const response = await fetch(url);
      const jsonData: TestTable[] = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  // ソート処理
  const handleSort = (property: keyof TestTable) => {
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
  const table = useReactTable<TestTable>({
    columns: testTableColumnDefs,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: (row) => row.original.isActive,
  });

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>選択</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'hoge'}
                direction={orderBy === 'hoge' ? order : 'asc'}
                onClick={() => handleSort('hoge')}
              >
                名前
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'fuga'}
                direction={orderBy === 'fuga' ? order : 'asc'}
                onClick={() => handleSort('fuga')}
              >
                年齢
              </TableSortLabel>
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
              <TableCell>{row.hoge}</TableCell>
              <TableCell>{row.fuga}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
