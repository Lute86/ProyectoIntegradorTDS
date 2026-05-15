import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../components/ui/Modal/Modal';

describe('Modal', () => {
  // Verifica que el modal no se muestra cuando open=false
  it('no renderiza cuando open es false', () => {
    render(<Modal open={false}><p>Contenido</p></Modal>);
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
  });

  // Verifica que el modal se muestra cuando open=true
  it('renderiza cuando open es true', () => {
    render(<Modal open={true}><p>Contenido</p></Modal>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  // Verifica que el modal muestra el titulo pasado como prop
  it('renderiza titulo', () => {
    render(<Modal open={true} title="Mi Modal"><p>Contenido</p></Modal>);
    expect(screen.getByText('Mi Modal')).toBeInTheDocument();
  });

  // Verifica que al hacer click en el overlay se llama a onClose
  it('llama onClose al hacer click en overlay', async () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose}><p>Contenido</p></Modal>);
    await userEvent.click(document.querySelector('[class*="bg-black"]'));
    expect(onClose).toHaveBeenCalled();
  });

  // Verifica que el modal renderiza el footer personalizado
  it('renderiza footer', () => {
    render(<Modal open={true} footer={<button>Aceptar</button>}><p>Contenido</p></Modal>);
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
  });
});
