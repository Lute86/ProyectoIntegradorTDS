import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../../components/ui/Toast/Toast';

describe('Toast', () => {
  // Verifica que el toast muestra el mensaje
  it('renderiza mensaje', () => {
    render(<Toast id={1} message="Listo!" type="success" onClose={() => {}} />);
    expect(screen.getByText('Listo!')).toBeInTheDocument();
  });

  // Verifica que el tipo success aplica bg-emerald-600
  it('aplica estilo success', () => {
    render(<Toast id={1} message="OK" type="success" onClose={() => {}} />);
    expect(screen.getByText('OK').parentElement).toHaveClass('bg-emerald-600');
  });

  // Verifica que el tipo error aplica bg-red-600
  it('aplica estilo error', () => {
    render(<Toast id={1} message="Error" type="error" onClose={() => {}} />);
    expect(screen.getByText('Error').parentElement).toHaveClass('bg-red-600');
  });

  // Verifica que onClose se llama con el id al hacer click en cerrar
  it('llama onClose al hacer click en cerrar', async () => {
    const onClose = vi.fn();
    render(<Toast id={42} message="Test" onClose={onClose} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledWith(42);
  });
});
