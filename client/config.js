const params = new URLSearchParams(window.location.search);
export default {
  messageServerApiKey: params.get('key') || localStorage.apiKey || '',
  messageServer: 'https://api.coding.garden',
  highScoreServer: 'http://10.0.0.104:9999',
};
