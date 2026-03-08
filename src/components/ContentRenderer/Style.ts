import { styled } from '~styled-system/jsx';

export const ContentHeading = styled('h3', {
  base: {
    textAlign: 'center',
    fontSize: 'xl',
    marginTop: 6,
  },
});

export const Button = styled('button', {
  base: {
    borderRadius: 'full',
    borderWidth: 'thin',
    borderColor: 'stone.400',
    paddingX: 6,
    paddingY: 2,
    '@media(hover: hover)': {
      _hover: {
        background: 'stone.800',
      },
    },
    _active: {
      background: 'stone.800',
    },
  },
});
