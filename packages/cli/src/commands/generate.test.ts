import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';
import { generateCommand } from './generate.js';

// Mock modules
vi.mock('playwright', () => ({
  chromium: {
    launch: vi.fn(),
  },
}));

vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('get-port', () => ({
  default: vi.fn().mockResolvedValue(3000),
}));

vi.mock('chalk', () => ({
  default: {
    blue: (s: string) => s,
    green: (s: string) => s,
    red: (s: string) => s,
    gray: (s: string) => s,
    cyan: (s: string) => s,
  },
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    text: '',
  })),
}));

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs/promises';

const mockChromium = vi.mocked(chromium);
const mockSpawn = vi.mocked(spawn);
const mockFs = vi.mocked(fs);

// Helper to create mock process
function createMockProcess() {
  const proc = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter;
    stderr: EventEmitter;
    kill: ReturnType<typeof vi.fn>;
  };
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  proc.kill = vi.fn();
  return proc;
}

// Helper to create mock page
function createMockPage() {
  return {
    goto: vi.fn().mockResolvedValue(undefined),
    waitForSelector: vi.fn().mockResolvedValue(undefined),
    waitForLoadState: vi.fn().mockResolvedValue(undefined),
    waitForTimeout: vi.fn().mockResolvedValue(undefined),
    $eval: vi.fn(),
    setViewportSize: vi.fn().mockResolvedValue(undefined),
    screenshot: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  };
}

// Helper to create mock browser
function createMockBrowser(configPage: ReturnType<typeof createMockPage>, screenshotPage: ReturnType<typeof createMockPage>) {
  let pageIndex = 0;
  return {
    newPage: vi.fn(() => {
      // First call is for config, subsequent calls are for screenshots
      return Promise.resolve(pageIndex++ === 0 ? configPage : screenshotPage);
    }),
    close: vi.fn().mockResolvedValue(undefined),
  };
}

describe('generateCommand', () => {
  const originalCwd = process.cwd;
  const originalExit = process.exit;
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
    process.cwd = vi.fn(() => '/test/project');
    process.exit = vi.fn() as never;
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    process.cwd = originalCwd;
    process.exit = originalExit;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('generates screenshots successfully', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    // Simulate dev server starting
    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(mockSpawn).toHaveBeenCalledWith(
      'yarn',
      ['dev', '--port', '3000'],
      expect.objectContaining({ shell: true })
    );
    expect(mockChromium.launch).toHaveBeenCalled();
    expect(screenshotPage.screenshot).toHaveBeenCalled();
    expect(mockBrowser.close).toHaveBeenCalled();
    expect(mockProcess.kill).toHaveBeenCalled();
  });

  it('handles dev server URL from stderr', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    // Simulate dev server starting via stderr
    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stderr.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('handles multiple devices, screens, and languages', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US', 'de-DE'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67', 'APP_IPHONE_55'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }, { key: 'settings' }],
          },
          {
            key: 'ipad',
            fastlaneKeys: ['APP_IPAD_PRO'],
            width: 2732,
            height: 2048,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    // iphone: 2 screens * 2 languages * 2 fastlaneKeys = 8 screenshots
    // ipad: 1 screen * 2 languages * 1 fastlaneKey = 2 screenshots
    // Total: 10 screenshots, but screenshot is called once per page, which is per screen/language combo
    // So: iphone 2 screens * 2 languages = 4 page screenshots
    // ipad 1 screen * 2 languages = 2 page screenshots
    // Total: 6 pages, each page takes multiple screenshots based on fastlaneKeys
    expect(screenshotPage.screenshot).toHaveBeenCalledTimes(10);
  });

  it('exits with error when no languages found', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: [],
        devices: [{ key: 'iphone', fastlaneKeys: [], width: 100, height: 100, screens: [] }],
      })
    );

    const mockBrowser = createMockBrowser(configPage, createMockPage());
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('exits with error when no devices found', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [],
      })
    );

    const mockBrowser = createMockBrowser(configPage, createMockPage());
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('exits with error when config text is null', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(null);

    const mockBrowser = createMockBrowser(configPage, createMockPage());
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to read config')
    );
  });

  it('handles dev server error event', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.emit('error', new Error('Spawn error'));

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Spawn error'));
  });

  it('handles dev server exit event', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.emit('exit', 1);

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Dev server exited with code 1')
    );
  });

  it('handles general error during generation', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    mockChromium.launch.mockRejectedValue(new Error('Browser launch failed'));

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(mockProcess.kill).toHaveBeenCalled();
  });

  it('handles non-Error thrown during generation', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    mockChromium.launch.mockRejectedValue('String error');

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith('String error');
  });

  it('handles dev server timeout', async () => {
    vi.useFakeTimers();
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    // Advance timer past the 30 second timeout
    await vi.advanceTimersByTimeAsync(31000);

    await generatePromise;

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Dev server failed to start within 30 seconds')
    );

    vi.useRealTimers();
  });

  it('creates output directories', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US', 'de-DE'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'output-dir', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(mockFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining('output-dir'),
      { recursive: true }
    );
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining('en-US'),
      { recursive: true }
    );
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining('de-DE'),
      { recursive: true }
    );
  });

  it('ignores stderr URL after already resolved from stdout', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    // First resolve via stdout
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));
    // Then emit stderr (should be ignored since already resolved)
    mockProcess.stderr.emit('data', Buffer.from('Local: http://localhost:4000'));

    await generatePromise;

    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('ignores error event after already resolved', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    // First resolve via stdout
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));
    // Then emit error (should be ignored since already resolved)
    mockProcess.emit('error', new Error('Late error'));

    await generatePromise;

    // Should complete successfully, not exit with error
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('ignores exit event after already resolved', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    // First resolve via stdout
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));
    // Then emit exit (should be ignored since already resolved)
    mockProcess.emit('exit', 1);

    await generatePromise;

    // Should complete successfully, not exit with error
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('ignores duplicate stdout URL after already resolved', async () => {
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    await new Promise((resolve) => setTimeout(resolve, 10));
    // First resolve via stdout
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));
    // Emit again (should be ignored)
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));

    await generatePromise;

    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('ignores timeout after already resolved', async () => {
    vi.useFakeTimers();
    const mockProcess = createMockProcess();
    mockSpawn.mockReturnValue(mockProcess as never);

    const configPage = createMockPage();
    configPage.$eval.mockResolvedValue(
      JSON.stringify({
        languages: ['en-US'],
        devices: [
          {
            key: 'iphone',
            fastlaneKeys: ['APP_IPHONE_67'],
            width: 1290,
            height: 2796,
            screens: [{ key: 'home' }],
          },
        ],
      })
    );

    const screenshotPage = createMockPage();
    const mockBrowser = createMockBrowser(configPage, screenshotPage);
    mockChromium.launch.mockResolvedValue(mockBrowser as never);

    const generatePromise = generateCommand({ output: 'screenshots', port: '3000' });

    // Let the command start
    await vi.advanceTimersByTimeAsync(10);
    // Resolve via stdout first
    mockProcess.stdout.emit('data', Buffer.from('Local: http://localhost:3000'));
    // Now advance past the 30 second timeout (should be ignored since already resolved)
    await vi.advanceTimersByTimeAsync(31000);

    await generatePromise;

    // Should complete successfully, not exit with error
    expect(mockBrowser.close).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
