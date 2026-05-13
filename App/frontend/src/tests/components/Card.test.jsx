import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../components/ui/Card/Card';

describe('Card', () => {
  // Verifica que la Card renderiza su contenido (children)
  it('renderiza children', () => {
    render(<Card><p>Contenido</p></Card>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  // Verifica que la Card aplica padding (p-6) por defecto
  it('aplica padding por defecto', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('p-6');
  });

  // Verifica que no se aplica padding cuando padding=false
  it('no aplica padding si padding=false', () => {
    const { container } = render(<Card padding={false}>Contenido</Card>);
    expect(container.firstChild).not.toHaveClass('p-6');
  });

  // Verifica que se aplica la sombra al hover cuando hover=true
  it('aplica hover shadow si hover=true', () => {
    const { container } = render(<Card hover>Contenido</Card>);
    expect(container.firstChild).toHaveClass('hover:shadow-md');
  });

  // Verifica que se combinan las clases adicionales via className
  it('combina className', () => {
    const { container } = render(<Card className="extra">Contenido</Card>);
    expect(container.firstChild).toHaveClass('extra');
  });
});
