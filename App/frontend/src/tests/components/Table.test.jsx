import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Table from '../../components/ui/Table/Table';

describe('Table', () => {
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
  ];

  const data = [
    { id: 1, nombre: 'Juan', email: 'juan@test.com' },
    { id: 2, nombre: 'Ana', email: 'ana@test.com' },
  ];

  // Verifica que la tabla renderiza los encabezados de columna
  it('renderiza headers', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  // Verifica que la tabla renderiza los datos de cada fila
  it('renderiza filas de datos', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('ana@test.com')).toBeInTheDocument();
  });

  // Verifica que se muestra "Sin datos" cuando el arreglo data esta vacio
  it('muestra mensaje vacio si no hay datos', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });

  // Verifica que se puede usar un render personalizado por columna
  it('usa render personalizado', () => {
    const cols = [...columns, { key: 'accion', label: 'Accion', render: () => '✏️' }];
    render(<Table columns={cols} data={data} />);
    expect(screen.getAllByText('✏️')).toHaveLength(2);
  });
});
