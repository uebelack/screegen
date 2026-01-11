import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Screegen } from './Screegen';
import { ScreenPage } from './ScreenPage';
import { OverviewPage } from './OverviewPage';
import { ProjectConfig, ScreenComponentProps } from '../../types';

function MockScreenComponent({
  language,
  deviceKey,
  width,
  height,
}: ScreenComponentProps) {
  return (
    <div data-testid="mock-screen">
      MockScreen: {language} - {deviceKey} - {width}x{height}
    </div>
  );
}

const mockConfig: ProjectConfig = {
  languages: ['en-US', 'de-DE'],
  devices: [
    {
      key: 'iphone',
      fastlaneKeys: ['APP_IPHONE_67'],
      width: 1290,
      height: 2796,
      screens: [
        { key: 'overview', component: MockScreenComponent },
        { key: 'details', component: MockScreenComponent },
      ],
    },
    {
      key: 'ipad',
      fastlaneKeys: ['APP_IPAD_PRO_129'],
      width: 2732,
      height: 2048,
      screens: [{ key: 'home', component: MockScreenComponent }],
    },
  ],
};

describe('Screegen', () => {
  it('renders OverviewPage at root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Screegen config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('overview-grid')).toBeInTheDocument();
  });

  it('renders ScreengenConfig at /config path', () => {
    render(
      <MemoryRouter initialEntries={['/config']}>
        <Screegen config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('screegen-config')).toBeInTheDocument();
  });

  it('renders ScreenPage at /screens/:deviceKey/:screenKey/:language path', () => {
    render(
      <MemoryRouter initialEntries={['/screens/iphone/overview/en-US']}>
        <Screegen config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-screen')).toBeInTheDocument();
    expect(
      screen.getByText('MockScreen: en-US - iphone - 1290x2796')
    ).toBeInTheDocument();
  });
});

describe('ScreenPage', () => {
  it('renders Screen component with correct props', () => {
    render(
      <MemoryRouter initialEntries={['/screens/iphone/overview/en-US']}>
        <Routes>
          <Route
            path="/screens/:deviceKey/:screenKey/:language"
            element={<ScreenPage config={mockConfig} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-screen')).toBeInTheDocument();
    expect(
      screen.getByText('MockScreen: en-US - iphone - 1290x2796')
    ).toBeInTheDocument();
  });

  it('renders Screen for different device and language', () => {
    render(
      <MemoryRouter initialEntries={['/screens/ipad/home/de-DE']}>
        <Routes>
          <Route
            path="/screens/:deviceKey/:screenKey/:language"
            element={<ScreenPage config={mockConfig} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText('MockScreen: de-DE - ipad - 2732x2048')
    ).toBeInTheDocument();
  });

  it('renders error message when params are missing', () => {
    render(
      <MemoryRouter initialEntries={['/screens']}>
        <Routes>
          <Route path="/screens" element={<ScreenPage config={mockConfig} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Invalid screen parameters')).toBeInTheDocument();
  });
});

describe('OverviewPage', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders OverviewGrid with default values', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('overview-grid')).toBeInTheDocument();
  });

  it('uses language from URL params', () => {
    render(
      <MemoryRouter initialEntries={['/?language=de-DE']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('overview-grid')).toBeInTheDocument();
  });

  it('uses scale from URL params', () => {
    render(
      <MemoryRouter initialEntries={['/?scale=0.5']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('overview-grid')).toBeInTheDocument();
  });

  it('uses colorScheme from URL params', () => {
    render(
      <MemoryRouter initialEntries={['/?colorScheme=light']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('overview-grid')).toBeInTheDocument();
  });

  it('falls back to system color scheme when not specified', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('overview-grid')).toBeInTheDocument();
  });

  it('updates language when changed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    const languageSelect = screen.getByLabelText('Language:');
    fireEvent.change(languageSelect, { target: { value: 'de-DE' } });

    expect(languageSelect).toHaveValue('de-DE');
  });

  it('updates scale when changed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    const scaleSelect = screen.getByLabelText('Scale:');
    fireEvent.change(scaleSelect, { target: { value: '0.1' } });

    expect(scaleSelect).toHaveValue('0.1');
  });

  it('updates colorScheme when changed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <OverviewPage config={mockConfig} />
      </MemoryRouter>
    );

    const colorSchemeSelect = screen.getByLabelText('Color Scheme:');
    fireEvent.change(colorSchemeSelect, { target: { value: 'light' } });

    expect(colorSchemeSelect).toHaveValue('light');
  });
});
