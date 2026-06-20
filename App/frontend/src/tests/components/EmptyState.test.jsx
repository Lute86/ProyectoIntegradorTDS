import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../../components/ui/EmptyState/EmptyState';

describe('EmptyState', () => {
  // Verifica que EmptyState muestra el titulo y la descripcion
  it('renderiza titulo y descripcion', () => {
    render(<EmptyState title="Sin datos" description="No hay elementos para mostrar" />);
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.getByText('No hay elementos para mostrar')).toBeInTheDocument();
  });

  // Verifica que EmptyState muestra el icono pasado como prop
  it('renderiza icono', () => {
    render(<EmptyState icon="📭" title="Vacio" />);
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  // Verifica que EmptyState renderiza el elemento action pasado como prop
  it('renderiza action', () => {
    render(<EmptyState title="Vacio" action={<button>Crear</button>} />);
    expect(screen.getByText('Crear')).toBeInTheDocument();
  });
});
