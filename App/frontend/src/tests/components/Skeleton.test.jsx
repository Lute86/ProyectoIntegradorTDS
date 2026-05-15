import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

describe('Skeleton', () => {
  // Verifica que el skeleton usa la variante text (h-4) por defecto
  it('renderiza con variante text por defecto', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('h-4');
  });

  // Verifica que la variante title aplica h-6
  it('renderiza variante title', () => {
    const { container } = render(<Skeleton variant="title" />);
    expect(container.firstChild).toHaveClass('h-6');
  });

  // Verifica que la variante avatar aplica rounded-full (circular)
  it('renderiza variante avatar (circular)', () => {
    const { container } = render(<Skeleton variant="avatar" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  // Verifica que el skeleton tiene la animacion animate-pulse
  it('tiene animacion pulse', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
