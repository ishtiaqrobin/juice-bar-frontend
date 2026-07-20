export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum UnitType {
  PIECE = "PIECE",
  KG = "KG",
  LITRE = "LITRE",
  ML = "ML",
  BOTTLE = "BOTTLE",
  GLASS = "GLASS",
  PACKET = "PACKET",
  BOX = "BOX",
}
