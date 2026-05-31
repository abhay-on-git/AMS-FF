import { useMemo, useState } from 'react'
import { ExternalLink, MapPin, Package, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AffectedAsset } from '../../types'

interface DetailAffectedAssetsCardProps {
  assets: AffectedAsset[]
  variant: 'pending' | 'compliance'
}

export function DetailAffectedAssetsCard({ assets, variant }: DetailAffectedAssetsCardProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return assets
    const q = search.toLowerCase()
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(q) ||
        asset.id.toLowerCase().includes(q) ||
        asset.tag.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q) ||
        asset.issue?.toLowerCase().includes(q),
    )
  }, [assets, search])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" />
            Affected Assets
            <Badge variant="outline">{assets.length}</Badge>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.info('Would navigate to filtered Assets view')}>
            <ExternalLink className="mr-1 h-3 w-3" />
            View in Assets
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by name, ID, tag, or location..."
            className="h-9 pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>RFID Tag</TableHead>
                <TableHead>Location</TableHead>
                {variant === 'pending' ? <TableHead>Last Scanned</TableHead> : <TableHead>Issue</TableHead>}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No assets match your search
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="text-brand-navy dark:text-brand-teal">{asset.id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{asset.tag}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {asset.location}
                      </div>
                    </TableCell>
                    {variant === 'pending' ? (
                      <TableCell className="text-muted-foreground">{asset.lastScanned ?? '—'}</TableCell>
                    ) : (
                      <TableCell className="max-w-[200px] text-muted-foreground">{asset.issue ?? '—'}</TableCell>
                    )}
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{asset.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
