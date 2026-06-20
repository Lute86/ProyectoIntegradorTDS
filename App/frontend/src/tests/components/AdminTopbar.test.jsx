import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext/AuthContext';
import AdminTopbar from '../../components/layout/AdminLayout/AdminTopbar/AdminTopbar';

describe('AdminTopbar', () => {
  // Verifica que el titulo del topbar es "Dashboard" en la ruta /admin/dashboard
  it('renderiza Dashboard como titulo por defecto', () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AuthProvider>
          <AdminTopbar />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });

  // Verifica que el topbar contiene los breadcrumbs con la pagina actual
  it('renderiza el breadcrumbs', () => {
    render(
      <MemoryRouter initialEntries={['/admin/noticias']}>
        <AuthProvider>
          <AdminTopbar />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getAllByText('Noticias').length).toBeGreaterThanOrEqual(1);
  });
});
