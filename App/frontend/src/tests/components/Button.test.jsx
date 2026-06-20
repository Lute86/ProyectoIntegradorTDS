import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/ui/Button/Button';

describe('Button', () => {
  // Verifica que el boton muestra el texto pasado como children
  it('renderiza con texto', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });

  // Verifica que la variante por defecto aplica la clase primary (bg-[var(--color-primary)])
  it('aplica variante primary por defecto', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-primary)]');
  });

  // Verifica que la variante outline aplica la clase border
  it('aplica variante outline', () => {
    render(<Button variant="outline">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });

  // Verifica que el boton se deshabilita cuando loading es true
  it('deshabilita cuando loading es true', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // Verifica que se muestra un svg (spinner) cuando loading es true
  it('muestra spinner cuando loading es true', () => {
    render(<Button loading>Click</Button>);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  // Verifica que el boton ejecuta la funcion onClick al hacer click
  it('dispara onClick', async () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });
});
