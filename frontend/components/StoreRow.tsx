import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';
import { TransactionsType } from '../pages';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface StoreRowPropTypes {
    store: {
        id: number
        name: string
        owner: string
        totalBalance: number
    }
    transactionsTypes: TransactionsType[]
}


const StoreRow = ({ store, transactionsTypes }: StoreRowPropTypes) => {
    const [open, setOpen] = useState(false);
    const { data } = useSWR(() => open ? `api/stores/${store.id}/transactions` : null, fetcher);

    const getTransactionTypeFieldById = (transactionTypeId: number, field: keyof TransactionsType) =>
        transactionsTypes.find(tt => tt.id === transactionTypeId)![field]

    const transactionsColumns: GridColDef[] = [
        {
            field: "id",
            flex: 0.3,
        },
        {
            field: "date",
            flex: 1.5,
        },
        {
            field: "description",
            flex: 1,
            valueGetter: val => getTransactionTypeFieldById(val.row.transactionTypeId, 'description')
        },
        {
            field: "value",
            flex: 1,
        },
        {
            field: "CPF",
            flex: 1,
        },
        {
            field: "card",
            flex: 1,
        },
        {
            field: "entryNature",
            flex: 1,
            valueGetter: val => getTransactionTypeFieldById(val.row.transactionTypeId, 'entryNature')
        },
    ];

    return (
        <>
            <TableRow sx={{ '&& > *': { borderBottom: 'unset' } }} >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.owner}</TableCell>
                <TableCell>{store.totalBalance}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {data &&
                            <DataGrid
                                columns={transactionsColumns}
                                rows={data}
                                autoHeight
                                sx={{ mb: 3 }}
                            />
                        }
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export { StoreRow };
