import { css } from '@emotion/react';

const spinnerStyles = css`
  display: flex;
  text-align: center;
  justify-content: center;
`;

const bounceDelayKeyframes = css`
  @keyframes bounce-delay {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1.0);
    }
  }
`;

const dotStyles = css`
  display: inline-block;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  margin: 6px;
  background-color: #333;
  animation: bounce-delay infinite 1.4s ease-in-out both;
`;

const dot1Styles = css`
  ${dotStyles};
  animation-delay: -0.32s;
`;

const dot2Styles = css`
  ${dotStyles};
  animation-delay: -0.16s;
`;

export default function Spinner() {
  return (
    <div css={spinnerStyles}>
      <style>{`
        ${bounceDelayKeyframes.styles}
        ${dotStyles.styles}
        ${dot1Styles.styles}
        ${dot2Styles.styles}
      `}</style>
      <div css={dot1Styles} />
      <div css={dot2Styles} />
      <div css={dotStyles} />
    </div>
  );
}
