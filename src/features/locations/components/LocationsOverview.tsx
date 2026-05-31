import { useState } from 'react'
import {
  MapPin,
  Building,
  Package,
  Users,
  ChevronLeft,
  Pencil,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getLocationStatistics } from '../lib/hierarchyUtils'
import { TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import type { FieldOfficeConfig, FieldOfficeSummary, LocationNode } from '../types'

interface LocationsOverviewProps {
  locations: LocationNode[]
  fieldOffices: FieldOfficeConfig[]
  summaries: FieldOfficeSummary[]
  viewingFieldOfficeId: string | null
  detailView: boolean
  onFieldOfficeDetail: (id: string) => void
  onBackToOverview: () => void
  onManageHierarchy: (office: FieldOfficeConfig) => void
  onViewHierarchy: (office: FieldOfficeConfig) => void
  onEditLocation: (location: LocationNode) => void
  onDeleteLocation: (location: LocationNode) => void
}

function KpiCards({ stats }: { stats: ReturnType<typeof getLocationStatistics> }) {
  const items = [
    { label: 'Total Locations', value: stats.total, sub: `Across ${stats.maxDepth + 1} hierarchy levels`, icon: MapPin },
    { label: 'Assets Mapped', value: stats.totalAssets.toLocaleString(), sub: 'Across all locations', icon: Package },
    { label: 'Assigned Users', value: stats.totalUsers, sub: 'Location assignments', icon: Users },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(({ label, value, sub, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground font-medium">{label}</p>
                <p className="text-3xl font-bold mt-2">{value}</p>
                <p className="text-lg text-muted-foreground mt-1">{sub}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function LocationsOverview({
  locations,
  fieldOffices,
  summaries,
  viewingFieldOfficeId,
  detailView,
  onFieldOfficeDetail,
  onBackToOverview,
  onManageHierarchy,
  onViewHierarchy,
  onEditLocation,
  onDeleteLocation,
}: LocationsOverviewProps) {
  const stats = viewingFieldOfficeId
    ? getLocationStatistics(viewingFieldOfficeId, locations)
    : getLocationStatistics('all', locations)
  const fieldOffice = viewingFieldOfficeId
    ? fieldOffices.find((fo) => fo.id === viewingFieldOfficeId)
    : null
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<LocationNode | null>(null)

  const filteredLocations = viewingFieldOfficeId
    ? locations.filter((loc) => loc.fieldOfficeId === viewingFieldOfficeId)
    : locations

  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(
    filteredLocations,
    [viewingFieldOfficeId],
  )

  const getLocationTypeName = (locationTypeId: string) => {
    const type = fieldOffice?.locationTypes.find((t) => t.id === locationTypeId)
    return type?.name || 'Location'
  }

  if (detailView && fieldOffice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-base">
          <button type="button" onClick={onBackToOverview} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={onBackToOverview} className="text-muted-foreground hover:text-foreground">
            Locations
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">{fieldOffice.name}</span>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Building className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{fieldOffice.name}</h2>
                <p className="text-base text-muted-foreground mt-0.5">
                  {fieldOffice.location} • {fieldOffice.code}
                </p>
              </div>
              <Button size="lg" onClick={() => onManageHierarchy(fieldOffice)} className="gap-2 h-11 px-6">
                <Building className="w-5 h-5" />
                Manage Hierarchy
              </Button>
            </div>
          </CardContent>
        </Card>

        <KpiCards stats={stats} />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold py-4">Name</TableHead>
                    <TableHead className="font-semibold py-4">Code</TableHead>
                    <TableHead className="font-semibold py-4">Type</TableHead>
                    <TableHead className="font-semibold py-4">Level</TableHead>
                    <TableHead className="font-semibold py-4">Assets</TableHead>
                    <TableHead className="font-semibold py-4">Users</TableHead>
                    <TableHead className="w-[70px] py-4" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.length > 0 ? (
                    pageData.map((location) => (
                      <TableRow key={location.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium py-4">{location.name}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline">{location.code}</Badge>
                        </TableCell>
                        <TableCell className="py-4">{getLocationTypeName(location.locationTypeId)}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline">Level {location.level}</Badge>
                        </TableCell>
                        <TableCell className="py-4">{location.assetCount}</TableCell>
                        <TableCell className="py-4">{location.assignedUserCount}</TableCell>
                        <TableCell className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={() => onEditLocation(location)}>
                                <Pencil className="w-4 h-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setLocationToDelete(location)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                        <MapPin className="w-14 h-14 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No locations found for this field office</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                totalItems={filteredLocations.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                totalUnfilteredItems={filteredLocations.length}
                itemLabel="locations"
              />
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Location</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;{locationToDelete?.name}&rdquo;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (locationToDelete) {
                    onDeleteLocation(locationToDelete)
                    setDeleteDialogOpen(false)
                    setLocationToDelete(null)
                  }
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <KpiCards stats={stats} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Field Offices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaries.map((summary) => {
              const office = fieldOffices.find((fo) => fo.id === summary.fieldOfficeId)
              if (!office) return null
              return (
                <Card key={summary.fieldOfficeId} className="border-2 transition-all hover:shadow-md">
                  <CardContent className="p-5">
                    <button
                      type="button"
                      className="flex items-start gap-3 mb-4 w-full text-left"
                      onClick={() => onFieldOfficeDetail(office.id)}
                    >
                      <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-semibold leading-snug truncate">{summary.fieldOfficeName}</p>
                        <p className="text-lg text-muted-foreground mt-0.5 truncate">{office.location}</p>
                      </div>
                    </button>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: 'Locations', value: summary.locationCount },
                        { label: 'Assets', value: summary.assetCount },
                        { label: 'Users', value: summary.userCount },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-lg bg-muted/40 p-3 text-center">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
                          <p className="text-xl font-bold">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-10"
                        onClick={() => onViewHierarchy(office)}
                      >
                        View Details
                      </Button>
                      <Button
                        className="flex-1 h-10 bg-brand-navy text-white hover:bg-brand-navy/90"
                        onClick={() => onManageHierarchy(office)}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
