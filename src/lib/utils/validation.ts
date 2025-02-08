export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2
}

export const validateCustomizations = (customizations: Record<string, number>, limits: Record<string, { min: number; max: number }>): boolean => {
  return Object.entries(customizations).every(([key, value]) => {
    const limit = limits[key]
    return value >= limit.min && value <= limit.max
  })
}

export const formatValidationErrors = (errors: Record<string, boolean>): Record<string, string> => {
  const messages: Record<string, string> = {
    phone: 'Please enter a valid phone number',
    name: 'Name must be at least 2 characters long',
    customizations: 'Some customizations exceed their limits',
  }

  return Object.entries(errors)
    .filter(([_, isValid]) => !isValid)
    .reduce((acc, [field]) => ({
      ...acc,
      [field]: messages[field],
    }), {})
} 