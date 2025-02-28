'use client';

import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ShowTable } from '@/components/ShowTable';
import { useState, useEffect } from 'react';

// テーブルデータの型を定義
type TestTable = {
  hoge: string;
  fuga: number;
}

// createColumnHelper を利用してカラム定義を作成
const columnHelper = createColumnHelper<TestTable>();

const testTableColumnDefs = [
  columnHelper.accessor((row) => row.hoge, {
    id: 'hoge',
    header: 'hoge',
  }),
  columnHelper.accessor((row) => row.fuga, {
    id: 'fuga',
    header: 'fuga',
  }),
];

export default function Page() {
  const [data, setData] = useState<TestTable[]>([]);

  useEffect(() => {
    // 仮のJSONデータを読み込む
    const fetchData = async () => {
      // 本番環境かローカル環境かをチェック
      const url = process.env.NODE_ENV === 'development'
        ? '/data.json' // ローカル開発環境
        : 'https://ysdzm.github.io/nitech-daigakuin-rishu-checker/data.json'; // 本番環境
  
      const response = await fetch(url);
      const jsonData: TestTable[] = await response.json();
      setData(jsonData);
    };
    
    fetchData();
  }, []);

  // useReactTable 呼び出し
  const table = useReactTable<TestTable>({
    columns: testTableColumnDefs,
    data: data,
    getCoreRowModel: getCoreRowModel(),
  });

  return <ShowTable table={table} />;
}
