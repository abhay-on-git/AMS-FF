import { useState, useEffect, useRef } from 'react'
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { LocationNode, FieldOfficeConfig } from '../../types'

interface LocationHierarchyManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOffice: FieldOfficeConfig;
  fieldOffices: FieldOfficeConfig[];
  locations: LocationNode[];
  onSaveLocation: (location: LocationNode) => void;
  onDeleteLocation: (location: LocationNode) => void;
  readOnly?: boolean;
}

interface TreeNode extends LocationNode {
  children: TreeNode[];
}

export function LocationHierarchyManager({
  open,
  onOpenChange,
  selectedOffice,
  fieldOffices,
  locations,
  onSaveLocation,
  onDeleteLocation,
  readOnly = false,
}: LocationHierarchyManagerProps) {
  const [selectedOfficeId, setSelectedOfficeId] =
    useState<string>(selectedOffice.id);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<
    Set<string>
  >(new Set());
  const [editingNodeId, setEditingNodeId] = useState<
    string | null
  >(null);
  const [editingValue, setEditingValue] = useState("");
  const [addingChildTo, setAddingChildTo] = useState<
    string | null
  >(null);
  const [newLocationName, setNewLocationName] = useState("");
  const [hoveredNodeId, setHoveredNodeId] = useState<
    string | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);

  const effectiveReadOnly = readOnly && !isEditing;
  const currentOffice =
    fieldOffices.find((fo) => fo.id === selectedOfficeId) ||
    selectedOffice;

  useEffect(() => {
    if (open) {
      setSelectedOfficeId(selectedOffice.id);
      setIsEditing(false);
    }
  }, [open, selectedOffice.id]);

  useEffect(() => {
    setExpandedNodes(new Set());
    setEditingNodeId(null);
    setAddingChildTo(null);
    setNewLocationName("");
  }, [selectedOfficeId]);

  useEffect(() => {
    if (!open) return;

    const officeLocations = locations.filter(
      (loc) => loc.fieldOfficeId === selectedOfficeId,
    );
    const nodeMap = new Map<string, TreeNode>();

    officeLocations.forEach((loc) => {
      nodeMap.set(loc.id, { ...loc, children: [] });
    });

    const roots: TreeNode[] = [];
    officeLocations.forEach((loc) => {
      const node = nodeMap.get(loc.id)!;
      if (loc.parentId && nodeMap.has(loc.parentId)) {
        nodeMap.get(loc.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const sortChildren = (node: TreeNode) => {
      node.children.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      node.children.forEach(sortChildren);
    };
    roots.forEach(sortChildren);
    roots.sort((a, b) => a.name.localeCompare(b.name));

    setTreeData(roots);

    if (expandedNodes.size === 0) {
      const allIds = new Set(
        officeLocations.map((loc) => loc.id),
      );
      setExpandedNodes(allIds);
    }
  }, [locations, selectedOfficeId, open]);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleCreateRootLocation = () => {
    if (!newLocationName.trim()) {
      toast.error("Please enter a location name");
      return;
    }

    const autoCode = newLocationName
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newLocation: LocationNode = {
      id: `loc-${Date.now()}`,
      code: autoCode,
      name: newLocationName.trim(),
      fieldOfficeId: selectedOfficeId,
      parentId: null,
      locationTypeId: "",
      level: 0,
      path: [],
      description: "",
      metadata: {},
      tags: [],
      status: "active",
      childCount: 0,
      assetCount: 0,
      assignedUserCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: "admin",
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: "admin",
    };

    onSaveLocation(newLocation)
    setNewLocationName('')
  }

  const handleAddChild = (parentNode: TreeNode) => {
    setAddingChildTo(parentNode.id);
    setEditingNodeId(null);
    if (!expandedNodes.has(parentNode.id)) {
      toggleExpand(parentNode.id);
    }
  };

  const handleSaveInlineChild = (
    parentNode: TreeNode,
    name: string,
  ) => {
    if (!name.trim()) {
      setAddingChildTo(null);
      return;
    }

    const autoCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newLocation: LocationNode = {
      id: `loc-${Date.now()}`,
      code: autoCode,
      name: name.trim(),
      fieldOfficeId: selectedOfficeId,
      parentId: parentNode.id,
      locationTypeId: "",
      level: parentNode.level + 1,
      path: [...parentNode.path, parentNode.id],
      description: "",
      metadata: {},
      tags: [],
      status: "active",
      childCount: 0,
      assetCount: 0,
      assignedUserCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: "admin",
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: "admin",
    };

    onSaveLocation(newLocation)
    setAddingChildTo(null)
  }

  const handleStartEdit = (node: TreeNode) => {
    setEditingNodeId(node.id);
    setEditingValue(node.name);
    setAddingChildTo(null);
  };

  const handleSaveEdit = (node: TreeNode) => {
    if (!editingValue.trim()) {
      toast.error("Location name cannot be empty");
      return;
    }

    const autoCode = editingValue
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const updatedLocation: LocationNode = {
      ...node,
      name: editingValue.trim(),
      code: autoCode,
      lastUpdated: new Date().toISOString().split("T")[0],
      lastUpdatedBy: "admin",
    };

    onSaveLocation(updatedLocation)
    setEditingNodeId(null)
  }

  const handleDelete = (node: TreeNode) => {
    if (node.children.length > 0) {
      toast.error(
        "Cannot delete location with children. Delete children first.",
      );
      return;
    }
    onDeleteLocation(node)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-full sm:!max-w-[1200px] flex flex-col p-0"
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl font-medium">
                {effectiveReadOnly
                  ? "Location Hierarchy"
                  : "Location Hierarchy Manager"}
              </SheetTitle>
              <p className="text-base text-muted-foreground mt-1.5">
                {effectiveReadOnly
                  ? "Viewing the location structure for this field office"
                  : "Build and manage your location structure with unlimited nesting"}
              </p>
            </div>
            {readOnly && !isEditing && (
              <Button
                variant="outline"
                className="shrink-0 gap-2 mr-8 h-10 px-4 text-base"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex">
          {/* ── LEFT PANEL — Creation Form ────────────────────────── */}
          {!effectiveReadOnly && (
            <div className="w-[420px] border-r bg-muted/30 p-6 overflow-y-auto shrink-0">
              <div className="space-y-6">
                {/* Office Context */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Adding inside
                  </p>
                  <Select
                    value={selectedOfficeId}
                    onValueChange={setSelectedOfficeId}
                  >
                    <div className="flex items-center gap-3 py-3 px-4 rounded-lg border bg-background">
                      <div className="w-11 h-11 rounded-lg bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#121321] dark:text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-base truncate">
                          {currentOffice.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {currentOffice.location}
                        </p>
                      </div>
                    </div>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {fieldOffices.map((office) => (
                        <SelectItem
                          key={office.id}
                          value={office.id}
                          className="py-3"
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-[#121321] dark:text-white" />
                            <div>
                              <p className="font-medium text-lg">
                                {office.name}
                              </p>
                              <p className="text-md text-muted-foreground">
                                {office.location} ·{" "}
                                {office.code}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Create Root Location */}
                <div className="space-y-3">
                  <div>
                    <label className="text-lg font-medium mb-2 block">
                      Location Name
                    </label>
                    <Input
                      value={newLocationName}
                      onChange={(e) =>
                        setNewLocationName(e.target.value)
                      }
                      placeholder="e.g., Building A, Parking, Gym..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleCreateRootLocation();
                      }}
                      className="h-11 text-base placeholder:text-base"
                    />
                  </div>
                  <Button
                    onClick={handleCreateRootLocation}
                    className="w-full h-11 text-base gap-2"
                    size="lg"
                  >
                    Add Location
                  </Button>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
                  <p className="text-sm font-medium text-[#121321] dark:text-blue-100 mb-3">
                    How it works
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Hover over any location to see actions",
                      'Click "+ Child" to add nested locations',
                      "Press Enter to quickly save inline edits",
                      "Build unlimited levels of nesting",
                    ].map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-2.5"
                      >
                        <span className="text-[#121321] mt-0.5 shrink-0">
                          •
                        </span>
                        <span className="text-md text-[#121321] dark:text-blue-200 leading-snug">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── RIGHT PANEL — Hierarchy Tree ─────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Panel header */}
            <div className="mb-5">
              <h3 className="text-lg font-medium mb-1">
                Live Hierarchy Preview
              </h3>
              <p className="text-md text-muted-foreground">
                {treeData.length === 0
                  ? "No locations yet — create your first location on the left"
                  : `${locations.filter((l) => l.fieldOfficeId === selectedOfficeId).length} location(s) in hierarchy`}
              </p>
            </div>

            {treeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 flex items-center justify-center mb-5">
                  <Building2 className="w-10 h-10 text-[#121321]/30 dark:text-white/30" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  No locations added yet
                </h3>
                <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
                  Create your first location using the form on
                  the left. Build any hierarchy you need!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Office Root node */}
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 border mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#121321] dark:bg-white flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-white dark:text-[#121321]" />
                  </div>
                  <span className="font-medium text-base flex-1">
                    {currentOffice.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-sm px-2.5 py-0.5"
                  >
                    Root
                  </Badge>
                </div>

                {/* Tree Nodes */}
                {treeData.map((node) => (
                  <TreeNodeComponent
                    key={node.id}
                    node={node}
                    level={0}
                    expandedNodes={expandedNodes}
                    onToggleExpand={toggleExpand}
                    onAddChild={handleAddChild}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                    editingNodeId={editingNodeId}
                    editingValue={editingValue}
                    setEditingValue={setEditingValue}
                    onSaveEdit={(onSaveEdit) =>
                      handleSaveEdit(onSaveEdit)
                    }
                    onCancelEdit={() => setEditingNodeId(null)}
                    addingChildTo={addingChildTo}
                    onSaveInlineChild={handleSaveInlineChild}
                    onCancelInline={() =>
                      setAddingChildTo(null)
                    }
                    hoveredNodeId={hoveredNodeId}
                    setHoveredNodeId={setHoveredNodeId}
                    readOnly={effectiveReadOnly}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-t bg-background px-6 py-4 flex justify-end">
          <Button
            className="h-11 px-8 text-base"
            onClick={() => onOpenChange(false)}
          >
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TREE NODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  onAddChild: (node: TreeNode) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (node: TreeNode) => void;
  editingNodeId: string | null;
  editingValue: string;
  setEditingValue: (value: string) => void;
  onSaveEdit: (node: TreeNode) => void;
  onCancelEdit: () => void;
  addingChildTo: string | null;
  onSaveInlineChild: (parent: TreeNode, name: string) => void;
  onCancelInline: () => void;
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
  readOnly?: boolean;
}

function TreeNodeComponent({
  node,
  level,
  expandedNodes,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
  editingNodeId,
  editingValue,
  setEditingValue,
  onSaveEdit,
  onCancelEdit,
  addingChildTo,
  onSaveInlineChild,
  onCancelInline,
  hoveredNodeId,
  setHoveredNodeId,
  readOnly = false,
}: TreeNodeComponentProps) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children.length > 0;
  const isEditing = editingNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  const [inlineChildValue, setInlineChildValue] = useState("");
  const inlineInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingChildTo === node.id) {
      inlineInputRef.current?.focus();
    }
  }, [addingChildTo, node.id]);

  // Each indent level = 28px
  const paddingLeft = level * 28 + 12;

  return (
    <>
      {/* ── Node Row ─────────────────────────────────────────── */}
      <div
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        className="group relative"
      >
        {/* Vertical guide line */}
        {level > 0 && (
          <div
            className="absolute top-0 bottom-0 w-px bg-border/50"
            style={{ left: `${(level - 1) * 28 + 20}px` }}
          />
        )}
        {/* Horizontal connector */}
        {level > 0 && (
          <div
            className="absolute top-1/2 h-px w-4 bg-border/50"
            style={{ left: `${(level - 1) * 28 + 20}px` }}
          />
        )}

        <div
          className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl transition-all duration-150 ${
            isHovered ? "bg-muted/60 shadow-sm" : ""
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {/* Expand / Collapse */}
          {hasChildren ? (
            <button
              onClick={() => onToggleExpand(node.id)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Editing inline */}
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editingValue}
                onChange={(e) =>
                  setEditingValue(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveEdit(node);
                  if (e.key === "Escape") onCancelEdit();
                }}
                className="h-10 text-base placeholder:text-base"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSaveEdit(node)}
                className="h-10 w-10 p-0"
              >
                <Check className="w-5 h-5 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancelEdit}
                className="h-10 w-10 p-0"
              >
                <X className="w-5 h-5 text-red-600" />
              </Button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-base font-medium">
                {node.name}
              </span>
              <Badge
                variant="outline"
                className="text-sm px-2.5 py-0.5 shrink-0"
              >
                {node.code}
              </Badge>

              {/* Hover Actions */}
              {isHovered && !readOnly && (
                <div className="flex items-center gap-1.5 ml-2 animate-in fade-in slide-in-from-right-2 duration-200">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddChild(node)}
                    className="h-8 px-3 text-sm gap-1.5"
                    title="Add child location"
                  >
                    Add Child
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(node)}
                    className="h-8 w-8 p-0"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(node)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Inline Add Child Input ────────────────────────────── */}
      {addingChildTo === node.id && isExpanded && (
        <div
          className="flex items-center gap-2.5 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ paddingLeft: `${paddingLeft + 28}px` }}
        >
          <div className="w-6" />
          <Input
            ref={inlineInputRef}
            value={inlineChildValue}
            onChange={(e) =>
              setInlineChildValue(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSaveInlineChild(node, inlineChildValue);
                setInlineChildValue("");
              }
              if (e.key === "Escape") onCancelInline();
            }}
            placeholder="Enter location name..."
            className="h-10 text-base placeholder:text-base flex-1"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onSaveInlineChild(node, inlineChildValue);
              setInlineChildValue("");
            }}
            className="h-10 w-10 p-0"
          >
            <Check className="w-5 h-5 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelInline}
            className="h-10 w-10 p-0"
          >
            <X className="w-5 h-5 text-red-600" />
          </Button>
        </div>
      )}

      {/* ── Children ─────────────────────────────────────────── */}
      {isExpanded && hasChildren && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              editingNodeId={editingNodeId}
              editingValue={editingValue}
              setEditingValue={setEditingValue}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              addingChildTo={addingChildTo}
              onSaveInlineChild={onSaveInlineChild}
              onCancelInline={onCancelInline}
              hoveredNodeId={hoveredNodeId}
              setHoveredNodeId={setHoveredNodeId}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </>
  );
}
