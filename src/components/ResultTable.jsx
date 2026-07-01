import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function ResultTable({ table }) {
  if (!table || !table.rows || table.rows.length === 0) return null

  const { columns, rows } = table

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ mt: 1.5, maxHeight: 320, borderRadius: 2 }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} hover>
              {columns.map((col) => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="caption" sx={{ display: 'block', p: 1, color: 'text.secondary' }}>
        {rows.length} row{rows.length === 1 ? '' : 's'}
      </Typography>
    </TableContainer>
  )
}
