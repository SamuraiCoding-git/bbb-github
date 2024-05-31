import React from 'react';
import styled from 'styled-components';

const ScoreStyled = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 24px;
  color: white;
`;

const Score = ({ value }) => {
    return <ScoreStyled>Score: {value}</ScoreStyled>;
};

export default Score;
