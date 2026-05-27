import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate } from "../utils/dateFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Add as PlusIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as Trash2Icon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  MoreHoriz,
} from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  TablePagination,
  paginateData,
} from "./shared/TablePagination";
import { FileUploadDrawer } from "./shared/FileUploadDrawer";
import { DeleteConfirmDialog } from "./shared/DeleteConfirmDialog";
import { toast } from "sonner";
import { ColumnToggle } from "./assets/ColumnToggle";
import type { ColumnConfig } from "./assets/types";

interface Category {
  id: string;
  categoryCode: string;
  categoryName: string;
  parentCategory?: string;
  status: "active" | "inactive";
  description?: string;
  createdDate: string;
}

const defaultColumns: ColumnConfig[] = [
  {
    key: "categoryName",
    label: "Category Name",
    visible: true,
    category: "default",
  },
  {
    key: "status",
    label: "Status",
    visible: true,
    category: "default",
  },
  {
    key: "description",
    label: "Description",
    visible: true,
    category: "default",
  },
  {
    key: "createdDate",
    label: "Created Date",
    visible: true,
    category: "default",
  },
];

export default function Categories() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bulkUploadDrawerOpen, setBulkUploadDrawerOpen] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);
  const [columns, setColumns] =
    useState<ColumnConfig[]>(defaultColumns);

  const [categories] = useState<Category[]>([
    {
      id: "1",
      categoryCode: "LAP",
      categoryName: "Laptop",
      status: "active",
      description: "Portable computers",
      createdDate: "2024-01-15",
    },
    {
      id: "2",
      categoryCode: "DES",
      categoryName: "Desktop",
      status: "active",
      description: "Desktop computers",
      createdDate: "2024-01-15",
    },
    {
      id: "3",
      categoryCode: "PRN",
      categoryName: "Printer",
      status: "active",
      description: "Printing devices",
      createdDate: "2024-01-15",
    },
    {
      id: "4",
      categoryCode: "MON",
      categoryName: "Monitor",
      status: "active",
      description: "Display screens",
      createdDate: "2024-01-16",
    },
    {
      id: "5",
      categoryCode: "SRV",
      categoryName: "Server",
      status: "active",
      description: "Server equipment",
      createdDate: "2024-01-16",
    },
    {
      id: "6",
      categoryCode: "NET",
      categoryName: "Network Equipment",
      status: "active",
      description: "Routers, switches, etc.",
      createdDate: "2024-01-20",
    },
  ]);

  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    parentCategory: "none",
    description: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState<
    Record<string, string>
  >({});

  const isEditMode = editingCategory !== null;
  const drawerOpen = isCreateDialogOpen || isEditMode;

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      categoryCode: "",
      categoryName: "",
      parentCategory: "none",
      description: "",
      status: "active",
    });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      categoryCode: category.categoryCode,
      categoryName: category.categoryName,
      parentCategory: category.parentCategory || "none",
      description: category.description || "",
      status: category.status,
    });
    setFormErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleDrawerClose = (open: boolean) => {
    if (!open) {
      setIsCreateDialogOpen(false);
      setEditingCategory(null);
      setFormData({
        categoryCode: "",
        categoryName: "",
        parentCategory: "none",
        description: "",
        status: "active",
      });
      setFormErrors({});
    }
  };

  const handleSaveCategory = () => {
    const errors: Record<string, string> = {};
    if (!formData.categoryName.trim())
      errors.categoryName = "Category name is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    handleDrawerClose(false);
  };

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, visible: !c.visible } : c,
      ),
    );
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.categoryName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      category.categoryCode
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (category.description &&
        category.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-700 dark:text-green-300";
      case "inactive":
        return "text-gray-700 dark:text-gray-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center text-[15px] justify-end">
        <Button
          onClick={handleOpenCreate}
          className="text-[15px]"
        >
          Add Category
        </Button>
      </div>

      {/* ── Add Category Side Drawer ── */}
      <Sheet open={drawerOpen} onOpenChange={handleDrawerClose}>
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-xl flex flex-col h-full p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-2 shrink-0">
            <SheetTitle className="text-[15px]">
              {isEditMode ? "Edit Category" : "Add Category"}
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Add a new asset category.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="categoryName"
                  className="text-[15px] font-medium"
                >
                  Category Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Laptop"
                  value={formData.categoryName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      categoryName: e.target.value,
                    });
                    setFormErrors({});
                  }}
                  className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.categoryName ? "border-red-500" : ""}`}
                />
                {formErrors.categoryName && (
                  <p className="text-xs text-red-500">
                    {formErrors.categoryName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[15px] font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="text-[15px] placeholder:text-[14px]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-[15px] font-medium"
                >
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger
                    id="status"
                    className="h-[52px] text-[15px]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="active">
                      Active
                    </SelectItem>
                    <SelectItem value="inactive">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="shrink-0 border-t bg-background p-4">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDrawerClose(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCategory}
                className="text-[15px]"
              >
                {isEditMode
                  ? "Update Category"
                  : "Add Category"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-[15px]"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-40 text-[15px] pr-2 [&>svg]:right-2">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem className="text-[15px]" value="all">
                  All Status
                </SelectItem>
                <SelectItem
                  className="text-[15px]"
                  value="active"
                >
                  Active
                </SelectItem>
                <SelectItem
                  className="text-[15px]"
                  value="inactive"
                >
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
            <ColumnToggle
              columns={columns}
              onToggle={toggleColumn}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-380px)] scrollbar-hide ">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <TableHead
                          className="text-[15px]"
                          key={col.key}
                        >
                          {col.label}
                        </TableHead>
                      ))}
                    <TableHead className="w-24 text-[15px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginateData(
                    filteredCategories,
                    page,
                    rowsPerPage,
                  ).map((category) => (
                    <TableRow key={category.id} className="/50">
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => {
                          const value =
                            col.key === "categoryName"
                              ? category.categoryName
                              : col.key === "status"
                                ? category.status
                                : col.key === "description"
                                  ? category.description
                                  : col.key === "createdDate"
                                    ? category.createdDate
                                    : col.key === "categoryCode"
                                      ? category.categoryCode
                                      : col.key ===
                                          "parentCategory"
                                        ? category.parentCategory
                                        : "";

                          if (col.key === "categoryName") {
                            return (
                              <TableCell
                                key={col.key}
                                className="font-medium text-[15px]"
                              >
                                {value}
                              </TableCell>
                            );
                          } else if (col.key === "status") {
                            return (
                              <TableCell
                                key={col.key}
                                className="font-medium text-[15px]"
                              >
                                <span
                                  className={getStatusColor(
                                    value as string,
                                  )}
                                >
                                  {(value as string)
                                    .charAt(0)
                                    .toUpperCase() +
                                    (value as string).slice(1)}
                                </span>
                              </TableCell>
                            );
                          } else if (
                            col.key === "createdDate"
                          ) {
                            return (
                              <TableCell
                                key={col.key}
                                className="font-medium text-[15px]"
                              >
                                {formatDate(value as string)}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                key={col.key}
                                className="font-medium text-[15px]"
                              >
                                {value || "—"}
                              </TableCell>
                            );
                          }
                        })}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHoriz className="w-8 h-8 rotate-90" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleOpenEdit(category)
                              }
                            >
                              <EditIcon className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCategoryToDelete(category);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2Icon className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              totalItems={filteredCategories.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              totalUnfilteredItems={categories.length}
              itemLabel="categories"
            />
          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-lg text-muted-foreground">
              <p>No categories found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}

      {/* ── Bulk Upload Drawer ── */}
      <FileUploadDrawer
        open={bulkUploadDrawerOpen}
        onOpenChange={setBulkUploadDrawerOpen}
        title="Bulk Upload Categories"
        description="Upload a CSV or Excel file containing category data. Download the template first to ensure correct format."
        acceptedTypes={[
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ]}
        maxFiles={1}
        maxFileSize={10}
        onUploadComplete={(files) => {
          toast.success(
            `${files[0]?.name} uploaded — categories queued for import`,
          );
        }}
      />

      {/* ── Delete Confirm Dialog ── */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete category"${categoryToDelete?.categoryName || ""}" (${categoryToDelete?.categoryCode || ""})? Assets assigned to this category may need to be reassigned. This action cannot be undone.`}
        confirmLabel="Delete Category"
        onConfirm={() => {
          if (categoryToDelete) {
            toast.success(
              `Category"${categoryToDelete.categoryName}" deleted`,
            );
            setCategoryToDelete(null);
          }
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}
