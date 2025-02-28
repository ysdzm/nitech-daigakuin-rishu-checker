import {
    Cell,
    Header,
    Table, flexRender,
} from '@tanstack/react-table';

const ShowHeader = ({
    table,
}: {
    table: Table<any>;
}) => {
    return (
        <thead>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    )
}

const ShowBody = ({
    table,
}: {
    table: Table<any>;
}) => {
    return (
        <tbody>
            {table.getRowModel().rows.map((row, index) => {
                const tableCell = (cell: Cell<any, unknown>, cellIndex?: number) => (
                    <td key={cell.column.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                );
                return (
                    <tr
                        key={index}
                        style={{ textAlign: 'center' }}
                    >
                        <>{row.getVisibleCells().map(tableCell)}</>
                    </tr>
                );
            })}
        </tbody>
    )
}

export const ShowTable = ({
    table
}: {
    table: Table<any>;
}
) => {
    return (
        <div>
            <main>
                <table>
                    <ShowHeader table={table} />
                    <ShowBody table={table} />
                </table>
            </main>
        </div>
    );
}