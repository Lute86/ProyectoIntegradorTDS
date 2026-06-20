import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from '../../components/ui/Input/Input';

describe('Input', () => {
  // Verifica que el input renderiza su label
  it('renderiza label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  // Verifica que se muestra el mensaje de error pasado como prop
  it('renderiza mensaje de error', () => {
    render(<Input error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  // Verifica que el input recibe la clase border-red-500 cuando hay error
  it('aplica clase error en input', () => {
    render(<Input error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  // Verifica que el label esta asociado al input mediante el id
  it('asocia label con input via id', () => {
    render(<Input label="Nombre" id="nombre" />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  // Verifica que el input se deshabilita con la prop disabled
  it('deshabilita el input', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
