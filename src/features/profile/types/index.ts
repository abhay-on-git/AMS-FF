export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phone: string
  fieldOffice: string
  department: string
}

export interface UpdateProfileFormData {
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phone: string
  fieldOffice: string
  department: string
}
