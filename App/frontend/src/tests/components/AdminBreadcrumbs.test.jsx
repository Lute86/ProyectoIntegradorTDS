import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminBreadcrumbs from '../../components/layout/AdminLayout/AdminBreadcrumbs/AdminBreadcrumbs';

describe('AdminBreadcrumbs', () => {
  // Verifica que se muestra "Inicio" como primer breadcrumb
  it('renderiza Inicio como link', () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AdminBreadcrumbs />
      </MemoryRouter>
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  // Verifica que se muestra "Noticias" como pagina actual en /admin/noticias
  it('renderiza la pagina actual en la ruta', () => {
    render(
      <MemoryRouter initialEntries={['/admin/noticias']}>
        <AdminBreadcrumbs />
      </MemoryRouter>
    );
    expect(screen.getByText('Noticias')).toBeInTheDocument();
  });

  // Verifica que se muestra "Usuarios" como pagina actual en /admin/usuarios
  it('renderiza diferente pagina', () => {
    render(
      <MemoryRouter initialEntries={['/admin/usuarios']}>
        <AdminBreadcrumbs />
      </MemoryRouter>
    );
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });
});
