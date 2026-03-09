import { styled } from '~styled-system/jsx';

export const ContentHeading = styled('h3', {
  base: {
    textAlign: 'center',
    fontSize: 'lg',
    fontWeight: 'semibold',
    marginTop: '6',
    color: 'white',
    opacity: 0.9,
  },
});

export const Button = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    borderRadius: 'lg',
    paddingX: '3.5',
    paddingY: '2.5',
    fontSize: 'sm',
    fontWeight: 'medium',
    backgroundColor: 'zinc.900',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'zinc.700',
    color: 'zinc.400',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '@media(hover: hover)': {
      _hover: {
        backgroundColor: 'zinc.800',
      },
    },
    _active: {
      backgroundColor: 'zinc.800',
    },
  },
});

export const ButtonPrimary = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    borderRadius: 'lg',
    paddingX: '4',
    paddingY: '3',
    fontSize: 'md',
    fontWeight: 'semibold',
    backgroundColor: 'blue.500',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'blue.400',
    color: 'blue.100',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '@media(hover: hover)': {
      _hover: {
        backgroundColor: 'blue.400',
      },
    },
    _active: {
      backgroundColor: 'blue.600',
    },
  },
});
