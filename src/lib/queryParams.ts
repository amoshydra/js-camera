export interface QueryParams {
  debug: boolean;
  scanner: 'browser' | 'legacy';
}

function getQueryParams(): QueryParams {
  const params = new URLSearchParams(window.location.search);

  const debug = params.get('debug') === 'true';

  const scannerParam = params.get('scanner');
  const scanner: QueryParams['scanner'] = scannerParam === 'legacy' ? 'legacy' : 'browser';

  return { debug, scanner };
}

export const queryParams = getQueryParams();
