import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../../components/ui/Badge/Badge';

describe('Badge', () => {
  // Verifica que el Badge muestra el texto pasado como children
  it('renderiza texto', () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  // Verifica que la variante por defecto aplica bg-gray-100
  it('aplica variante gray por defecto', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('bg-gray-100');
  });

  // Verifica que la variante blue aplica bg-blue-100
  it('aplica variante blue', () => {
    render(<Badge variant="blue">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('bg-blue-100');
  });

  // Verifica que la variante green aplica bg-emerald-100
  it('aplica variante green', () => {
    render(<Badge variant="green">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('bg-emerald-100');
  });
});
