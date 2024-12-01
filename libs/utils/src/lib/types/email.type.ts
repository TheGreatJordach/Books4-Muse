// Utility type for branding
import { isEmail } from 'validator';


type Brand<K, T>= K & {_brand: T}

// EmailType definition
type ValidEmail = Brand<string, 'Email'>

export function verifyEmail(email: string): ValidEmail | null  {
  return isEmail(email) ? (email as ValidEmail) : null
}
