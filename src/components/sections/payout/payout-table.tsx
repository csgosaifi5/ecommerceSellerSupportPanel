import Transaction from "@/models/trasaction";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Props = {
    transactions: Transaction[];
};


const PayoutTable = ({ transactions }: Props) => {
    return (
        <Table className="w-full px-2">
            <TableHeader className="bg-gray-200">
                <TableRow className="flex p-4 ">
                    <TableHead className="flex-1 h-fit">Payout Method</TableHead>
                    <TableHead className="flex-1 h-fit">Payout ID</TableHead>
                    <TableHead className="flex-[2] h-fit">Paid Amount</TableHead>
                    <TableHead className="flex-1 h-fit">Date</TableHead>
                    <TableHead className="flex-[2] h-fit">Transaction ID</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map(
                    (transaction) => (
                        <TableRow className="bg-white flex" key={transaction.id}>
                            <TableCell className="flex-1">{transaction.platform}</TableCell>
                            <TableCell className="flex-1">{transaction.id}</TableCell>
                            <TableCell className="flex-[2]">{transaction.amount}</TableCell>
                            <TableCell className="flex-1">{transaction.date}</TableCell>
                            <TableCell className="flex-[2]">{transaction.transaction_id}</TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </Table>
    );

}

export default PayoutTable;