import { css } from '~styled-system/css';

export const cssMarkdown = css({
  fontSize: 'sm',
  color: 'white',
  lineHeight: '1.6',
  '& p': {
    margin: '0 0 8px 0',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& strong': {
    fontWeight: 'semibold',
    color: 'white',
  },
  '& em': {
    fontStyle: 'italic',
    color: 'zinc.300',
  },
  '& code': {
    fontSize: 'xs',
    backgroundColor: 'zinc.800',
    padding: '2px 4px',
    borderRadius: 'sm',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: 'zinc.800',
    padding: 3,
    borderRadius: 'md',
    overflow: 'auto',
    margin: '8px 0',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& ul, & ol': {
    margin: '8px 0',
    paddingLeft: 5,
  },
  '& li': {
    marginBottom: 1,
  },
  '& h1, & h2, & h3, & h4': {
    fontWeight: 'semibold',
    marginBottom: 2,
    marginTop: 3,
    color: 'white',
  },
  '& h1': { fontSize: 'lg' },
  '& h2': { fontSize: 'base' },
  '& h3': { fontSize: 'sm' },
  '& h4': { fontSize: 'xs' },
  '& a': {
    color: 'blue.400',
    textDecoration: 'underline',
    '&:hover': {
      color: 'blue.300',
    },
  },
  '& blockquote': {
    borderLeft: '2px solid',
    borderColor: 'zinc.600',
    paddingLeft: 3,
    margin: '8px 0',
    color: 'zinc.400',
    fontStyle: 'italic',
  },
});

export const cssMarkdownMessage = css({
  fontSize: 'sm',
  color: 'zinc.200',
  lineHeight: '1.5',
  margin: '2px 0 0 0',
  '& p': {
    margin: '0 0 4px 0',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& strong': {
    fontWeight: 'semibold',
    color: 'white',
  },
  '& em': {
    fontStyle: 'italic',
    color: 'zinc.300',
  },
  '& code': {
    fontSize: 'xs',
    backgroundColor: 'zinc.800',
    padding: '2px 4px',
    borderRadius: 'sm',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: 'zinc.800',
    padding: 2,
    borderRadius: 'md',
    overflow: 'auto',
    margin: '4px 0',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& ul, & ol': {
    margin: '4px 0',
    paddingLeft: 4,
  },
  '& li': {
    marginBottom: 1,
  },
  '& a': {
    color: 'blue.400',
    textDecoration: 'underline',
  },
});
