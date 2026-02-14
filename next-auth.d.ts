import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    role: string
    canManageProducts: boolean
    canDeleteProducts: boolean
    canManageCategories: boolean
    canDeleteCategories: boolean
    canManageBanners: boolean
    canDeleteBanners: boolean
    canManageOrders: boolean
    canDeleteOrders: boolean
    canManagePromoCodes: boolean
    canDeletePromoCodes: boolean
  }

  interface Session {
    user: User
  }

  interface JWT {
    id: string
    role: string
    canManageProducts: boolean
    canDeleteProducts: boolean
    canManageCategories: boolean
    canDeleteCategories: boolean
    canManageBanners: boolean
    canDeleteBanners: boolean
    canManageOrders: boolean
    canDeleteOrders: boolean
    canManagePromoCodes: boolean
    canDeletePromoCodes: boolean
  }
}
