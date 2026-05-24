import { describe, it, expect } from 'vitest'

// Verifica que la configuracion inicial de testing funciona correctamente
describe('Setup', () => {
  // Verifica que la assertion basica true === true pasa
  it('works', () => {
    expect(true).toBe(true)
  })
})
