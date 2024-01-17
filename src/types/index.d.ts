export {}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number
        email: string
      }
    }
  }
}
