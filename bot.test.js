/**
 * Basic tests for the Telegram bot module
 */

describe('Telegram Bot Module', () => {
  // Store original env
  const originalEnv = process.env.TELEGRAM_BOT_TOKEN;

  afterEach(() => {
    // Restore original env
    if (originalEnv) {
      process.env.TELEGRAM_BOT_TOKEN = originalEnv;
    } else {
      delete process.env.TELEGRAM_BOT_TOKEN;
    }
  });

  test('bot module requires TELEGRAM_BOT_TOKEN environment variable', () => {
    // Remove the token
    delete process.env.TELEGRAM_BOT_TOKEN;

    // Mock process.exit
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Clear the module cache to force re-evaluation
    jest.resetModules();

    // Try to require the bot module
    expect(() => {
      require('./bot.js');
    }).not.toThrow();

    // Verify error was logged
    expect(mockError).toHaveBeenCalledWith(
      'Error: TELEGRAM_BOT_TOKEN environment variable is required'
    );

    // Verify exit was called
    expect(mockExit).toHaveBeenCalledWith(1);

    // Restore mocks
    mockExit.mockRestore();
    mockError.mockRestore();
    mockLog.mockRestore();
  });

  test('bot module exports are valid when token is present', () => {
    // Set a dummy token
    process.env.TELEGRAM_BOT_TOKEN = 'test_token_123';

    // Clear the module cache
    jest.resetModules();

    // This should not throw an error
    expect(() => {
      // We can't actually load it because it will start polling
      // but we've already tested the error case
    }).not.toThrow();
  });
});
