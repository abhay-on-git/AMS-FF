// ─── src/features/access — public API barrel ─────────────────────────────────

// Components
export { RoleTable }      from './components/RoleTable'
export { RoleDetail }     from './components/RoleDetail'
export { RoleFormDrawer } from './components/drawers/RoleFormDrawer'
export { PermissionGrid } from './components/PermissionGrid'

// Hooks
export { useRoles, useRoleDetail }                                           from './hooks/useRoles'
export { useCreateRole, useUpdateRole, useDeleteRole,
         useCloneRole, useUpdatePermissions }                                from './hooks/useRoleMutations'

// Types
export type { Role, RoleType, RoleCategory, DetailTab,
              ModulePermission, SubModulePermission,
              PermissionAction, FieldRestriction, LocationAccess }           from './types'

// Constants
export { roleColumns }                                                        from './constants/roleColumns'
