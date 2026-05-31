// ─── src/features/users — public API barrel ──────────────────────────────────

// Components
export { UserTable }           from './components/UserTable'
export { UserDetail }          from './components/UserDetail'
export { UserFormDrawer }      from './components/drawers/UserFormDrawer'
export { ResetPasswordDrawer } from './components/drawers/ResetPasswordDrawer'

// Hooks
export { useUsers, useUserDetail }                                           from './hooks/useUsers'
export { useCreateUser, useUpdateUser, useDeleteUser,
         useResetPassword, useToggleUserStatus }                             from './hooks/useUserMutations'

// Types
export type { UserData, UserStatus, UserRole, DrawerMode, ResetMethod }     from './types'

// Schemas
export type { CreateUserFormData, EditUserFormData, ResetPasswordFormData }  from './schemas/userSchemas'

// Constants
export { roleOptions, statusOptions, fieldOfficeOptions, countryCodeOptions } from './constants/userOptions'
export { userColumns }                                                        from './constants/userColumns'
