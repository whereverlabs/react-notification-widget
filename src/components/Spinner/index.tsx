import styled, { keyframes } from 'styled-components';
import { adjustColor } from '../utils';

const spin = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }`;

type SpinnerProps = {
  size?: number;
};

const Spinner = styled.div<SpinnerProps>`
  &:after {
    border-radius: 50%;
    width: ${({ size = 50 }) => `${size}px`};
    height: ${({ size = 50 }) => `${size}px`};
  }
  border-radius: 50%;
  width: ${({ size = 50 }) => `${size}px`};
  height: ${({ size = 50 }) => `${size}px`};
  position: relative;
  text-indent: -9999em;
  border-top: ${({ theme }) => `5px solid ${adjustColor(theme.colors.primary.light, 0.3)}`};
  border-right: ${({ theme }) => `5px solid ${adjustColor(theme.colors.primary.light, 0.3)}`};
  border-bottom: ${({ theme }) => `5px solid ${adjustColor(theme.colors.primary.light, 0.3)}`};
  border-left: ${({ theme }) => `5px solid ${theme.colors.primary.main}`};
  transform: translateZ(0);
  animation: ${spin} 1.1s infinite linear;
`;

export default Spinner;
