import { useState } from 'react'
import { Plus, Building2, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LocationsOverview } from './LocationsOverview'
import { LocationFormDrawer } from './drawers/LocationFormDrawer'
import { FieldOfficeFormDrawer } from './drawers/FieldOfficeFormDrawer'
import { LocationHierarchyManager } from './drawers/LocationHierarchyManager'
import {
  useFieldOffices,
  useFieldOfficeSummaries,
  useLocations,
} from '../hooks/useLocations'
import { useDeleteLocation, useSaveLocation } from '../hooks/useLocationMutations'
import type { FieldOfficeConfig, LocationNode } from '../types'

export function LocationsView() {
  const { data: fieldOffices = [], isLoading: officesLoading } = useFieldOffices()
  const { data: summaries = [], isLoading: summariesLoading } = useFieldOfficeSummaries()
  const { data: locations = [], isLoading: locationsLoading } = useLocations()

  const saveLocation = useSaveLocation()
  const deleteLocation = useDeleteLocation()

  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<LocationNode | null>(null)
  const [fieldOfficeDrawerOpen, setFieldOfficeDrawerOpen] = useState(false)
  const [hierarchyManagerOpen, setHierarchyManagerOpen] = useState(false)
  const [hierarchyReadOnly, setHierarchyReadOnly] = useState(false)
  const [selectedOfficeForHierarchy, setSelectedOfficeForHierarchy] = useState<FieldOfficeConfig | null>(null)
  const [detailView, setDetailView] = useState(false)
  const [viewingFieldOfficeId, setViewingFieldOfficeId] = useState<string | null>(null)

  const isLoading = officesLoading || summariesLoading || locationsLoading

  const handleAddLocation = () => {
    if (viewingFieldOfficeId && detailView) {
      const office = fieldOffices.find((fo) => fo.id === viewingFieldOfficeId)
      if (office) {
        setSelectedOfficeForHierarchy(office)
        setHierarchyReadOnly(false)
        setHierarchyManagerOpen(true)
        return
      }
    }
    setEditingLocation(null)
    setFormDrawerOpen(true)
  }

  const handleSaveLocation = (location: LocationNode) => {
    saveLocation.mutate(location)
  }

  const handleDeleteLocation = (location: LocationNode) => {
    deleteLocation.mutate(location.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Loading locations…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {!detailView && (
        <div className="flex items-center justify-end flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Import feature coming soon!')}>
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Export feature coming soon!')}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={() => setFieldOfficeDrawerOpen(true)}>
            <Building2 className="w-4 h-4" /> Manage Field Offices
          </Button>
          <Button className="gap-1.5 bg-[#121321] hover:bg-[#1e2035] text-white" onClick={handleAddLocation}>
            <Plus className="w-4 h-4" /> Add Location
          </Button>
        </div>
      )}

      <LocationsOverview
        locations={locations}
        fieldOffices={fieldOffices}
        summaries={summaries}
        viewingFieldOfficeId={viewingFieldOfficeId}
        detailView={detailView}
        onFieldOfficeDetail={(id) => {
          setViewingFieldOfficeId(id)
          setDetailView(true)
        }}
        onBackToOverview={() => {
          setDetailView(false)
          setViewingFieldOfficeId(null)
        }}
        onManageHierarchy={(office) => {
          setSelectedOfficeForHierarchy(office)
          setHierarchyReadOnly(false)
          setHierarchyManagerOpen(true)
        }}
        onViewHierarchy={(office) => {
          setSelectedOfficeForHierarchy(office)
          setHierarchyReadOnly(true)
          setHierarchyManagerOpen(true)
        }}
        onEditLocation={(loc) => {
          setEditingLocation(loc)
          setFormDrawerOpen(true)
        }}
        onDeleteLocation={handleDeleteLocation}
      />

      <LocationFormDrawer
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        fieldOffices={fieldOffices}
        editingLocation={editingLocation}
      />

      {selectedOfficeForHierarchy && (
        <LocationHierarchyManager
          open={hierarchyManagerOpen}
          onOpenChange={setHierarchyManagerOpen}
          selectedOffice={selectedOfficeForHierarchy}
          fieldOffices={fieldOffices}
          locations={locations}
          onSaveLocation={handleSaveLocation}
          onDeleteLocation={handleDeleteLocation}
          readOnly={hierarchyReadOnly}
        />
      )}

      <FieldOfficeFormDrawer
        open={fieldOfficeDrawerOpen}
        onOpenChange={setFieldOfficeDrawerOpen}
      />
    </div>
  )
}
