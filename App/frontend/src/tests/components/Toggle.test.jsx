import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toggle from '../../components/ui/Toggle/Toggle';

describe('Toggle', () => {
  // Verifica que el toggle renderiza el label
  it('renderiza con label', () => {
    render(<Toggle label="Activar" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Activar')).toBeInTheDocument();
  });

  // Verifica que onChange recibe true al hacer click si estaba en false
  it('llama onChange con true cuando no esta chequeado', async () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  // Verifica que onChange recibe false al hacer click si estaba en true
  it('llama onChange con false cuando esta chequeado', async () => {
    const onChange = vi.fn();
    render(<Toggle checked={true} onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // Verifica que el toggle se deshabilita con la prop disabled
  it('deshabilita el toggle', () => {
    render(<Toggle disabled checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  // Verifica que el atributo aria-checked refleja el estado checked
  it('aplica aria-checked correctamente', () => {
    const { rerender } = render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Toggle checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
