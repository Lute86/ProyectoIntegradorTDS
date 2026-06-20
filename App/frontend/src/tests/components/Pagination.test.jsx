import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../../components/ui/Pagination/Pagination';

describe('Pagination', () => {
  // Verifica que no se renderiza nada si solo hay 1 pagina
  it('no renderiza cuando total es 1', () => {
    const { container } = render(<Pagination current={1} total={1} onChange={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  // Verifica que se renderizan los botones para cada pagina
  it('renderiza botones de pagina', () => {
    render(<Pagination current={1} total={3} onChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // Verifica que la pagina activa tiene la clase bg-blue-600
  it('muestra pagina actual con clase activa', () => {
    render(<Pagination current={2} total={3} onChange={() => {}} />);
    expect(screen.getByText('2')).toHaveClass('bg-blue-600');
  });

  // Verifica que onChange se llama con el numero de pagina al hacer click
  it('llama onChange al hacer click', async () => {
    const onChange = vi.fn();
    render(<Pagination current={1} total={3} onChange={onChange} />);
    await userEvent.click(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  // Verifica que el boton Anterior esta deshabilitado en la primera pagina
  it('deshabilita Anterior en pagina 1', () => {
    render(<Pagination current={1} total={3} onChange={() => {}} />);
    expect(screen.getByText('Anterior')).toBeDisabled();
  });

  // Verifica que el boton Siguiente esta deshabilitado en la ultima pagina
  it('deshabilita Siguiente en ultima pagina', () => {
    render(<Pagination current={3} total={3} onChange={() => {}} />);
    expect(screen.getByText('Siguiente')).toBeDisabled();
  });
});
